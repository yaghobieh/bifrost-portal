import type { BlogCubePost } from '../../BlogIndex.types';

export type BlogCubesProps = {
  posts: BlogCubePost[];
  copied: string;
  empty: string;
  viewsLabel: string;
  shareLabel: string;
  copiedLabel: string;
  onShare: (href: string) => void;
};
