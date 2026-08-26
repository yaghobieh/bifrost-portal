import { CMS_FALSE, CMS_ONBOARDING_STORAGE_KEY, CMS_TRUE } from '@const/strings.const';

export const loadOnboardingDone = (): boolean => {
  try {
    return localStorage.getItem(CMS_ONBOARDING_STORAGE_KEY) === CMS_TRUE;
  } catch {
    return false;
  }
};

export const saveOnboardingDone = (): void => {
  localStorage.setItem(CMS_ONBOARDING_STORAGE_KEY, CMS_TRUE);
};

export const clearOnboardingDone = (): void => {
  localStorage.setItem(CMS_ONBOARDING_STORAGE_KEY, CMS_FALSE);
};
