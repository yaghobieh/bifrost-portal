import { useEffect, useState } from 'react';
import { CMS_TRANSLATIONS_EVENT, EMPTY_STRING } from '@const/strings.const';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import {
  loadCmsTranslationsLocal,
  loadCmsTranslationsRemote,
  saveCmsTranslationsLocal,
  saveCmsTranslationsRemote,
} from '@pages/Cms/SettingsPages/SettingsPages.utils';
import {
  TRANSLATION_LOCALES,
  TRANSLATION_SEED,
  TRANSLATION_SOURCE_LOCALE,
} from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.const';
import {
  seedIfEmpty,
  withLocaleTarget,
} from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.utils';

export const useBuilderTranslations = (pageId = EMPTY_STRING) => {
  const { token } = useAuth();
  const { locale } = useI18n();
  const [bag, setBag] = useState(() => seedIfEmpty(loadCmsTranslationsLocal() || TRANSLATION_SEED));

  useEffect(() => {
    const onBag = () => {
      setBag(seedIfEmpty(loadCmsTranslationsLocal() || TRANSLATION_SEED));
    };
    window.addEventListener(CMS_TRANSLATIONS_EVENT, onBag);
    return () => {
      window.removeEventListener(CMS_TRANSLATIONS_EVENT, onBag);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    void loadCmsTranslationsRemote(token).then((remote) => {
      if (remote) {
        setBag(seedIfEmpty(remote));
      }
    });
  }, [token]);

  const pageMaps = pageId ? bag.pages?.[pageId] || {} : {};
  const globalSource = bag.locales[bag.sourceLocale] || {};
  const pageSource = pageMaps[bag.sourceLocale] || {};
  const source = { ...globalSource, ...pageSource };
  const localeBag = {
    ...source,
    ...(bag.locales[locale] || {}),
    ...(pageMaps[locale] || {}),
  };
  const keys = Object.keys(source);
  const keyOptions = keys.map((key) => ({ value: key, label: key }));
  const noneOption = { value: EMPTY_STRING, label: EMPTY_STRING };

  const persist = (next: typeof bag) => {
    setBag(next);
    saveCmsTranslationsLocal(next);
    if (token) {
      void saveCmsTranslationsRemote(token, next);
    }
  };

  const createKey = (key: string, value: string) => {
    const trimmed = key.trim();
    if (!trimmed) {
      return;
    }
    persist(withLocaleTarget(bag, TRANSLATION_SOURCE_LOCALE, trimmed, value, pageId));
  };

  return {
    locale,
    localeBag,
    keys,
    keyOptions: [noneOption, ...keyOptions],
    locales: TRANSLATION_LOCALES,
    createKey,
  };
};
