import { NUMBER_ONE, NUMBER_ONE_THOUSAND, NUMBER_THREE, NUMBER_TWO, NUMBER_ZERO } from '@const/numbers.const';
import { EMPTY_STRING, PAD_CHAR_ZERO, SLASH } from '@const/strings.const';
import { isNumberValue, isStringValue } from '@utils';
import { portalNavInitials } from '@components/PortalNav/PortalNav.utils';
import { PAYLOAD_KEY_AUTHOR, PAYLOAD_KEY_CATEGORIES, PAYLOAD_KEY_TAGS, PAYLOAD_KEY_VIEWS } from '@pages/Cms/ContentEdit/ContentEdit.const';
import { htmlFromPayload } from '@pages/Cms/ContentEdit/ContentEdit.utils';
import { BLOG_FIELD } from '@pages/Cms/BlogPages/BlogPages.const';
import type { ContentItem } from '@sdk/modules/content';
import {
  BLOG_AVATAR_BLUE,
  BLOG_AVATAR_PINK,
  BLOG_AVATAR_VIOLET,
  BLOG_AUTHOR_TEAM,
  BLOG_CAT_CHANGELOG,
  BLOG_CAT_ENGINEERING,
  BLOG_CAT_PRODUCT,
  BLOG_COVER_C1,
  BLOG_COVER_C2,
  BLOG_COVER_C3,
  BLOG_DEFAULT_READ_MINS,
  BLOG_FILTER_ALL,
  BLOG_GRID_COUNT,
  BLOG_PUBLIC_DATE_LOCALE,
  BLOG_VIEWED_COUNT,
  BLOG_VIEWS_K,
  SEED_POSTS,
} from './BlogIndex.const';
import type {
  BlogAvatarTone,
  BlogCoverTone,
  BlogSeedId,
  HydrateSeedParams,
  MapLivePostParams,
  PublicBlogPost,
} from './BlogIndex.types';

const COVER_CYCLE: readonly BlogCoverTone[] = [BLOG_COVER_C1, BLOG_COVER_C2, BLOG_COVER_C3];
const AVATAR_CYCLE: readonly BlogAvatarTone[] = [BLOG_AVATAR_VIOLET, BLOG_AVATAR_BLUE, BLOG_AVATAR_PINK];

const DATE_FULL: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

const DATE_SHORT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
};

export const formatBlogDate = (iso: string, short: boolean): string => {
  const stamp = Date.parse(iso);
  if (Number.isNaN(stamp)) {
    return EMPTY_STRING;
  }
  const options = short ? DATE_SHORT : DATE_FULL;
  return new Intl.DateTimeFormat(BLOG_PUBLIC_DATE_LOCALE, options).format(stamp);
};

export const formatViewCount = (views: number): string => {
  if (views < NUMBER_ONE_THOUSAND) {
    return String(views);
  }
  const thousands = views / NUMBER_ONE_THOUSAND;
  return `${thousands.toFixed(NUMBER_ONE)}${BLOG_VIEWS_K}`;
};

export const padRank = (index: number): string =>
  String(index + NUMBER_ONE).padStart(NUMBER_TWO, PAD_CHAR_ZERO);

export const categoryLabel = (translate: (key: string) => string, category: string): string => {
  if (category === BLOG_FILTER_ALL) {
    return translate('blog.chipAll');
  }
  if (category === BLOG_CAT_PRODUCT) {
    return translate('blog.catProduct');
  }
  if (category === BLOG_CAT_ENGINEERING) {
    return translate('blog.catEngineering');
  }
  if (category === BLOG_CAT_CHANGELOG) {
    return translate('blog.catChangelog');
  }
  return category;
};

const seedCopyKey = (seedId: BlogSeedId, field: string): string => `blog.posts.${seedId}.${field}`;

const hrefFor = (blogPath: string, slug: string): string => {
  if (blogPath.endsWith(SLASH)) {
    return `${blogPath}${encodeURIComponent(slug)}`;
  }
  return `${blogPath}${SLASH}${encodeURIComponent(slug)}`;
};

const applyViews = (template: string, views: number): string =>
  template.replace('{count}', formatViewCount(views));

export const hydrateSeedPosts = (params: HydrateSeedParams): PublicBlogPost[] => {
  const { translate, blogPath, viewsTemplate } = params;
  return SEED_POSTS.map((def) => ({
    id: def.slug,
    seedId: def.seedId,
    slug: def.slug,
    href: hrefFor(blogPath, def.slug),
    title: translate(seedCopyKey(def.seedId, 'title')),
    excerpt: translate(seedCopyKey(def.seedId, 'excerpt')),
    category: def.category,
    author: def.author,
    initials: portalNavInitials(def.author),
    avatarTone: def.avatarTone,
    publishedAt: def.publishedAt,
    dateLabel: formatBlogDate(def.publishedAt, false),
    dateShort: formatBlogDate(def.publishedAt, true),
    readMins: def.readMins,
    views: def.views,
    viewsShort: applyViews(viewsTemplate, def.views),
    coverTone: def.coverTone,
    tags: [...def.tags],
    bodyHtml: EMPTY_STRING,
    prevSlug: def.prevSlug,
    nextSlug: def.nextSlug,
    featured: def.featured,
  }));
};

