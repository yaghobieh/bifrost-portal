import type { CmsPageItem } from '@data/pages.types';

export type UsePublicPageResult = {
  item: CmsPageItem | null;
  loading: boolean;
};
