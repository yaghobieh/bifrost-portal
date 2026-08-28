import { docsPath, EMPTY_STRING, SITE_URL } from '@const/index';
import { NAV_GROUPS } from '@const/nav.const';
import { isStringValue, titleFromSlug } from '@utils';
import {
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_LAYOUT,
  PAYLOAD_KEY_TEMPLATE,
  PAYLOAD_KEY_UPDATED_BY,
} from '@pages/Cms/ContentEdit/ContentEdit.const';
import type { Messages } from '@i18n/types';
import type { ContentTableRow } from './ContentPages.types';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import { createNamedCastField } from '@pages/Cms/CastPages/CastPages.utils';
import type { CastField } from '@pages/Cms/CastPages/CastPages.types';
import {
  CONTENT_COLLECTION_DOCS,
  CONTENT_COLLECTION_PAGES,
  CONTENT_STATUS_CLASS,
  CONTENT_STATUS_DRAFT,
  CONTENT_STATUS_PUBLISHED,
  DOC_CATALOG_ID_PREFIX,
  DOCS_FIELD_DEFAULTS,
  DOCS_FIELD_NAME,
  DOCS_LAYOUT_IDS,
  MARKETING_LAYOUT_IDS,
  TEMPLATE_KIND,
} from './ContentPages.const';
import { PAGE_START_LAYOUT } from './helpers/PageStart';

export const formatContentUpdated = (iso: string, locale: string): string => {
  if (!iso) return EMPTY_STRING;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(locale);
};

export const resolveDocsPublicUrl = (slug: string): string => {
  if (import.meta.env.DEV) {
    return docsPath(slug);
  }
  return `${SITE_URL}${docsPath(slug)}`;
};

export const templateFromPayload = (payload: Record<string, unknown>): string => {
  const template = payload[PAYLOAD_KEY_TEMPLATE];
  if (isStringValue(template) && template) return template;
  const layout = payload[PAYLOAD_KEY_LAYOUT];
  if (isStringValue(layout) && layout) return layout;
  return EMPTY_STRING;
};

export const isDocsCatalogCollection = (collection: string): boolean => {
  if (collection === CONTENT_COLLECTION_DOCS) {
    return true;
  }
  if (collection === CONTENT_COLLECTION_PAGES) {
    return true;
  }
  return false;
};

export const openContentRowTarget = (row: ContentTableRow): void => {
  if (!isDocsCatalogCollection(row.collection)) {
    return;
  }
  const url = resolveDocsPublicUrl(row.slug);
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const contentStatusClass = (status: string): string => {
  const key = status.toLowerCase();
  if (key === CONTENT_STATUS_PUBLISHED) return CONTENT_STATUS_CLASS[CONTENT_STATUS_PUBLISHED];
  if (key === CONTENT_STATUS_DRAFT) return CONTENT_STATUS_CLASS[CONTENT_STATUS_DRAFT];
  return 'bifrost-cms-status';
};

export const contentStatusLabel = (status: string, copy: Messages['dashboard']): string => {
  const key = status.toLowerCase();
  if (key === CONTENT_STATUS_PUBLISHED) return copy.contentStatusPublished;
  if (key === CONTENT_STATUS_DRAFT) return copy.contentStatusDraft;
  return status;
};

export const isDocsLayout = (layoutId: string): boolean => {
  if (layoutId === DOCS_LAYOUT_IDS.DOCUMENTATION) {
    return true;
  }
  if (layoutId === DOCS_LAYOUT_IDS.DOCS_ARTICLE) {
    return true;
  }
  return false;
};

const isMarketingLayout = (layout: string): boolean =>
  MARKETING_LAYOUT_IDS.some((id) => id === layout);

export const payloadActor = (
  payload: Record<string, unknown>,
  key: typeof PAYLOAD_KEY_CREATED_BY | typeof PAYLOAD_KEY_UPDATED_BY,
): string => {
  const value = payload[key];
  if (isStringValue(value) && value) {
    return value;
  }
  return EMPTY_STRING;
};

export { titleFromSlug };

export const catalogDocId = (slug: string): string => `${DOC_CATALOG_ID_PREFIX}${slug}`;

export const isCatalogDocId = (id: string): boolean => id.startsWith(DOC_CATALOG_ID_PREFIX);

export const slugFromCatalogId = (id: string): string => id.slice(DOC_CATALOG_ID_PREFIX.length);

export const catalogDocSlugs = (): string[] =>
  NAV_GROUPS.flatMap((group) => group.items.map((item) => item.slug));

export const uniqueSlugs = (slugs: string[]): string[] => {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) {
      continue;
    }
    seen.add(slug);
    next.push(slug);
  }
  return next;
};

