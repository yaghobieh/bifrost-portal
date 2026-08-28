import { PUBLIC_BLOG_POSTS_PATH } from '@const/strings.const';
import { requestWithError } from '@sdk/http';
import type { ContentItem } from '@sdk/modules/content';

export type PublicBlogListResponse = {
  items?: ContentItem[];
};

export type PublicBlogItemResponse = {
  item?: ContentItem | null;
};

export const fetchPublicBlogPosts = async (): Promise<ContentItem[]> => {
  const response = await requestWithError(PUBLIC_BLOG_POSTS_PATH, undefined, {
    silent: true,
    code: 'blog',
  });
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as PublicBlogListResponse;
  if (!data || !Array.isArray(data.items)) {
    return [];
  }
  return data.items;
};

export const fetchPublicBlogPost = async (slug: string): Promise<ContentItem | null> => {
  const response = await requestWithError(
    `${PUBLIC_BLOG_POSTS_PATH}/${encodeURIComponent(slug)}`,
    undefined,
    { silent: true, code: 'blog' },
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as PublicBlogItemResponse;
  return data.item ?? null;
};
