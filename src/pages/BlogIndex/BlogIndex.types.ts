import type { ContentItem } from '@sdk/modules/content';

export type BlogCubePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  views: number;
  href: string;
  updatedAt: string;
};
