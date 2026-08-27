import type { CmsTranslations } from '@pages/Cms/SettingsPages/SettingsPages.types';
import { TRANSLATION_STATUS } from './TranslationsManager.const';

export type TranslationViewId = 'table' | 'json';

export type TranslationScopeId = 'global' | 'page';

export type TranslationLocale = string;

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
  onCreatePage: (title: string) => Promise<string | null>;
};

export type TranslationBag = CmsTranslations;

export type TranslationLocaleNames = Record<string, string>;

export type FillTemplateValues = Record<string, string>;
