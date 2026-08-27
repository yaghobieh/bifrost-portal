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
export const TRANSLATION_DEFAULT_TARGET = 'fr';
export const TRANSLATION_SOURCE_SEP = ' • ';
export const TRANSLATION_EXPORT_NAME = 'translations.json';
export const TRANSLATION_FILE_ACCEPT = '.json,application/json';
export const TRANSLATION_IMPORT_ID = 'bifrost-cms-translations-import';
export const TRANSLATION_LOCALE_PATTERN = /^[a-z]{2}(?:-[a-z]{2})?$/;
export const TRANSLATION_JSON_INDENT = 2;

export const TRANSLATION_LOCALES = ['en', 'fr', 'es', 'de', 'ja'] as const;

export const TRANSLATION_SEED: CmsTranslations = {
  sourceLocale: TRANSLATION_SOURCE_LOCALE,
  locales: {
    en: {
      'nav.docs': 'Docs',
      'hero.eyebrow': 'ForgeStack',
      'hero.headline': 'Content that reaches every surface',
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

export const TRANSLATION_NEW_LOCALE = EMPTY_STRING;
export const TRANSLATION_SCOPE_GLOBAL = TRANSLATION_SCOPE.GLOBAL;
export const TRANSLATION_GLOBAL_ID = '__global__';
export const TRANSLATION_KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9._-]*$/;
