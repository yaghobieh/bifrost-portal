export const BLOG_COLLECTION = 'blog';
export const BLOG_SLUG_PREFIX = 'post-';
export const BLOG_FIELD = {
  TITLE: 'title',
  EXCERPT: 'excerpt',
  BODY: 'body',
  TAGS: 'tags',
} as const;
export const BLOG_COLUMN = {
  TITLE: 'title',
  SLUG: 'slug',
  STATUS: 'status',
  UPDATED: 'updated',
  ACTIONS: 'actions',
} as const;
export const BLOG_ROW_ID = 'id';
export const BLOG_DATE_LOCALE = 'en-CA';
export const BLOG_TABLE_WRAP_CLASS = 'bifrost-cms-card bifrost-cms-pages-wrap';
