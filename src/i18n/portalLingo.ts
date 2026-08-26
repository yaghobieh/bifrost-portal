import { createLingo } from '@forgedevstack/lingo';
import type { TranslationMap } from '@forgedevstack/lingo';
import { LOCALE_STORAGE_KEY } from '@const/strings.const';
import { en } from './portal.en';
import { es } from './portal.es';
import { mergeCatalog } from './catalogMerge.utils';
import esCatalog from './catalogs/es.json';
import heCatalog from './catalogs/he.json';
import frCatalog from './catalogs/fr.json';
import deCatalog from './catalogs/de.json';
import type { Messages } from './portal.types';

const toMap = (messages: Messages): TranslationMap => messages as unknown as TranslationMap;

export const portalLingo = createLingo({
  defaultLocale: 'en',
  fallbackLocale: 'en',
  locales: ['en', 'es', 'he', 'fr', 'de'],
  storageKey: LOCALE_STORAGE_KEY,
  source: {
    type: 'local',
    translations: {
      en: toMap(en),
      es: toMap(mergeCatalog(es, esCatalog)),
      he: toMap(mergeCatalog(en, heCatalog)),
      fr: toMap(mergeCatalog(en, frCatalog)),
      de: toMap(mergeCatalog(en, deCatalog)),
    },
  },
});
