import type { DocSearchHit } from './docs.types';
import { buildSearchIndex, matchSearchEntries } from './docsSearch.utils';
import type { SearchSiteParams } from './docsSearch.types';

export const searchSite = (params: SearchSiteParams): DocSearchHit[] => {
  const { query, titleOf, cmsItems, blogItems, blogPath } = params;
  const entries = buildSearchIndex({
    titleOf,
    cmsItems,
    blogItems,
    blogPath,
  });
  return matchSearchEntries({ query, entries });
};

export const searchNav = (
  query: string,
  titleOf: (key: string) => string,
): DocSearchHit[] => searchSite({ query, titleOf });
