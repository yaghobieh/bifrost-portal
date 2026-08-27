import { useState, type FC } from 'react';
import { Button, Flex, Select } from '@forgedevstack/bear';
import { isStringValue } from '@utils';
import { EMPTY_STRING } from '@const/strings.const';
import { useI18n } from '@i18n/index';
import { loadCmsTranslationsLocal } from '@pages/Cms/SettingsPages/SettingsPages.utils';
import {
  seedIfEmpty,
  TRANSLATION_SEED,
  TRANSLATION_GLOBAL_ID,
} from '@pages/Cms/TranslationsPages/helpers/TranslationsManager';
import {
  TRANSLATION_KEY_SELECT_ID,
  TRANSLATION_PAGE_SELECT_ID,
} from './ContentTranslationWidget.const';
import {
  translationKeysForPage,
  translationPageOptions,
  translationSourceForKey,
} from './ContentTranslationWidget.utils';
import type { ContentTranslationWidgetProps } from './ContentTranslationWidget.types';

export const ContentTranslationWidget: FC<ContentTranslationWidgetProps> = (props) => {
  const { items, onApply } = props;
  const { t } = useI18n();
  const bag = seedIfEmpty(loadCmsTranslationsLocal() || TRANSLATION_SEED);
  const [pageId, setPageId] = useState(TRANSLATION_GLOBAL_ID);
  const [keyId, setKeyId] = useState(EMPTY_STRING);
  const pageOptions = translationPageOptions({
    items,
    globalLabel: t.cmsTranslations.scopeGlobal,
  });
  const keys = translationKeysForPage({ bag, pageId });
  const keyOptions = keys.map((key) => ({ value: key, label: key }));

  const onApplyClick = () => {
    if (!keyId) {
      return;
    }
    onApply({
      key: keyId,
      source: translationSourceForKey({ bag, pageId, key: keyId }),
    });
  };

  return (
    <Flex direction="column" gap={2} className="bifrost-cms-translation-widget">
      <Select
        id={TRANSLATION_PAGE_SELECT_ID}
        label={t.cmsTranslations.translationPage}
        options={pageOptions}
        value={pageId}
        size="sm"
        fullWidth
        onChange={(next) => {
          if (isStringValue(next)) {
            setPageId(next);
            setKeyId(EMPTY_STRING);
          }
        }}
      />
      <Select
        id={TRANSLATION_KEY_SELECT_ID}
        label={t.cmsTranslations.translationKey}
        options={keyOptions}
        value={keyId}
        size="sm"
        fullWidth
        onChange={(next) => {
          if (isStringValue(next)) {
            setKeyId(next);
          }
        }}
      />
      <Button size="sm" variant="outline" onClick={onApplyClick}>
        {t.cmsTranslations.translationApply}
      </Button>
    </Flex>
  );
};
