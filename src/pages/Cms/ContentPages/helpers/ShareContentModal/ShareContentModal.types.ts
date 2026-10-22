import type { CmsSite } from '@data/sites.types';

export type ShareItemKind = 'page' | 'post' | 'template' | 'article' | 'doc' | string;

export type ShareContentItem = {
  id: string;
  title: string;
  slug: string;
  kind?: ShareItemKind;
  collection?: string;
  currentSiteId?: string;
  payload?: Record<string, unknown>;
  content?: string;
};

export type ShareContentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: ShareContentItem | null;
  sites: CmsSite[];
  activeSiteId: string;
  onShareToSite?: (targetSiteId: string, item: ShareContentItem) => Promise<void>;
};
