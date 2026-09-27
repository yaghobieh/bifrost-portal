import type { ContentItem } from '@sdk/modules/content';
import type { CmsDocItem } from './docs.types';

export type SearchTitleOf = (key: string) => string;

export type SearchSiteParams = {
  query: string;
  titleOf: SearchTitleOf;
  cmsItems?: CmsDocItem[];
  blogItems?: ContentItem[];
  blogPath?: string;
};

export type SiteSearchPage = {
  id: string;
  path: string;
  titleKey: string;
  tagKey: string;
  slug: string;
};

export type SearchIndexEntry = {
  id: string;
  slug: string;
  path: string;
  title: string;
  tag: string;
  haystack: string;
};
