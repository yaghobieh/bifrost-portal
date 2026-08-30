import {
  DOUBLE_SLASH,
  HASH_PREFIX,
  HTTP_PREFIX,
  HTTPS_PREFIX,
  SLASH,
} from '@const/strings.const';
import type { HrefKind } from './href.types';

export const HREF_KIND = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
  HASH: 'hash',
} satisfies Record<string, HrefKind>;

export const isInternalHref = (href: string): boolean => {
  if (!href.startsWith(SLASH)) {
    return false;
  }
  if (href.startsWith(DOUBLE_SLASH)) {
    return false;
  }
  return true;
};

export const isExternalHref = (href: string): boolean => {
  if (href.startsWith(HTTP_PREFIX)) {
    return true;
  }
  if (href.startsWith(HTTPS_PREFIX)) {
    return true;
  }
  return false;
};

export const isHashHref = (href: string): boolean => href.startsWith(HASH_PREFIX);

export const resolveHrefKind = (href: string): HrefKind => {
  if (isHashHref(href)) {
    return HREF_KIND.HASH;
  }
  if (isExternalHref(href)) {
    return HREF_KIND.EXTERNAL;
  }
  return HREF_KIND.INTERNAL;
};
