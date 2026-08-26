import type { CmsPageItem } from '@data/pages.types';

export type AskAiPageModel = {
  title: string;
  lead: string;
  body: string;
  note?: string;
};

export type AskAiFromItemParams = {
  item: CmsPageItem | null;
};
