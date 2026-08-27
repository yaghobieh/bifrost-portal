import type { CmsTranslations } from '@pages/Cms/SettingsPages/SettingsPages.types';
import { TRANSLATION_LOCALES, TRANSLATION_STATUS } from './TranslationsManager.const';

export type TranslationViewId = 'table' | 'json';

export type TranslationScopeId = 'global' | 'page';

export type TranslationLocale = (typeof TRANSLATION_LOCALES)[number];

export type TranslationRowStatus =
  (typeof TRANSLATION_STATUS)[keyof typeof TRANSLATION_STATUS];

export type TranslationRow = {
  id: string;
  key: string;
  source: string;
  target: string;
  status: TranslationRowStatus;
};

export type TranslationPageRow = {
  id: string;
  title: string;
  keys: number;
};

export type TranslationsManagerProps = {
  pageId: string;
  onOpenPage: (pageId: string) => void;
  pages: TranslationPageRow[];
};

export type TranslationBag = CmsTranslations;
