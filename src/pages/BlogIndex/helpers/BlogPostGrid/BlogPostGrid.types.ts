import type { PublicBlogPost } from '../../BlogIndex.types';

export type BlogPostGridProps = {
  posts: PublicBlogPost[];
  empty: string;
  labelFor: (category: string) => string;
  onOpen?: (slug: string) => void;
};
