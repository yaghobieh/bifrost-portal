import { EMPTY_STRING } from '@const/strings.const';
import { TARGET_CMS_VERSION } from '@sdk/modules/version';
import type { WhatsNewCopy } from '@sdk/modules/version';
import { CMS_UPDATE_DISMISS_KEY, CMS_UPDATE_INSTALLED_KEY } from './CmsUpdateBanner.const';

export const versionFromInfo = (portal: string, version: string): string => {
  if (portal) {
    return portal;
  }
  return version;
};

export const loadInstalledVersion = (): string => {
  try {
    return window.localStorage.getItem(CMS_UPDATE_INSTALLED_KEY) || EMPTY_STRING;
  } catch {
    return EMPTY_STRING;
  }
};

export const saveInstalledVersion = (version: string): void => {
  try {
    window.localStorage.setItem(CMS_UPDATE_INSTALLED_KEY, version);
    window.localStorage.setItem(CMS_UPDATE_DISMISS_KEY, version);
  } catch {
    return;
  }
};

export const isBehindHub = (current: string): boolean => {
  if (!current) {
    return false;
  }
  const installed = loadInstalledVersion();
  if (installed === TARGET_CMS_VERSION) {
    return false;
  }
  const dismissed = loadDismissedVersion();
  if (dismissed === TARGET_CMS_VERSION) {
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

export const previewNotes = (
  apiNotes: string | undefined,
  whatsNew: WhatsNewCopy,
  fallback: string,
): string => {
  if (apiNotes) {
    return apiNotes;
  }
  if (whatsNew.lead) {
    return whatsNew.lead;
  }
  if (whatsNew.body) {
    return whatsNew.body;
  }
  if (whatsNew.title) {
    return whatsNew.title;
  }
  return fallback;
};
