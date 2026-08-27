import { TRANSLATION_STATUS } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.const';
import type { TranslationRowStatus } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.types';

export const pillClassName = (status: TranslationRowStatus): string => {
  if (status === TRANSLATION_STATUS.DONE) {
    return 'bifrost-cms-translations__pill bifrost-cms-translations__pill--done';
  }
  if (status === TRANSLATION_STATUS.AI) {
    return 'bifrost-cms-translations__pill bifrost-cms-translations__pill--ai';
  }
  return 'bifrost-cms-translations__pill bifrost-cms-translations__pill--missing';
};

export const pillLabel = (params: {
  status: TranslationRowStatus;
  doneLabel: string;
  missingLabel: string;
  aiLabel: string;
}): string => {
  const { status, doneLabel, missingLabel, aiLabel } = params;
  if (status === TRANSLATION_STATUS.DONE) {
    return doneLabel;
  }
  if (status === TRANSLATION_STATUS.AI) {
    return aiLabel;
  }
  return missingLabel;
};
