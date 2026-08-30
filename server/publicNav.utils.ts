import {
  DEFAULT_BLOG_PATH,
  EMPTY_STRING,
  SITE_BLOG_PATH,
  SITE_HIDDEN_PUBLIC_NAV_IDS,
  SITE_PUBLIC_NAV_ITEMS,
  SITE_SHOW_TOP_NAV,
} from './cmsAuth.const';
import type { PublicNavChrome, PublicNavItem } from './publicNav.types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const readHiddenIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((id): id is string => typeof id === 'string');
};

const toNavItem = (value: unknown): PublicNavItem | null => {
  if (!isRecord(value)) {
    return null;
  }
  const id = value.id;
  const label = value.label;
  const href = value.href;
  if (typeof id !== 'string' || !id) {
    return null;
  }
  if (typeof label !== 'string' || typeof href !== 'string') {
    return null;
  }
  return {
    id,
    label,
    href,
    visible: value.visible !== false,
  };
};

const readItems = (value: unknown): PublicNavItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((entry) => toNavItem(entry)).filter((item): item is PublicNavItem => Boolean(item));
};

export const toPublicNavChrome = (value: unknown): PublicNavChrome => {
  if (!isRecord(value)) {
    return {
      hiddenPublicNavIds: [],
      blogPath: DEFAULT_BLOG_PATH,
      showTopNav: true,
      items: [],
    };
  }
  const blogPathRaw =
    typeof value[SITE_BLOG_PATH] === 'string' ? value[SITE_BLOG_PATH].trim() : EMPTY_STRING;
  return {
    hiddenPublicNavIds: readHiddenIds(value[SITE_HIDDEN_PUBLIC_NAV_IDS]),
    blogPath: blogPathRaw || DEFAULT_BLOG_PATH,
    showTopNav: value[SITE_SHOW_TOP_NAV] !== false,
    items: readItems(value[SITE_PUBLIC_NAV_ITEMS]),
  };
};
