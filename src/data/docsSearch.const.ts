import { ROUTES } from '@const/routes.const';
import type { SiteSearchPage } from './docsSearch.types';

export const SEARCH_CRUMB_SEP = ' / ';
export const SEARCH_BLOG_ID_PREFIX = 'blog:';
export const SEARCH_BLOG_PAGE_ID = 'blog';
export const SEARCH_DOCS_TAG_KEY = 'nav.docs';
export const SEARCH_BLOG_TAG_KEY = 'nav.blog';
export const SEARCH_HOME_ID = 'home';

export const SITE_SEARCH_PAGES: readonly SiteSearchPage[] = [
  {
    id: SEARCH_HOME_ID,
    slug: SEARCH_HOME_ID,
    path: ROUTES.HOME,
    titleKey: 'searchHome',
    tagKey: SEARCH_DOCS_TAG_KEY,
  },
  {
    id: 'api',
    slug: 'api',
    path: ROUTES.API,
    titleKey: 'nav.api',
    tagKey: 'nav.api',
  },
  {
    id: 'changelog',
    slug: 'changelog',
    path: ROUTES.CHANGELOG,
    titleKey: 'nav.changelog',
    tagKey: 'nav.changelog',
  },
  {
    id: 'demo',
    slug: 'demo',
    path: ROUTES.DEMO,
    titleKey: 'nav.demo',
    tagKey: 'nav.demo',
  },
  {
    id: 'askAi',
    slug: 'ask-ai',
    path: ROUTES.ASK_AI,
    titleKey: 'nav.askAi',
    tagKey: 'nav.askAi',
  },
  {
    id: 'plans',
    slug: 'plans',
    path: ROUTES.PLANS,
    titleKey: 'nav.plans',
    tagKey: 'nav.plans',
  },
  {
    id: 'status',
    slug: 'status',
    path: ROUTES.STATUS,
    titleKey: 'nav.status',
    tagKey: 'nav.status',
  },
  {
    id: SEARCH_BLOG_PAGE_ID,
    slug: SEARCH_BLOG_PAGE_ID,
    path: ROUTES.BLOG,
    titleKey: 'nav.blog',
    tagKey: SEARCH_BLOG_TAG_KEY,
  },
];
