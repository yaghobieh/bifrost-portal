import { NUMBER_TWO, NUMBER_ZERO } from '@const/numbers.const';
import { CMS_SITE_EVENT, CMS_SITE_STORAGE_KEY, EMPTY_STRING, PUBLIC_NAV_PATH } from '@const/strings.const';
import { ROUTES } from '@const/routes.const';
import { requestWithError } from '@sdk/http';
import { PUBLIC_NAV_REQUEST } from './PortalNav.const';
import { DEFAULT_PUBLIC_NAV, type PublicNavChrome, type PublicNavItem } from './PortalNav.chrome.types';

export { DEFAULT_PUBLIC_NAV };
export type { PublicNavChrome, PublicNavItem };
export { CMS_SITE_EVENT };

export const portalNavInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return EMPTY_STRING;
  }
  return trimmed.slice(NUMBER_ZERO, NUMBER_TWO).toUpperCase();
};

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

export const parsePublicNavChrome = (value: unknown): PublicNavChrome => {
  if (!isRecord(value)) {
    return DEFAULT_PUBLIC_NAV;
  }
  const blogPath = value.blogPath;
  return {
    hiddenPublicNavIds: readHiddenIds(value.hiddenPublicNavIds),
    blogPath: typeof blogPath === 'string' && blogPath ? blogPath : ROUTES.BLOG,
    showTopNav: value.showTopNav !== false,
    items: readItems(value.items),
  };
};

export const readLocalPublicNav = (): PublicNavChrome => {
  try {
    const raw = localStorage.getItem(CMS_SITE_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PUBLIC_NAV;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return DEFAULT_PUBLIC_NAV;
    }
    return parsePublicNavChrome({
      hiddenPublicNavIds: parsed.hiddenPublicNavIds,
      blogPath: parsed.blogPath,
      showTopNav: parsed.showTopNav,
      items: parsed.publicNavItems,
    });
  } catch {
    return DEFAULT_PUBLIC_NAV;
  }
};

export const fetchPublicNav = async (): Promise<PublicNavChrome> => {
  const response = await requestWithError(PUBLIC_NAV_PATH, undefined, PUBLIC_NAV_REQUEST);
  if (!response.ok) {
    return readLocalPublicNav();
  }
  const data: unknown = await response.json();
  const chrome = parsePublicNavChrome(data);
  if (!chrome.items.length) {
    const local = readLocalPublicNav();
    if (local.items.length) {
      return {
        ...chrome,
        items: local.items,
      };
    }
  }
  return chrome;
};

export const visiblePublicNavItems = (chrome: PublicNavChrome): PublicNavItem[] => {
  if (!chrome.showTopNav) {
    return [];
  }
  return chrome.items.filter((item) => item.visible && item.label && item.href);
};