export const templateKindFromPayload = (
  payload: Record<string, unknown>,
  collection: string,
): string => {
  const layout = payload[PAYLOAD_KEY_LAYOUT];
  const layoutId = isStringValue(layout) ? layout : EMPTY_STRING;
  if (isDocsLayout(layoutId) || collection === CONTENT_COLLECTION_DOCS) {
    return TEMPLATE_KIND.DOC;
  }
  if (isMarketingLayout(layoutId)) {
    return TEMPLATE_KIND.MARKETING;
  }
  if (layoutId === PAGE_START_LAYOUT.BLANK) {
    return TEMPLATE_KIND.BLANK;
  }
  return TEMPLATE_KIND.PAGE;
};

export const buildDocsCastFields = (): CastField[] => [
  createNamedCastField({
    id: 'docs-title-1',
    name: DOCS_FIELD_NAME.TITLE_1,
    label: 'Title 1',
    type: CAST_FIELD_TYPE.TEXT,
  }),
  createNamedCastField({
    id: 'docs-subtitle-1',
    name: DOCS_FIELD_NAME.SUBTITLE_1,
    label: 'Subtitle 1',
    type: CAST_FIELD_TYPE.TEXTAREA,
  }),
  createNamedCastField({
    id: 'docs-title-2',
    name: DOCS_FIELD_NAME.TITLE_2,
    label: 'Title 2',
    type: CAST_FIELD_TYPE.TEXT,
  }),
  createNamedCastField({
    id: 'docs-subtitle-2',
    name: DOCS_FIELD_NAME.SUBTITLE_2,
    label: 'Subtitle 2',
    type: CAST_FIELD_TYPE.TEXTAREA,
  }),
  createNamedCastField({
    id: 'docs-title-3',
    name: DOCS_FIELD_NAME.TITLE_3,
    label: 'Title 3',
    type: CAST_FIELD_TYPE.TEXT,
  }),
  createNamedCastField({
    id: 'docs-subtitle-3',
    name: DOCS_FIELD_NAME.SUBTITLE_3,
    label: 'Subtitle 3',
    type: CAST_FIELD_TYPE.TEXTAREA,
  }),
  createNamedCastField({
    id: 'docs-title-4',
    name: DOCS_FIELD_NAME.TITLE_4,
    label: 'Title 4',
    type: CAST_FIELD_TYPE.TEXT,
  }),
  createNamedCastField({
    id: 'docs-subtitle-4',
    name: DOCS_FIELD_NAME.SUBTITLE_4,
    label: 'Subtitle 4',
    type: CAST_FIELD_TYPE.TEXTAREA,
  }),
  createNamedCastField({
    id: 'docs-bash',
    name: DOCS_FIELD_NAME.BASH,
    label: 'Bash',
    type: CAST_FIELD_TYPE.TEXTAREA,
  }),
];

export const docsCastValues = (): Record<string, string> => ({ ...DOCS_FIELD_DEFAULTS });

export const docsHtmlFromValues = (values: Record<string, string>): string => {
  const pairs: Array<[string, string]> = [
    [DOCS_FIELD_NAME.TITLE_1, DOCS_FIELD_NAME.SUBTITLE_1],
    [DOCS_FIELD_NAME.TITLE_2, DOCS_FIELD_NAME.SUBTITLE_2],
    [DOCS_FIELD_NAME.TITLE_3, DOCS_FIELD_NAME.SUBTITLE_3],
    [DOCS_FIELD_NAME.TITLE_4, DOCS_FIELD_NAME.SUBTITLE_4],
  ];
  const sections = pairs.map((pair) => {
    const title = values[pair[0]] || EMPTY_STRING;
    const body = values[pair[1]] || EMPTY_STRING;
    return `<h2>${title}</h2><p>${body}</p>`;
  });
  const bash = values[DOCS_FIELD_NAME.BASH] || EMPTY_STRING;
  return `${sections.join('')}<pre><code>${bash}</code></pre>`;
};
