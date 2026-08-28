import { DOCUMENT_CLOUDINARY_IMAGE_SRC } from '@const/docsCloudinary.const';

export const CONTENT_KIND_PAGE = 'page';
export const CONTENT_KIND_ITEM = 'item';

export type ContentKind = typeof CONTENT_KIND_PAGE | typeof CONTENT_KIND_ITEM;

export const CONTENT_COLLECTION_DOCS = 'docs';
export const CONTENT_COLLECTION_PAGES = 'pages';
export const CONTENT_COLLECTION_TEMPLATES = 'templates';
export const CONTENT_COLLECTION_PAGE_META = 'page-meta';
export const CONTENT_LIST_COLLECTIONS = [
  CONTENT_COLLECTION_DOCS,
  CONTENT_COLLECTION_PAGES,
] as const;

export const DOCUMENT_TEMPLATE_ID = 'document';
export const DOCS_LAYOUT_IDS = {
  DOCUMENTATION: 'documentation',
  DOCS_ARTICLE: 'docs-article',
} as const;

export const DOCS_FIELD_NAME = {
  TITLE_1: 'title1',
  SUBTITLE_1: 'subtitle1',
  TITLE_2: 'title2',
  SUBTITLE_2: 'subtitle2',
  TITLE_3: 'title3',
  SUBTITLE_3: 'subtitle3',
  TITLE_4: 'title4',
  SUBTITLE_4: 'subtitle4',
  BASH: 'bash',
} as const;
export const DOCUMENT_SLUG_PREFIX = 'document-';
export const DOCUMENT_IMAGE_SRC =
  DOCUMENT_CLOUDINARY_IMAGE_SRC || '/docs/installation.svg';
export const DOCUMENT_IMAGE_ALT = 'Install Ink and mount the editor';
export const DOCUMENT_DEFAULT_LOCALE = 'en';
export const DOCUMENT_STARTER_STATUS = 'draft' as const;

export const DOCUMENT_STARTER_BLOCKS = [
  {
    type: 'image',
    src: DOCUMENT_IMAGE_SRC,
    alt: DOCUMENT_IMAGE_ALT,
  },
  {
    type: 'p',
    text: 'Ink is a React rich-text editor that stores content as HTML and exposes structured side-channel state (comments, track changes) as JSON-friendly payloads. Install the package once, import styles once, then mount InkEditor in any form or document surface.',
  },
  {
    type: 'steps',
    title: 'What you get',
    items: [
      {
        title: 'npm package',
        body: 'Adds the editor runtime, toolbar presets, and CSS entry under @forgedevstack/ink.',
      },
      {
        title: 'Styles entry',
        body: 'One import of @forgedevstack/ink/styles.css at the app root styles the chrome and content.',
      },
      {
        title: 'Controlled mount',
        body: 'value / onChange keeps the parent as source of truth — ideal for forms and save APIs.',
      },
    ],
  },
  { type: 'code', language: 'bash', code: 'npm install @forgedevstack/ink' },
  {
    type: 'code',
    language: 'tsx',
    code: `import { InkEditor } from '@forgedevstack/ink';
import '@forgedevstack/ink/styles.css';`,
  },
];

export const DOCS_FIELD_DEFAULTS: Record<string, string> = {
  [DOCS_FIELD_NAME.TITLE_1]: 'What you get',
  [DOCS_FIELD_NAME.SUBTITLE_1]:
    'Ink is a React rich-text editor that stores content as HTML and exposes structured side-channel state (comments, track changes) as JSON-friendly payloads. Install the package once, import styles once, then mount InkEditor in any form or document surface.',
  [DOCS_FIELD_NAME.TITLE_2]: 'npm package',
  [DOCS_FIELD_NAME.SUBTITLE_2]:
    'Adds the editor runtime, toolbar presets, and CSS entry under @forgedevstack/ink.',
  [DOCS_FIELD_NAME.TITLE_3]: 'Styles entry',
  [DOCS_FIELD_NAME.SUBTITLE_3]:
    'One import of @forgedevstack/ink/styles.css at the app root styles the chrome and content.',
  [DOCS_FIELD_NAME.TITLE_4]: 'Controlled mount',
  [DOCS_FIELD_NAME.SUBTITLE_4]:
    'value / onChange keeps the parent as source of truth — ideal for forms and save APIs.',
  [DOCS_FIELD_NAME.BASH]: 'npm install @forgedevstack/ink',
};

export const CONTENT_COLUMN_IDS = {
  TITLE: 'title',
  SLUG: 'slug',
  COLLECTION: 'collection',
  TEMPLATE: 'template',
  FIELDS: 'fields',
  STATUS: 'status',
  UPDATED: 'updated',
  ACTIONS: 'actions',
} as const;

export const CONTENT_DATE_LOCALE = 'en-CA';

export const CONTENT_STATUS_PUBLISHED = 'published';
export const CONTENT_STATUS_DRAFT = 'draft';
export const CONTENT_TEMPLATE_EMPTY = '—';
export const CONTENT_MORE_MENU_MIN_WIDTH = 200;

export const CONTENT_NEW_PAGE_MENU_MIN_WIDTH = 220;
export const SAVED_TEMPLATES_DIVIDER_KEY = 'saved-templates-divider';
export const CONTENT_ROW_ID_ACCESSOR = 'id';
export const CONTENT_STATUS_CLASS = {
  [CONTENT_STATUS_PUBLISHED]: 'bifrost-cms-status bifrost-cms-status--published',
  [CONTENT_STATUS_DRAFT]: 'bifrost-cms-status bifrost-cms-status--draft',
} as const;
export const CONTENT_STATUS_CLASS_FALLBACK = 'bifrost-cms-status';
export const CONTENT_ERROR_CLASS = 'bifrost-cms-dashboard__error mb-0';
export const CONTENT_EMPTY_CLASS = 'bifrost-cms__muted mb-0';
export const CONTENT_TABLE_WRAP_CLASS = 'bifrost-cms-card bifrost-cms-pages-wrap';
