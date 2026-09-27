import type { PublicBlogPost } from '../../BlogIndex.types';

export type BlogViewedListProps = {
  posts: PublicBlogPost[];
  empty: string;
  onOpen?: (slug: string) => void;
};
