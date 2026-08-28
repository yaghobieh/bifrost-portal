import type { PAGE_START_IDS } from './PageStart.const';

export type PageStartId = (typeof PAGE_START_IDS)[keyof typeof PAGE_START_IDS];

export type PageStartCard = {
  id: PageStartId;
  title: string;
  body: string;
  cta: string;
  tag: string;
  recommended: boolean;
};

export type PageStartProps = {
  cards: PageStartCard[];
  onStart: (id: PageStartId) => void;
};
