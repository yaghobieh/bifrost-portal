import type { TranslationRowStatus } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.types';

export type TranslationStatusPillProps = {
  status: TranslationRowStatus;
  doneLabel: string;
  missingLabel: string;
  aiLabel: string;
};
