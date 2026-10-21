import type { PublicBlogPost } from '@pages/BlogIndex/BlogIndex.types';

export type BlogPostProps = {
  embedded?: boolean;
  previewSlug?: string;
  onOpenPost?: (slug: string) => void;
};

export type BlogArticleHeroProps = {
  post: PublicBlogPost;
  blogLabel: string;
  categoryLabel: string;
  readLabel: string;
};

export type BlogArticleBodyProps = {
  post: PublicBlogPost;
};

export type BlogArticleNavProps = {
  post: PublicBlogPost;
  previousLabel: string;
  nextLabel: string;
  previousTitle: string;
  nextTitle: string;
  previousHref: string;
  nextHref: string;
  onOpen?: (slug: string) => void;
};
