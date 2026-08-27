import { EMPTY_STRING } from '@const/strings.const';
import type { CmsTranslations } from '@pages/Cms/SettingsPages/SettingsPages.types';
import { TRANSLATION_GLOBAL_ID } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager';
import type { ContentItem } from '@sdk/modules/content';
import type { TranslationPickerOption } from './ContentTranslationWidget.types';

export const translationPageOptions = (params: {
  items: ContentItem[];
  globalLabel: string;
}): TranslationPickerOption[] => {
  const { items, globalLabel } = params;
  return [
    { value: TRANSLATION_GLOBAL_ID, label: globalLabel },
    ...items.map((item) => ({
      value: item.id,
      label: item.title || item.slug || item.id,
    })),
  ];
};

export const translationKeysForPage = (params: {
  bag: CmsTranslations;
  pageId: string;
}): string[] => {
  const { bag, pageId } = params;
  if (pageId === TRANSLATION_GLOBAL_ID || !pageId) {
    return Object.keys(bag.locales[bag.sourceLocale] || {});
  }
  const page = bag.pages?.[pageId] || {};
  return Object.keys(page[bag.sourceLocale] || {});
};

export const translationSourceForKey = (params: {
  bag: CmsTranslations;
  pageId: string;
  key: string;
}): string => {
  const { bag, pageId, key } = params;
  if (pageId === TRANSLATION_GLOBAL_ID || !pageId) {
    return bag.locales[bag.sourceLocale]?.[key] || EMPTY_STRING;
  }
  const page = bag.pages?.[pageId] || {};
  return page[bag.sourceLocale]?.[key] || EMPTY_STRING;
};
