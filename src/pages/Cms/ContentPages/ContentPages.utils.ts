import { docsPath, EMPTY_STRING, SITE_URL } from '@const/index';
import { isStringValue } from '@utils';
import {
  PAYLOAD_KEY_LAYOUT,
  PAYLOAD_KEY_TEMPLATE,
} from '@pages/Cms/ContentEdit/ContentEdit.const';
import type { Messages } from '@i18n/types';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import { createNamedCastField } from '@pages/Cms/CastPages/CastPages.utils';
import type { CastField } from '@pages/Cms/CastPages/CastPages.types';
import {
  CONTENT_COLLECTION_DOCS,
  CONTENT_STATUS_CLASS,
  CONTENT_STATUS_CLASS_FALLBACK,
  CONTENT_STATUS_DRAFT,
  CONTENT_STATUS_PUBLISHED,
  DOCS_FIELD_DEFAULTS,
  DOCS_FIELD_NAME,
  DOCS_LAYOUT_IDS,
} from './ContentPages.const';
import type { ContentTableRow } from './ContentPages.types';

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

export const openContentRowTarget = (row: ContentTableRow): void => {
  if (row.collection !== CONTENT_COLLECTION_DOCS) return;
  const url = resolveDocsPublicUrl(row.slug);
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const contentStatusClass = (status: string): string => {
  const key = status.toLowerCase();
  if (key === CONTENT_STATUS_PUBLISHED) return CONTENT_STATUS_CLASS[CONTENT_STATUS_PUBLISHED];
  if (key === CONTENT_STATUS_DRAFT) return CONTENT_STATUS_CLASS[CONTENT_STATUS_DRAFT];
  return CONTENT_STATUS_CLASS_FALLBACK;
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
