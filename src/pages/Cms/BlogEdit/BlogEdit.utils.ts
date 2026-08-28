import { BLOG_SEO_COUNT_TOKEN, BLOG_SEO_MAX_TOKEN } from './BlogEdit.const';
import {
  PAYLOAD_HTML_KEY,
  PAYLOAD_KEY_AUTHOR,
  PAYLOAD_KEY_CATEGORIES,
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_FEATURED,
  PAYLOAD_KEY_SCHEDULE,
  PAYLOAD_KEY_SEO_DESCRIPTION,
  PAYLOAD_KEY_SEO_TITLE,
  PAYLOAD_KEY_TAGS,
  PAYLOAD_KEY_UPDATED_BY,
} from '../ContentEdit/ContentEdit.const';
import { BLOG_FIELD } from '../BlogPages/BlogPages.const';
import type { BlogSavePayloadInput } from './BlogEdit.types';

/**
 * Builds the persisted blog payload from the editor fields.
 */
export const buildBlogSavePayload = (
  input: BlogSavePayloadInput,
): Record<string, unknown> => ({
  ...input.base,
  [BLOG_FIELD.EXCERPT]: input.excerpt,
  [PAYLOAD_HTML_KEY]: input.bodyHtml,
  [PAYLOAD_KEY_SEO_TITLE]: input.seoTitle,
  [PAYLOAD_KEY_SEO_DESCRIPTION]: input.seoDescription,
  [PAYLOAD_KEY_CATEGORIES]: input.category,
  [PAYLOAD_KEY_TAGS]: input.tags,
  [PAYLOAD_KEY_AUTHOR]: input.author,
  [PAYLOAD_KEY_SCHEDULE]: input.scheduleAt,
  [PAYLOAD_KEY_FEATURED]: input.cover,
  [PAYLOAD_KEY_CREATED_BY]: input.createdBy,
  [PAYLOAD_KEY_UPDATED_BY]: input.updatedBy,
});

/**
 * Fills `{count}` and `{max}` in the SEO length label.
 */
export const formatBlogSeoCount = (
  template: string,
  count: number,
  max: number,
): string =>
  template
    .replace(BLOG_SEO_COUNT_TOKEN, String(count))
    .replace(BLOG_SEO_MAX_TOKEN, String(max));

/**
 * Ensures the public blog path ends with a slash for the slug field prefix.
 */
export const blogRoutePrefix = (blogPath: string, slash: string, fallback: string): string => {
  const path = blogPath || fallback;
  if (path.endsWith(slash)) {
    return path;
  }
  return `${path}${slash}`;
};
