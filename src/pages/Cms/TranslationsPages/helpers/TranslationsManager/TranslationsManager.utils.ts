import { EMPTY_STRING } from '@const/strings.const';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { CmsTranslations } from '@pages/Cms/SettingsPages/SettingsPages.types';
import {
  TRANSLATION_LOCALE_PATTERN,
  TRANSLATION_SEED,
  TRANSLATION_SOURCE_LOCALE,
  TRANSLATION_STATUS,
} from './TranslationsManager.const';
import type {
  FillTemplateValues,
  TranslationLocaleNames,
  TranslationRow,
  TranslationRowStatus,
} from './TranslationsManager.types';

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
  if (!('sourceLocale' in value) || !('locales' in value)) {
    return false;
  }
  if (typeof value.sourceLocale !== 'string') {
    return false;
  }
  if (!value.locales || typeof value.locales !== 'object') {
    return false;
  }
  return true;
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
    .filter((key) => {
      if (!needle) {
        return true;
      }
      if (key.toLowerCase().includes(needle)) {
        return true;
      }
      return source[key].toLowerCase().includes(needle);
    })
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
  buildTranslationRows(bag, locale, EMPTY_STRING, pageId).filter(
    (row) => row.status === TRANSLATION_STATUS.MISSING,
  ).length;

export const countDone = (bag: CmsTranslations, locale: string, pageId = EMPTY_STRING): number =>
  buildTranslationRows(bag, locale, EMPTY_STRING, pageId).filter(
    (row) => row.status === TRANSLATION_STATUS.DONE,
  ).length;

export const countSuggested = (bag: CmsTranslations, locale: string, pageId = EMPTY_STRING): number =>
  buildTranslationRows(bag, locale, EMPTY_STRING, pageId).filter(
    (row) => row.status === TRANSLATION_STATUS.AI,
  ).length;

export const suggestedKeys = (bag: CmsTranslations, locale: string): string[] =>
  Object.keys(bag.suggested[locale] || {});

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

export const acceptOneSuggested = (
  bag: CmsTranslations,
  locale: string,
  key: string,
  pageId = EMPTY_STRING,
): CmsTranslations => {
  const value = bag.suggested[locale]?.[key] || EMPTY_STRING;
  return withLocaleTarget(bag, locale, key, value, pageId);
};

export const rejectSuggested = (
  bag: CmsTranslations,
  locale: string,
  key: string,
): CmsTranslations => {
  const suggested = { ...(bag.suggested[locale] || {}) };
  delete suggested[key];
  return {
    ...bag,
    suggested: {
      ...bag.suggested,
      [locale]: suggested,
    },
  };
};

export const addLocaleToBag = (bag: CmsTranslations, locale: string): CmsTranslations => {
  if (bag.locales[locale]) {
    return bag;
  }
  return {
    ...bag,
    locales: {
      ...bag.locales,
      [locale]: {},
    },
  };
};

export const listLocales = (bag: CmsTranslations): string[] => {
  const codes = Object.keys(bag.locales);
  const rest = codes.filter((code) => code !== bag.sourceLocale);
  if (codes.includes(bag.sourceLocale)) {
    return [bag.sourceLocale, ...rest];
  }
  return codes;
};

export const isLocaleCode = (value: string): boolean => TRANSLATION_LOCALE_PATTERN.test(value);

export const localeLanguageName = (params: {
  locale: string;
  names: TranslationLocaleNames;
}): string => {
  const { locale, names } = params;
  const mapped = names[locale];
  if (mapped) {
    return mapped;
  }
  return locale.toUpperCase();
};

export const fillTemplate = (template: string, values: FillTemplateValues): string =>
  Object.keys(values).reduce(
    (text, token) => text.replace(`{${token}}`, values[token] || EMPTY_STRING),
    template,
  );

export const downloadJsonFile = (params: { filename: string; body: string; mime: string }): void => {
  const { filename, body, mime } = params;
  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
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

export const resolveTranslateCatalogs = (value: unknown): Record<string, Record<string, string>> => {
  if (!value || typeof value !== 'object' || !('catalogs' in value)) {
    return {};
  }
  const catalogs = value.catalogs;
  if (!catalogs || typeof catalogs !== 'object') {
    return {};
  }
  const result: Record<string, Record<string, string>> = {};
  Object.keys(catalogs).forEach((locale) => {
    const map = Reflect.get(catalogs, locale);
    if (!map || typeof map !== 'object') {
      return;
    }
    const strings: Record<string, string> = {};
    Object.keys(map).forEach((key) => {
      const text = Reflect.get(map, key);
      if (typeof text === 'string') {
        strings[key] = text;
      }
    });
    result[locale] = strings;
  });
  return result;
};

export const pageKeyCount = (bag: CmsTranslations, pageId: string): number => {
  const page = bag.pages?.[pageId] || {};
  const source = page[bag.sourceLocale] || {};
  return Object.keys(source).length;
};
