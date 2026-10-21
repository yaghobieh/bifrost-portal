import { NUMBER_ONE_HUNDRED_SIXTY, NUMBER_SIXTY } from '@const/numbers.const';

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
export const BLOG_SEO_TITLE_MAX = NUMBER_SIXTY;
export const BLOG_SEO_DESC_MAX = NUMBER_ONE_HUNDRED_SIXTY;
export const BLOG_STATUS_SCHEDULED = 'scheduled';
export const BLOG_EDIT_TITLE_ID = 'cms-blog-title';
export const BLOG_EDIT_EXCERPT_ID = 'cms-blog-excerpt';
export const BLOG_EDIT_SLUG_ID = 'cms-blog-slug';
