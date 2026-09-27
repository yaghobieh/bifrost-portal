import type { PublicBlogPost } from '../../BlogIndex.types';

export type BlogFeaturedPostProps = {
  post: PublicBlogPost;
  brand: string;
  readLabel: string;
  onOpen?: (slug: string) => void;
};
