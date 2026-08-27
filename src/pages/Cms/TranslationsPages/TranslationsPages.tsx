import { useEffect, useState, type FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '@const/strings.const';
import { contentNucleus } from '@sdk/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '@pages/Cms/CmsShell';
import { useI18n } from '@i18n/index';
import { useAuth } from '@hooks/index';
import { TranslationsManager } from './helpers/TranslationsManager';
import { pageKeyCount, seedIfEmpty } from './helpers/TranslationsManager';
import { loadCmsTranslationsLocal } from '@pages/Cms/SettingsPages/SettingsPages.utils';
import { TRANSLATION_SEED } from './helpers/TranslationsManager/TranslationsManager.const';

export const TranslationsPages: FC = () => {
  const { t } = useI18n();
  const { token } = useAuth();
  const { items, fetchContent } = useNucleus(contentNucleus);
  const [pageId, setPageId] = useState(EMPTY_STRING);
  const bag = seedIfEmpty(loadCmsTranslationsLocal() || TRANSLATION_SEED);
  const pages = items.map((item) => ({
    id: item.id,
    title: item.title || item.slug || item.id,
    keys: pageKeyCount(bag, item.id),
  }));

  useEffect(() => {
    if (!token) {
      return;
    }
    void fetchContent(token);
  }, [fetchContent, token]);

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.TRANSLATIONS}>
      <Flex direction="column" gap={4}>
        <CmsPageHeader title={t.cmsTranslations.title} subtitle={t.cmsTranslations.subtitle} />
        <TranslationsManager pageId={pageId} onOpenPage={setPageId} pages={pages} />
      </Flex>
    </CmsShell>
  );
};
