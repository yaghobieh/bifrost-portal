import { useEffect, useState, type FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '@const/strings.const';
import { contentNucleus } from '@sdk/index';
import { saveContentRequest } from '@sdk/modules/content';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '@pages/Cms/CmsShell';
import { useI18n } from '@i18n/index';
import { useAuth } from '@hooks/index';
import { TranslationsManager, pageKeyCount, seedIfEmpty, TRANSLATION_SEED } from './helpers/TranslationsManager';
import { loadCmsTranslationsLocal } from '@pages/Cms/SettingsPages/SettingsPages.utils';
import { TRANSLATION_CONTENT_COLLECTIONS } from './TranslationsPages.const';
import { PAGE_SLUG_PREFIX } from '@pages/Cms/TemplatesPages/TemplatesPages.const';
import {
  CONTENT_COLLECTION_PAGES,
  DOCUMENT_DEFAULT_LOCALE,
  DOCUMENT_STARTER_STATUS,
} from '@pages/Cms/ContentPages/ContentPages.const';
import {
  PAYLOAD_KEY_CAST_FIELDS,
  PAYLOAD_KEY_CAST_VALUES,
} from '@pages/Cms/ContentEdit/ContentEdit.const';

export const TranslationsPages: FC = () => {
  const { t } = useI18n();
  const { token } = useAuth();
  const { items, fetchContent } = useNucleus(contentNucleus);
  const [pageId, setPageId] = useState(EMPTY_STRING);
  const bag = seedIfEmpty(loadCmsTranslationsLocal() || TRANSLATION_SEED);
  const pages = items
    .filter((item) => TRANSLATION_CONTENT_COLLECTIONS.includes(item.collection))
    .map((item) => ({
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

  const onCreatePage = async (title: string): Promise<string | null> => {
    if (!token) {
      return null;
    }
    const slug = `${PAGE_SLUG_PREFIX}${Date.now()}`;
    const item = await saveContentRequest(token, {
      collection: CONTENT_COLLECTION_PAGES,
      slug,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title,
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        [PAYLOAD_KEY_CAST_FIELDS]: [],
        [PAYLOAD_KEY_CAST_VALUES]: {},
      },
    });
    if (!item) {
      return null;
    }
    await fetchContent(token);
    return item.id;
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.TRANSLATIONS}>
      <Flex direction="column" gap={4}>
        <CmsPageHeader title={t.cmsTranslations.title} subtitle={t.cmsTranslations.subtitle} />
        <TranslationsManager
          pageId={pageId}
          onOpenPage={setPageId}
          pages={pages}
          onCreatePage={onCreatePage}
        />
      </Flex>
    </CmsShell>
  );
};
