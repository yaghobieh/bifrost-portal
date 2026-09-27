import type { ContentItem } from '@sdk/modules/content';

export type BlogCoverTone = 'featured' | 'c1' | 'c2' | 'c3';

export type BlogAvatarTone = 'violet' | 'blue' | 'pink';

export type BlogSeedId = 'marketing' | 'ink' | 'changelog' | 'visibility' | 'install';

export type PublicBlogPost = {
  id: string;
  seedId: BlogSeedId | null;
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  initials: string;
  avatarTone: BlogAvatarTone;
  publishedAt: string;
  dateLabel: string;
  dateShort: string;
  readMins: number;
  views: number;
  viewsShort: string;
  coverTone: BlogCoverTone;
  tags: string[];
  bodyHtml: string;
  prevSlug: string;
  nextSlug: string;
  featured: boolean;
};

export type SeedPostDef = {
  seedId: BlogSeedId;
  slug: string;
  category: string;
  author: string;
  avatarTone: BlogAvatarTone;
  publishedAt: string;
  readMins: number;
  views: number;
  coverTone: BlogCoverTone;
  tags: readonly string[];
  featured: boolean;
  prevSlug: string;
  nextSlug: string;
};

export type BlogIndexProps = {
  embedded?: boolean;
  preview?: boolean;
  onOpenPost?: (slug: string) => void;
};

export type HydrateSeedParams = {
  translate: (key: string) => string;
  blogPath: string;
  viewsTemplate: string;
};

export type MapLivePostParams = {
  item: ContentItem;
  blogPath: string;
  viewsTemplate: string;
  index: number;
};
