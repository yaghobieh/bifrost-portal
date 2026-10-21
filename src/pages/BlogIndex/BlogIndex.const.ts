import {
  NUMBER_FOUR,
  NUMBER_FIVE,
  NUMBER_FOUR_THOUSAND_TWO_HUNDRED,
  NUMBER_SIX,
  NUMBER_EIGHT,
  NUMBER_THREE_THOUSAND_ONE_HUNDRED,
  NUMBER_ONE_THOUSAND_EIGHT_HUNDRED,
  NUMBER_NINE_HUNDRED,
  NUMBER_FOUR_HUNDRED,
  NUMBER_THREE,
} from '@const/numbers.const';
import { BLOG_CATEGORIES } from '@pages/Cms/BlogPages/BlogPages.const';
import type { SeedPostDef } from './BlogIndex.types';

export const BLOG_FILTER_ALL = 'all';
export const BLOG_CHIP_IDS = [BLOG_FILTER_ALL, ...BLOG_CATEGORIES] as const;
export const BLOG_PUBLIC_DATE_LOCALE = 'en-US';
export const BLOG_VIEWS_K = 'k';
export const BLOG_CRUMB_SEP = ' / ';
export const BLOG_GRID_COUNT = NUMBER_THREE;
export const BLOG_VIEWED_COUNT = NUMBER_THREE;
export const BLOG_COVER_FEATURED = 'featured';
export const BLOG_COVER_C1 = 'c1';
export const BLOG_COVER_C2 = 'c2';
export const BLOG_COVER_C3 = 'c3';
export const BLOG_AVATAR_VIOLET = 'violet';
export const BLOG_AVATAR_BLUE = 'blue';
export const BLOG_AVATAR_PINK = 'pink';
export const BLOG_SEED_MARKETING = 'marketing';
export const BLOG_DEFAULT_READ_MINS = NUMBER_SIX;
export const BLOG_AUTHOR_TEAM = 'Yaghobieh';
export const BLOG_AUTHOR_ADMIN = 'Admin';
export const BLOG_CAT_PRODUCT = 'Product';
export const BLOG_CAT_ENGINEERING = 'Engineering';
export const BLOG_CAT_CHANGELOG = 'Changelog';

export const SEED_POSTS: readonly SeedPostDef[] = [
  {
    seedId: BLOG_SEED_MARKETING,
    slug: 'shipping-the-marketing-pages-plugin',
    category: BLOG_CAT_PRODUCT,
    author: BLOG_AUTHOR_TEAM,
    avatarTone: BLOG_AVATAR_VIOLET,
    publishedAt: '2026-08-28',
    readMins: NUMBER_SIX,
    views: NUMBER_NINE_HUNDRED,
    coverTone: BLOG_COVER_FEATURED,
    tags: ['stage', 'plugins', 'marketing'],
    featured: true,
    prevSlug: 'why-we-built-bifrost-on-top-of-ink',
    nextSlug: 'v1-1-10-changelog',
  },
  {
    seedId: 'ink',
    slug: 'why-we-built-bifrost-on-top-of-ink',
    category: BLOG_CAT_ENGINEERING,
    author: BLOG_AUTHOR_TEAM,
    avatarTone: BLOG_AVATAR_BLUE,
    publishedAt: '2026-08-20',
    readMins: NUMBER_FIVE,
    views: NUMBER_FOUR_THOUSAND_TWO_HUNDRED,
    coverTone: BLOG_COVER_C1,
    tags: ['architecture'],
    featured: false,
    prevSlug: '',
    nextSlug: '',
  },
  {
    seedId: 'changelog',
    slug: 'v1-1-10-changelog',
    category: BLOG_CAT_CHANGELOG,
    author: BLOG_AUTHOR_ADMIN,
    avatarTone: BLOG_AVATAR_PINK,
    publishedAt: '2026-08-18',
    readMins: NUMBER_FOUR,
    views: NUMBER_ONE_THOUSAND_EIGHT_HUNDRED,
    coverTone: BLOG_COVER_C2,
    tags: ['release'],
    featured: false,
    prevSlug: '',
    nextSlug: '',
  },
  {
    seedId: 'visibility',
    slug: 'introducing-role-based-visibility',
    category: BLOG_CAT_PRODUCT,
    author: BLOG_AUTHOR_TEAM,
    avatarTone: BLOG_AVATAR_VIOLET,
    publishedAt: '2026-08-12',
    readMins: NUMBER_FIVE,
    views: NUMBER_FOUR_HUNDRED,
    coverTone: BLOG_COVER_C3,
    tags: ['roles'],
    featured: false,
    prevSlug: '',
    nextSlug: '',
  },
  {
    seedId: 'install',
    slug: 'installation-getting-started-with-ink',
    category: BLOG_CAT_ENGINEERING,
    author: BLOG_AUTHOR_TEAM,
    avatarTone: BLOG_AVATAR_BLUE,
    publishedAt: '2026-08-04',
    readMins: NUMBER_EIGHT,
    views: NUMBER_THREE_THOUSAND_ONE_HUNDRED,
    coverTone: BLOG_COVER_C1,
    tags: ['install'],
    featured: false,
    prevSlug: '',
    nextSlug: '',
  },
];
