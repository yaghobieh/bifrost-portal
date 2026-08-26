import { createLingo } from '@forgedevstack/lingo';
import type { TranslationMap } from '@forgedevstack/lingo';
import { I18N_CATALOGS } from './cmsCatalogs';
import { ALL_LOCALES, LOCALE_DEFAULT, LOCALE_STORAGE_KEY } from './i18n.const';
import type { Messages } from './types';

const toMap = (messages: Messages): TranslationMap => ({ ...messages }) as TranslationMap;

export const cmsLingo = createLingo({
  defaultLocale: LOCALE_DEFAULT,
  fallbackLocale: LOCALE_DEFAULT,
  locales: [...ALL_LOCALES],
  storageKey: LOCALE_STORAGE_KEY,
  cache: false,
  debug: false,
  source: {
    type: 'local',
    translations: {
      en: toMap(I18N_CATALOGS.en),
      es: toMap(I18N_CATALOGS.es),
      he: toMap(I18N_CATALOGS.he),
      fr: toMap(I18N_CATALOGS.fr),
      de: toMap(I18N_CATALOGS.de),
    },
  },
});
