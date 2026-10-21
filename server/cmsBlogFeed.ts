import { neon } from '@neondatabase/serverless';
import {
  COLLECTION_BLOG,
  COLLECTION_PAGES,
  EMPTY_STRING,
  ERROR_INTERNAL,
  HTTP_STATUS_OK,
  PAGE_KIND_ARTICLE,
  PATH_SEGMENT_POSTS,
  PAYLOAD_KIND_KEY,
  QUERY_SLUG,
} from './cmsAuth.const';
import type { CmsAdminContentItem, CmsAdminContentRow, CmsAuthResult } from './cmsAuth.types';
import { firstRow } from './cmsAuth.utils';
import {
  CMS_CONTENT_STATUS_PUBLISHED,
  CMS_DOCS_LOCALE,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from './cmsDocs.const';

const toIso = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : value;

const parsePayload = (value: Record<string, unknown> | string): Record<string, unknown> => {
  if (typeof value === 'string') {
    return JSON.parse(value) as Record<string, unknown>;
  }
  return value ?? {};
};

const mapItem = (row: CmsAdminContentRow): CmsAdminContentItem => ({
  id: row.id,
  collection: row.collection,
  slug: row.slug,
  locale: row.locale,
  title: row.title,
  payload: parsePayload(row.payload),
  status: row.status,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

const isArticlePage = (item: CmsAdminContentItem): boolean => {
  if (item.collection !== COLLECTION_PAGES) {
    return false;
  }
  return item.payload[PAYLOAD_KIND_KEY] === PAGE_KIND_ARTICLE;
};

const isBlogFeedItem = (item: CmsAdminContentItem): boolean => {
  if (item.collection === COLLECTION_BLOG) {
    return true;
  }
  return isArticlePage(item);
};

const dedupeBlogBySlug = (items: CmsAdminContentItem[]): CmsAdminContentItem[] => {
  const bySlug = new Map<string, CmsAdminContentItem>();
  for (const item of items) {
    const existing = bySlug.get(item.slug);
    if (!existing) {
      bySlug.set(item.slug, item);
      continue;
    }
    if (item.collection === COLLECTION_BLOG && existing.collection !== COLLECTION_BLOG) {
      bySlug.set(item.slug, item);
    }
  }
  return [...bySlug.values()].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
};

export const findPublishedBlogBySlug = async (params: {
  databaseUrl: string;
  slug: string;
}): Promise<CmsAdminContentItem | null> => {
  const { databaseUrl, slug } = params;
  const sql = neon(databaseUrl);
  const blogRows = (await sql`
    SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
    FROM cms_content
    WHERE collection = ${COLLECTION_BLOG}
      AND slug = ${slug}
      AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
      AND locale = ${CMS_DOCS_LOCALE}
    LIMIT 1
  `) as CmsAdminContentRow[];
  const blogRow = firstRow<CmsAdminContentRow>(blogRows);
  if (blogRow) {
    return mapItem(blogRow);
  }
  const pageRows = (await sql`
    SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
    FROM cms_content
    WHERE collection = ${COLLECTION_PAGES}
      AND slug = ${slug}
      AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
      AND locale = ${CMS_DOCS_LOCALE}
    LIMIT 1
  `) as CmsAdminContentRow[];
  const pageRow = firstRow<CmsAdminContentRow>(pageRows);
  if (!pageRow) {
    return null;
  }
  const item = mapItem(pageRow);
  if (!isBlogFeedItem(item)) {
    return null;
  }
  return item;
};

export const listPublishedBlog = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl } = params;
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`
      SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
      FROM cms_content
      WHERE status = ${CMS_CONTENT_STATUS_PUBLISHED}
        AND locale = ${CMS_DOCS_LOCALE}
        AND (
          collection = ${COLLECTION_BLOG}
          OR (
            collection = ${COLLECTION_PAGES}
            AND payload->>'kind' = ${PAGE_KIND_ARTICLE}
          )
        )
      ORDER BY updated_at DESC
    `) as CmsAdminContentRow[];
    return { status: HTTP_STATUS_OK, body: { items: dedupeBlogBySlug(rows.map(mapItem)) } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const publishedBlogBySlug = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  const url = new URL(request.url);
  const fromQuery = (url.searchParams.get(QUERY_SLUG) ?? EMPTY_STRING).trim();
  const parts = url.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? EMPTY_STRING;
  const slug = fromQuery || last;
  if (!slug || slug === PATH_SEGMENT_POSTS) {
    return { status: HTTP_STATUS_OK, body: { item: null } };
  }
  try {
    const item = await findPublishedBlogBySlug({ databaseUrl, slug });
    if (!item) {
      return { status: HTTP_STATUS_OK, body: { item: null } };
    }
    return { status: HTTP_STATUS_OK, body: { item } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};
