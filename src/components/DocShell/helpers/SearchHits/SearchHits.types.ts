import type { DocSearchHit } from '@data/docs.types';

export type SearchHitsProps = {
  hits: DocSearchHit[];
  empty: string;
  onPick: () => void;
};
