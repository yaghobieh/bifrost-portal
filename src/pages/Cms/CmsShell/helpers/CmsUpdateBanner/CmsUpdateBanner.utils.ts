import { EMPTY_STRING } from '@const/strings.const';
import { TARGET_CMS_VERSION } from '@sdk/modules/version';
import { CMS_UPDATE_DISMISS_KEY } from './CmsUpdateBanner.const';

export const versionFromInfo = (portal: string, version: string): string => {
  if (portal) {
    return portal;
  }
  return version;
};

export const isBehindHub = (current: string): boolean => {
  if (!current) {
    return false;
  }
  return current !== TARGET_CMS_VERSION;
};

export const loadDismissedVersion = (): string => {
  try {
    return window.localStorage.getItem(CMS_UPDATE_DISMISS_KEY) || EMPTY_STRING;
  } catch {
    return EMPTY_STRING;
  }
};

export const saveDismissedVersion = (version: string): void => {
  try {
    window.localStorage.setItem(CMS_UPDATE_DISMISS_KEY, version);
  } catch {
    return;
  }
};
