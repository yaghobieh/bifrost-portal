export const BLOG_COLLECTION = 'blog';
export const BLOG_SLUG_PREFIX = 'post-';
export const BLOG_ROUTE_PREFIX = '/blog/';
export const BLOG_FIELD = {
  TITLE: 'title',
  EXCERPT: 'excerpt',
  BODY: 'body',
  TAGS: 'tags',
  CATEGORY: 'categories',
  AUTHOR: 'author',
  COVER: 'featuredImage',
  PUBLISHED: 'scheduleAt',
} as const;
export const BLOG_COLUMN = {
  TITLE: 'title',
  AUTHOR: 'author',
  CATEGORY: 'category',
  STATUS: 'status',
  PUBLISHED: 'published',
  ACTIONS: 'actions',
} as const;
export const BLOG_ROW_ID = 'id';
export const BLOG_DATE_LOCALE = 'en-CA';
export const BLOG_TABLE_WRAP_CLASS = 'bifrost-cms-card bifrost-cms-pages-wrap';
export const BLOG_CATEGORIES = ['Product', 'Engineering', 'Changelog'] as const;
export const BLOG_STATUS_SCHEDULED = 'scheduled';
