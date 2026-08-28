import { NUMBER_TWO, NUMBER_ZERO } from '@const/numbers.const';
import { EMPTY_STRING, PUBLIC_NAV_PATH } from '@const/strings.const';
import { ROUTES } from '@const/routes.const';
import { isStringValue } from '@utils';
import { requestWithError } from '@sdk/http';
import { PUBLIC_NAV_REQUEST } from './PortalNav.const';
import { DEFAULT_PUBLIC_NAV, type PublicNavChrome } from './PortalNav.chrome.types';

export { DEFAULT_PUBLIC_NAV };
export type { PublicNavChrome };

export const portalNavInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return EMPTY_STRING;
  }
  return trimmed.slice(NUMBER_ZERO, NUMBER_TWO).toUpperCase();
};

const readHiddenIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((id): id is string => isStringValue(id));
};

export const fetchPublicNav = async (): Promise<PublicNavChrome> => {
  const response = await requestWithError(PUBLIC_NAV_PATH, undefined, PUBLIC_NAV_REQUEST);
  if (!response.ok) {
    return DEFAULT_PUBLIC_NAV;
  }
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object') {
    return DEFAULT_PUBLIC_NAV;
  }
  const parsed = data as Record<string, unknown>;
  const blogPath = parsed.blogPath;
  return {
    hiddenPublicNavIds: readHiddenIds(parsed.hiddenPublicNavIds),
    blogPath: isStringValue(blogPath) && blogPath ? blogPath : ROUTES.BLOG,
    showTopNav: parsed.showTopNav !== false,
  };
};

export const isPublicNavVisible = (chrome: PublicNavChrome, id: string): boolean =>
  chrome.showTopNav && !chrome.hiddenPublicNavIds.includes(id);
