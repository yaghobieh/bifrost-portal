import { NAV_GROUPS } from '@const/nav.const';
import { ROUTES } from '@const/routes.const';
import { blogPostPath, DOC_PATH } from '@const/routes.utils';
import { EMPTY_STRING, SPACE } from '@const/strings.const';
import type { ContentItem } from '@sdk/modules/content';
import { mapCmsDoc } from './docs.mapper';
import type { CmsDocItem, DocPageModel, DocSearchHit } from './docs.types';
import {
  SEARCH_BLOG_ID_PREFIX,
  SEARCH_BLOG_PAGE_ID,
  SEARCH_BLOG_TAG_KEY,
  SEARCH_CRUMB_SEP,
  SEARCH_DOCS_TAG_KEY,
  SITE_SEARCH_PAGES,
} from './docsSearch.const';
import type { SearchIndexEntry, SearchTitleOf } from './docsSearch.types';

const asSearchText = (value: unknown): string => {
  if (typeof value !== 'string') {
    return EMPTY_STRING;
  }
  return value;
};

const joinHaystack = (parts: string[]): string =>
  parts
    .filter((part) => part.length > 0)
    .join(SPACE)
    .toLowerCase();

const crumbTag = (crumb: string): string => {
  const first = crumb.split(SEARCH_CRUMB_SEP)[0];
  if (!first) {
    return EMPTY_STRING;
  }
  return first.trim();
};

export const haystackFromDoc = (doc: DocPageModel): string => {
  const parts: string[] = [doc.title, doc.lead, doc.crumb, doc.slug];
  doc.sections.forEach((section) => {
    parts.push(section.heading, ...section.paragraphs);
    if (section.callout) {
      parts.push(section.callout);
    }
    if (section.code) {
      parts.push(section.code.source);
    }
    if (!section.table) {
      return;
    }
    parts.push(...section.table.headers);
    section.table.rows.forEach((row) => {
      parts.push(...row);
    });
  });
  return joinHaystack(parts);
};

const haystackFromBlog = (item: ContentItem): string => {
  const payload = item.payload ?? {};
  return joinHaystack([
    item.title,
    item.slug,
    asSearchText(payload.excerpt),
    asSearchText(payload.lead),
    asSearchText(payload.title),
  ]);
};

const toHit = (entry: SearchIndexEntry): DocSearchHit => ({
  id: entry.id,
  slug: entry.slug,
  path: entry.path,
  title: entry.title,
  tag: entry.tag,
});

const upsertEntry = (
  index: Map<string, SearchIndexEntry>,
  entry: SearchIndexEntry,
): void => {
  const existing = index.get(entry.path);
  if (!existing) {
    index.set(entry.path, entry);
    return;
  }
  existing.haystack = joinHaystack([existing.haystack, entry.haystack]);
};

export const buildSearchIndex = (params: {
  titleOf: SearchTitleOf;
  cmsItems?: CmsDocItem[];
  blogItems?: ContentItem[];
  blogPath?: string;
}): SearchIndexEntry[] => {
  const { titleOf, cmsItems, blogItems, blogPath } = params;
  const index = new Map<string, SearchIndexEntry>();
  const resolvedBlogPath = blogPath || ROUTES.BLOG;

  NAV_GROUPS.forEach((group) => {
    const tag = titleOf(group.labelKey);
    group.items.forEach((item) => {
      const title = titleOf(item.titleKey);
      upsertEntry(index, {
        id: item.slug,
        slug: item.slug,
        path: item.path,
        title,
        tag,
        haystack: joinHaystack([title, item.slug, tag]),
      });
    });
  });

  SITE_SEARCH_PAGES.forEach((page) => {
    const path = page.id === SEARCH_BLOG_PAGE_ID ? resolvedBlogPath : page.path;
    const title = titleOf(page.titleKey);
    const tag = titleOf(page.tagKey);
    upsertEntry(index, {
      id: page.id,
      slug: page.slug,
      path,
      title,
      tag,
      haystack: joinHaystack([title, page.slug, tag]),
    });
  });

  cmsItems?.forEach((item) => {
    const mapped = mapCmsDoc(item);
    const path = DOC_PATH(item.slug);
    const existing = index.get(path);
    const haystack = haystackFromDoc(mapped);
    if (existing) {
      existing.haystack = joinHaystack([existing.haystack, haystack]);
      return;
    }
    const tag = crumbTag(mapped.crumb) || titleOf(SEARCH_DOCS_TAG_KEY);
    upsertEntry(index, {
      id: item.slug,
      slug: item.slug,
      path,
      title: mapped.title || item.title,
      tag,
      haystack,
    });
  });

  blogItems?.forEach((item) => {
    const path = blogPostPath(item.slug, resolvedBlogPath);
    const tag = titleOf(SEARCH_BLOG_TAG_KEY);
    upsertEntry(index, {
      id: `${SEARCH_BLOG_ID_PREFIX}${item.slug}`,
      slug: item.slug,
      path,
      title: item.title,
      tag,
      haystack: haystackFromBlog(item),
    });
  });

  return Array.from(index.values());
};

export const matchSearchEntries = (params: {
  query: string;
  entries: SearchIndexEntry[];
}): DocSearchHit[] => {
  const { query, entries } = params;
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return entries.map(toHit);
  }
  return entries.filter((entry) => entry.haystack.includes(needle)).map(toHit);
};

export const isDocsSearchHit = (hit: DocSearchHit): boolean => {
  if (hit.path === ROUTES.DOCS) {
    return true;
  }
  return hit.path.startsWith(`${ROUTES.DOCS}/`);
};
