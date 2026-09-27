import { TARGET_CMS_SPRINT, TARGET_CMS_VERSION } from './version.const';
import type { OnTargetCmsParams } from './version.types';

export const isOnTargetCms = (params: OnTargetCmsParams): boolean => {
  const { current, sprint } = params;
  if (current === TARGET_CMS_VERSION) {
    return true;
  }
  if (current === TARGET_CMS_SPRINT) {
    return true;
  }
  if (sprint === TARGET_CMS_SPRINT) {
    return true;
  }
  return false;
};
