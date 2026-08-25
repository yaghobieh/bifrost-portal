import { createLingo } from '@forgedevstack/lingo';
import type { TranslationMap } from '@forgedevstack/lingo';
import { LOCALE_STORAGE_KEY } from '@const/strings.const';
import { en } from './en';
import { es } from './es';

export const portalLingo = createLingo({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: ['en', 'es'],
  storageKey: LOCALE_STORAGE_KEY,
  source: {
    type: 'local',
    translations: {
      en: en as unknown as TranslationMap,
      es: es as unknown as TranslationMap,
    },
  },
});
