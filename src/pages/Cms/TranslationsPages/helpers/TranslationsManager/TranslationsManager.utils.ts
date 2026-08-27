import { EMPTY_STRING } from '@const/strings.const';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { CmsTranslations } from '@pages/Cms/SettingsPages/SettingsPages.types';
import {
  TRANSLATION_SEED,
  TRANSLATION_SOURCE_LOCALE,
  TRANSLATION_STATUS,
} from './TranslationsManager.const';
import type { TranslationRow, TranslationRowStatus } from './TranslationsManager.types';

export const emptyBag = (): CmsTranslations => ({
  sourceLocale: TRANSLATION_SOURCE_LOCALE,
  locales: { ...TRANSLATION_SEED.locales },
  pages: {},
  suggested: {},
});

export const isTranslations = (value: unknown): value is CmsTranslations => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as CmsTranslations;
  return typeof record.sourceLocale === 'string' && Boolean(record.locales) && typeof record.locales === 'object';
};

export const translationRowStatus = (input: {
  target: string;
  suggested: string;
}): TranslationRowStatus => {
  if (input.target) {
    return TRANSLATION_STATUS.DONE;
  }
  if (input.suggested) {
    return TRANSLATION_STATUS.AI;
  }
  return TRANSLATION_STATUS.MISSING;
};

const mapsForScope = (bag: CmsTranslations, locale: string, pageId: string) => {
  if (!pageId) {
    return {
      source: bag.locales[bag.sourceLocale] || {},
      target: bag.locales[locale] || {},
      suggested: bag.suggested[locale] || {},
    };
  }
  const page = bag.pages?.[pageId] || {};
  return {
    source: page[bag.sourceLocale] || {},
    target: page[locale] || {},
    suggested: bag.suggested[locale] || {},
  };
};

export const buildTranslationRows = (
  bag: CmsTranslations,
  locale: string,
  query: string,
  pageId = EMPTY_STRING,
): TranslationRow[] => {
  const { source, target, suggested } = mapsForScope(bag, locale, pageId);
  const keys = Object.keys(source);
  const needle = query.trim().toLowerCase();
  return keys
    .filter((key) => !needle || key.toLowerCase().includes(needle) || source[key].toLowerCase().includes(needle))
    .map((key) => {
      const targetValue = target[key] || EMPTY_STRING;
      const suggestedValue = suggested[key] || EMPTY_STRING;
      return {
        id: key,
        key,
        source: source[key] || EMPTY_STRING,
        target: targetValue || suggestedValue,
        status: translationRowStatus({ target: targetValue, suggested: suggestedValue }),
      };
    });
};

export const countMissing = (bag: CmsTranslations, locale: string, pageId = EMPTY_STRING): number =>
  buildTranslationRows(bag, locale, EMPTY_STRING, pageId).filter((row) => row.status === TRANSLATION_STATUS.MISSING)
    .length;

export const countDone = (bag: CmsTranslations, locale: string, pageId = EMPTY_STRING): number =>
  buildTranslationRows(bag, locale, EMPTY_STRING, pageId).filter((row) => row.status === TRANSLATION_STATUS.DONE)
    .length;

export const countSuggested = (bag: CmsTranslations, locale: string, pageId = EMPTY_STRING): number =>
  buildTranslationRows(bag, locale, EMPTY_STRING, pageId).filter((row) => row.status === TRANSLATION_STATUS.AI)
    .length;

export const parseTranslationsJson = (raw: string): CmsTranslations | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isTranslations(parsed)) {
      return null;
    }
    return {
      sourceLocale: parsed.sourceLocale || TRANSLATION_SOURCE_LOCALE,
      locales: parsed.locales,
      pages: parsed.pages || {},
      suggested: parsed.suggested || {},
    };
  } catch {
    return null;
  }
};

export const withLocaleTarget = (
  bag: CmsTranslations,
  locale: string,
  key: string,
  value: string,
  pageId = EMPTY_STRING,
): CmsTranslations => {
  const suggested = { ...(bag.suggested[locale] || {}) };
  delete suggested[key];
  if (!pageId) {
    const current = bag.locales[locale] || {};
    return {
      ...bag,
      locales: {
        ...bag.locales,
        [locale]: { ...current, [key]: value },
      },
      suggested: {
        ...bag.suggested,
        [locale]: suggested,
      },
    };
  }
  const page = bag.pages?.[pageId] || {};
  const current = page[locale] || {};
  return {
    ...bag,
    pages: {
      ...(bag.pages || {}),
      [pageId]: {
        ...page,
        [locale]: { ...current, [key]: value },
      },
    },
    suggested: {
      ...bag.suggested,
      [locale]: suggested,
    },
  };
};

export const acceptSuggested = (bag: CmsTranslations, locale: string): CmsTranslations => {
  const suggested = bag.suggested[locale] || {};
  const current = bag.locales[locale] || {};
  return {
    ...bag,
    locales: {
      ...bag.locales,
      [locale]: { ...current, ...suggested },
    },
    suggested: {
      ...bag.suggested,
      [locale]: {},
    },
  };
};

export const seedIfEmpty = (bag: CmsTranslations): CmsTranslations => {
  const source = bag.locales[bag.sourceLocale];
  if (source && Object.keys(source).length > NUMBER_ZERO) {
    return {
      ...bag,
      pages: bag.pages || {},
    };
  }
  return emptyBag();
};

export const pageKeyCount = (bag: CmsTranslations, pageId: string): number => {
  const page = bag.pages?.[pageId] || {};
  const source = page[bag.sourceLocale] || {};
  return Object.keys(source).length;
};
