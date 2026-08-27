import { TRANSLATION_STATUS } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.const';
import type { TranslationRowStatus } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.types';

export const targetInputClass = (status: TranslationRowStatus): string => {
  if (status === TRANSLATION_STATUS.AI) {
    return 'bifrost-cms-translations__input bifrost-cms-translations__input--ai';
  }
  return 'bifrost-cms-translations__input';
};
