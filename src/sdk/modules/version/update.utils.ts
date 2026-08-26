import { EMPTY_STRING, TYPE_BOOLEAN, TYPE_OBJECT, TYPE_STRING } from '@const/strings.const';
import { fetchVersionInfo } from './version.api';
import { TARGET_CMS_VERSION } from './version.const';
import type { CmsUpdateResult } from './version.types';

export type CmsUpdateCandidate = {
  from: string;
  to: string;
  updated: boolean;
  packages?: string[];
};

export const isCmsUpdateResult = (value: CmsUpdateCandidate | null): boolean => {
  if (!value || typeof value !== TYPE_OBJECT) {
    return false;
  }
  return (
    typeof value.from === TYPE_STRING &&
    typeof value.to === TYPE_STRING &&
    typeof value.updated === TYPE_BOOLEAN
  );
};

export const optimisticUpdateResult = async (): Promise<CmsUpdateResult> => {
  const info = await fetchVersionInfo();
  const from = info.portal || info.version || EMPTY_STRING;
  return {
    from,
    to: TARGET_CMS_VERSION,
    updated: from !== TARGET_CMS_VERSION,
    packages: [],
  };
};