const readStringField = (payload: Record<string, unknown>, key: string): string => {
  const value = payload[key];
  if (isStringValue(value) && value) {
    return value;
  }
  return EMPTY_STRING;
};

const readTags = (payload: Record<string, unknown>): string[] => {
  const value = payload[PAYLOAD_KEY_TAGS] ?? payload[BLOG_FIELD.TAGS];
  if (isStringValue(value) && value) {
    return value.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((tag): tag is string => isStringValue(tag) && Boolean(tag));
};

const readCategory = (payload: Record<string, unknown>): string => {
  const value = payload[PAYLOAD_KEY_CATEGORIES] ?? payload[BLOG_FIELD.CATEGORY];
  if (isStringValue(value) && value) {
    return value;
  }
  if (Array.isArray(value) && value.length > NUMBER_ZERO && isStringValue(value[NUMBER_ZERO])) {
    return value[NUMBER_ZERO];
  }
  return BLOG_CAT_PRODUCT;
};

const readViews = (payload: Record<string, unknown>): number => {
  const value = payload[PAYLOAD_KEY_VIEWS];
  if (isNumberValue(value)) {
    return value;
  }
  return NUMBER_ZERO;
};

const readExcerpt = (item: ContentItem): string => {
  const value = item.payload[BLOG_FIELD.EXCERPT];
  if (isStringValue(value) && value) {
    return value;
  }
  return item.title;
};

export const mapLivePost = (params: MapLivePostParams): PublicBlogPost => {
  const { item, blogPath, viewsTemplate, index } = params;
  const author = readStringField(item.payload, PAYLOAD_KEY_AUTHOR) || BLOG_AUTHOR_TEAM;
  const publishedAt = item.updatedAt || item.createdAt;
  const views = readViews(item.payload);
  const toneIndex = index % NUMBER_THREE;
  return {
    id: item.id,
    seedId: null,
    slug: item.slug,
    href: hrefFor(blogPath, item.slug),
    title: item.title || item.slug,
    excerpt: readExcerpt(item),
    category: readCategory(item.payload),
    author,
    initials: portalNavInitials(author),
    avatarTone: AVATAR_CYCLE[toneIndex],
    publishedAt,
    dateLabel: formatBlogDate(publishedAt, false),
    dateShort: formatBlogDate(publishedAt, true),
    readMins: BLOG_DEFAULT_READ_MINS,
    views,
    viewsShort: applyViews(viewsTemplate, views),
    coverTone: COVER_CYCLE[toneIndex],
    tags: readTags(item.payload),
    bodyHtml: htmlFromPayload(item.payload),
    prevSlug: EMPTY_STRING,
    nextSlug: EMPTY_STRING,
    featured: index === NUMBER_ZERO,
  };
};

export const attachNeighbors = (posts: PublicBlogPost[]): PublicBlogPost[] => {
  const newest = [...posts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
  return posts.map((post) => {
    if (post.prevSlug || post.nextSlug) {
      return post;
    }
    const index = newest.findIndex((entry) => entry.id === post.id);
    const newer = index > NUMBER_ZERO ? newest[index - NUMBER_ONE] : null;
    const older = index >= NUMBER_ZERO && index < newest.length - NUMBER_ONE ? newest[index + NUMBER_ONE] : null;
    return {
      ...post,
      nextSlug: newer ? newer.slug : EMPTY_STRING,
      prevSlug: older ? older.slug : EMPTY_STRING,
    };
  });
};

export const matchCategory = (post: PublicBlogPost, category: string): boolean => {
  if (category === BLOG_FILTER_ALL) {
    return true;
  }
  return post.category === category;
};

export const pickFeatured = (posts: PublicBlogPost[], category: string): PublicBlogPost | null => {
  const pool = posts.filter((post) => matchCategory(post, category));
  const marked = pool.find((post) => post.featured);
  if (marked) {
    return marked;
  }
  if (pool.length === NUMBER_ZERO) {
    return null;
  }
  return [...pool].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))[NUMBER_ZERO];
};

export const pickNewest = (
  posts: PublicBlogPost[],
  category: string,
  featuredId: string,
): PublicBlogPost[] =>
  posts
    .filter((post) => matchCategory(post, category) && post.id !== featuredId)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .slice(NUMBER_ZERO, BLOG_GRID_COUNT);

export const pickViewed = (posts: PublicBlogPost[], category: string): PublicBlogPost[] =>
  posts
    .filter((post) => matchCategory(post, category))
    .sort((left, right) => right.views - left.views)
    .slice(NUMBER_ZERO, BLOG_VIEWED_COUNT);

export const findPostBySlug = (posts: PublicBlogPost[], slug: string): PublicBlogPost | null => {
  const match = posts.find((post) => post.slug === slug);
  if (!match) {
    return null;
  }
  return match;
};
