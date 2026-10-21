import { EMPTY_STRING } from '@const/strings.const';
import type { PublicBlogPost } from '@pages/BlogIndex/BlogIndex.types';

export const neighborOf = (posts: PublicBlogPost[], slug: string): PublicBlogPost | null => {
  const match = posts.find((post) => post.slug === slug);
  if (!match) {
    return null;
  }
  return match;
};

export const neighborHref = (post: PublicBlogPost | null): string => {
  if (!post) {
    return EMPTY_STRING;
  }
  return post.href;
};

export const neighborTitle = (post: PublicBlogPost | null): string => {
  if (!post) {
    return EMPTY_STRING;
  }
  return post.title;
};
