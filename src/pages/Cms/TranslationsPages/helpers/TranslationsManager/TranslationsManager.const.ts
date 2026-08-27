import { EMPTY_STRING } from '@const/strings.const';
import type { CmsTranslations } from '@pages/Cms/SettingsPages/SettingsPages.types';

export const TRANSLATION_VIEW = {
  TABLE: 'table',
  JSON: 'json',
} as const;

export const TRANSLATION_SCOPE = {
  GLOBAL: 'global',
  PAGE: 'page',
} as const;

export const TRANSLATION_COL = {
  KEY: 'key',
  SOURCE: 'source',
  TARGET: 'target',
  STATUS: 'status',
} as const;

export const TRANSLATION_PAGE_COL = {
  ID: 'id',
  TITLE: 'title',
  KEYS: 'keys',
} as const;

export const TRANSLATION_STATUS = {
  DONE: 'done',
  MISSING: 'missing',
  AI: 'ai',
} as const;

export const TRANSLATION_SOURCE_LOCALE = 'en';

export const TRANSLATION_LOCALES = ['en', 'fr', 'es', 'de', 'ja'] as const;

export const TRANSLATION_SEED: CmsTranslations = {
  sourceLocale: TRANSLATION_SOURCE_LOCALE,
  locales: {
    en: {
      'marketing.heading': 'Heading',
      'marketing.heroTitle': 'Content that reaches every surface',
      'marketing.cta': 'Start free',
      'auth.signIn': 'Sign in',
    },
    fr: {},
    es: {},
    de: {},
    ja: {},
  },
  pages: {},
  suggested: {},
};

export const TRANSLATION_JSON_INDENT = 2;
export const TRANSLATION_NEW_LOCALE = EMPTY_STRING;
export const TRANSLATION_SCOPE_GLOBAL = TRANSLATION_SCOPE.GLOBAL;
