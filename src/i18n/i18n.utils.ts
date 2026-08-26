import {
  ALL_LOCALES,
  LOCALE_DEFAULT,
  LOCALE_DIR_LTR,
  LOCALE_DIR_RTL,
  LOCALE_STORAGE_KEY,
  RTL_LOCALES,
} from './i18n.const';
import type { Locale } from './types';

export const isLocale = (value: string): value is Locale =>
  (ALL_LOCALES as readonly string[]).includes(value);

export const readStoredLocale = (): Locale => {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && isLocale(raw)) {
      return raw;
    }
  } catch {
    return LOCALE_DEFAULT;
  }
  return LOCALE_DEFAULT;
};

export const applyDocumentLocale = (locale: Locale): void => {
  document.documentElement.lang = locale;
  if (RTL_LOCALES.includes(locale)) {
    document.documentElement.dir = LOCALE_DIR_RTL;
    return;
  }
  document.documentElement.dir = LOCALE_DIR_LTR;
};
