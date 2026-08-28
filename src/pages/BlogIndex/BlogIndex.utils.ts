import { NUMBER_ZERO } from '@const/numbers.const';
import { isNumberValue, isStringValue } from '@utils';
import type { ContentItem } from '@sdk/modules/content';
import { PAYLOAD_KEY_VIEWS } from '@pages/Cms/ContentEdit/ContentEdit.const';
import { BLOG_FIELD } from '@pages/Cms/BlogPages/BlogPages.const';
import type { BlogCubePost } from './BlogIndex.types';

export const blogExcerpt = (item: ContentItem): string => {
  const value = item.payload[BLOG_FIELD.EXCERPT];
  if (isStringValue(value) && value) {
    return value;
  }
  return item.title;
};

export const blogViews = (item: ContentItem): number => {
  const value = item.payload[PAYLOAD_KEY_VIEWS];
  if (isNumberValue(value)) {
    return value;
  }
  return NUMBER_ZERO;
};

export const toBlogCube = (item: ContentItem, basePath: string): BlogCubePost => ({
  id: item.id,
  slug: item.slug,
  title: item.title || item.slug,
  excerpt: blogExcerpt(item),
  views: blogViews(item),
  href: `${basePath}/${encodeURIComponent(item.slug)}`,
  updatedAt: item.updatedAt,
});
