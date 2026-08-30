import { useEffect, useState } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import type { ColumnDefinition } from '@forgedevstack/grid-table';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { cmsBuilderPath, cmsEditPath, EMPTY_STRING, PAGE_KIND_DOC, SLASH } from '@const/index';
import { authNucleus, contentNucleus } from '@sdk/index';
import { saveContentRequest } from '@sdk/modules/content';
import { loadCmsProfile, loadCmsSite, persistCmsSiteRemote } from '@pages/Cms/SettingsPages';
import {
  CONTENT_COLLECTION_DOCS,
  CONTENT_COLLECTION_PAGES,
  CONTENT_COLUMN_IDS,
  CONTENT_DATE_LOCALE,
  CONTENT_KIND_ITEM,
  CONTENT_LIST_COLLECTIONS,
  CONTENT_ROW_ID_ACCESSOR,
  CONTENT_STATUS_DRAFT,
  CONTENT_STATUS_PUBLISHED,
  CONTENT_TEMPLATE_EMPTY,
  DOCUMENT_DEFAULT_LOCALE,
  DOCUMENT_STARTER_STATUS,
} from '../ContentPages.const';
import type { ContentTableRow, UseContentPagesResult } from '../ContentPages.types';
import {
  contentStatusClass,
  contentStatusLabel,
  formatContentUpdated,
  isCatalogDocId,
  labelTemplateKind,
  payloadActor,
  rowsFromPublicDocs,
  slugFromCatalogId,
  templateKindFromPayload,
} from '../ContentPages.utils';
import { ContentRowActions } from '../helpers/ContentRowActions';
import { fetchPublicDocsList } from '@data/index';
import type { CmsDocItem } from '@data/docs.types';
import {
  PAYLOAD_KIND_KEY,
  PAYLOAD_LEAD_KEY,
  PAYLOAD_SECTIONS_KEY,
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_UPDATED_BY,
} from '@pages/Cms/ContentEdit/ContentEdit.const';
import {
  CAST_VALUE_SUMMARY_JOIN,
  CAST_VALUE_SUMMARY_SEP,
} from '@pages/Cms/ContentEdit/helpers/CastPageFields';
import {
  castFieldsFromPayload,
  castValuesFromPayload,
  findLinkedTemplate,
  mergeCastFields,
  summarizeCastValues,
} from '@pages/Cms/ContentEdit/castFields.utils';
import {
  PAGE_SLUG_PREFIX,
} from '@pages/Cms/TemplatesPages/TemplatesPages.const';

export const useContentPages = (): UseContentPagesResult => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, loading, error, saving, fetchContent, deleteContent } =
    useNucleus(contentNucleus);
  const activeToken = token || providerToken;
  const actorName = loadCmsProfile().displayName || loadCmsProfile().username;
  const [publicDocs, setPublicDocs] = useState<CmsDocItem[]>([]);

  useEffect(() => {
    void fetchPublicDocsList().then((next) => {
      setPublicDocs(next);
    });
  }, []);

  useEffect(() => {
    if (!activeToken) {
      return;
    }
    void fetchContent(activeToken);
  }, [activeToken, fetchContent]);

  const templateKindLabel = (kind: string): string =>
    labelTemplateKind(kind, t.dashboard);

  const cmsRows: ContentTableRow[] = items
    .filter((item) =>
      CONTENT_LIST_COLLECTIONS.some((collection) => collection === item.collection),
    )
    .map((item) => {
      const kind = templateKindFromPayload(item.payload, item.collection);
      return {
        id: item.id,
        kind: CONTENT_KIND_ITEM as typeof CONTENT_KIND_ITEM,
        title: item.title || item.slug,
        slug: item.slug,
        collection: item.collection,
        template: templateKindLabel(kind),
        templateKind: kind,
        fields: summarizeCastValues(
          mergeCastFields(
            castFieldsFromPayload(findLinkedTemplate(items, item.payload, item.id)?.payload),
            castFieldsFromPayload(item.payload),
          ),
          castValuesFromPayload(item.payload),
          CAST_VALUE_SUMMARY_JOIN,
          CAST_VALUE_SUMMARY_SEP,
        ),
        status: item.status,
        createdBy: payloadActor(item.payload, PAYLOAD_KEY_CREATED_BY),
        updatedBy: payloadActor(item.payload, PAYLOAD_KEY_UPDATED_BY),
        updatedAt: item.updatedAt,
        updated: formatContentUpdated(item.updatedAt, CONTENT_DATE_LOCALE),
        catalog: false,
      };
    });
  const knownSlugs = new Set(cmsRows.map((row) => row.slug));
  const publicRows = rowsFromPublicDocs({
    publicDocs,
    knownSlugs,
    templateLabel: templateKindLabel,
  });
  const rows: ContentTableRow[] = [...publicRows, ...cmsRows];

  const onNewPage = async () => {
    if (!activeToken) {
      return;
    }
    const item = await saveContentRequest(activeToken, {
      collection: CONTENT_COLLECTION_PAGES,
      slug: `${PAGE_SLUG_PREFIX}${Date.now()}`,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: t.dashboard.newPageBlank,
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        [PAYLOAD_KIND_KEY]: PAGE_KIND_DOC,
        [PAYLOAD_LEAD_KEY]: EMPTY_STRING,
        [PAYLOAD_SECTIONS_KEY]: [],
        [PAYLOAD_KEY_CREATED_BY]: actorName,
        [PAYLOAD_KEY_UPDATED_BY]: actorName,
      },
    });
    if (!item) {
      return;
    }
    await fetchContent(activeToken);
    navigate(cmsEditPath(item.id));
  };

  const onOpenRow = (id: string) => {
    if (!isCatalogDocId(id)) {
      navigate(cmsEditPath(id));
      return;
    }
    const slug = slugFromCatalogId(id);
    const existing = items.find(
      (item) =>
        item.slug === slug &&
        (item.collection === CONTENT_COLLECTION_PAGES ||
          item.collection === CONTENT_COLLECTION_DOCS),
    );
    if (existing) {
      navigate(cmsEditPath(existing.id));
      return;
    }
    const published = publicDocs.find((item) => item.slug === slug && item.id);
    if (published?.id) {
      navigate(cmsEditPath(published.id));
      return;
    }
    navigate(cmsEditPath(slug));
  };

  const onDeletePage = (id: string) => {
    if (!activeToken) {
      return;
    }
    void deleteContent(activeToken, id);
  };

  const onDuplicatePage = async (id: string) => {
    if (!activeToken) {
      return;
    }
    const source = items.find((item) => item.id === id);
    if (!source) {
      return;
    }
    const item = await saveContentRequest(activeToken, {
      collection: source.collection,
      slug: `${PAGE_SLUG_PREFIX}${Date.now()}`,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: source.title,
      status: CONTENT_STATUS_DRAFT,
      payload: {
        ...source.payload,
        [PAYLOAD_KEY_CREATED_BY]: actorName,
        [PAYLOAD_KEY_UPDATED_BY]: actorName,
      },
    });
    if (!item) {
      return;
    }
    await fetchContent(activeToken);
  };

  const onHomepage = async (id: string) => {
    if (!activeToken) {
      return;
    }
    const source = items.find((item) => item.id === id);
    if (!source) {
      return;
    }
    const site = loadCmsSite();
    const next = { ...site, homepagePath: `${SLASH}${source.slug}` };
    await persistCmsSiteRemote(activeToken, next);
  };

  const onSetStatus = async (
    id: string,
    status: typeof CONTENT_STATUS_DRAFT | typeof CONTENT_STATUS_PUBLISHED,
  ) => {
    if (!activeToken) {
      return;
    }
    const source = items.find((item) => item.id === id);
    if (!source) {
      return;
    }
    await saveContentRequest(activeToken, {
      collection: source.collection,
      slug: source.slug,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: source.title,
      status,
      payload: {
        ...source.payload,
        [PAYLOAD_KEY_UPDATED_BY]: actorName,
      },
    });
    await fetchContent(activeToken);
  };

  const columns = [
    {
      id: CONTENT_COLUMN_IDS.TITLE,
      accessor: CONTENT_COLUMN_IDS.TITLE,
      header: t.dashboard.contentColTitle,
      sortable: true,
      render: (value) => <b>{String(value ?? EMPTY_STRING)}</b>,
    },
    {
      id: CONTENT_COLUMN_IDS.SLUG,
      accessor: CONTENT_COLUMN_IDS.SLUG,
      header: t.dashboard.contentColSlug,
      sortable: true,
    },
    {
      id: CONTENT_COLUMN_IDS.TEMPLATE,
      accessor: CONTENT_COLUMN_IDS.TEMPLATE,
      header: t.dashboard.contentColTemplate,
      render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
    },
    {
      id: CONTENT_COLUMN_IDS.CREATED_BY,
      accessor: CONTENT_COLUMN_IDS.CREATED_BY,
      header: t.dashboard.contentColCreatedBy,
      render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
    },
    {
      id: CONTENT_COLUMN_IDS.UPDATED_BY,
      accessor: CONTENT_COLUMN_IDS.UPDATED_BY,
      header: t.dashboard.contentColUpdatedBy,
      render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
    },
    {
      id: CONTENT_COLUMN_IDS.FIELDS,
      accessor: CONTENT_COLUMN_IDS.FIELDS,
      header: t.dashboard.contentColFields,
      render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
    },
    {
      id: CONTENT_COLUMN_IDS.STATUS,
      accessor: CONTENT_COLUMN_IDS.STATUS,
      header: t.dashboard.contentColStatus,
      render: (_value, row) => (
        <span className={contentStatusClass(String(row.status))}>
          {contentStatusLabel(String(row.status), t.dashboard)}
        </span>
      ),
    },
    {
      id: CONTENT_COLUMN_IDS.UPDATED,
      accessor: CONTENT_COLUMN_IDS.UPDATED,
      header: t.dashboard.contentColUpdated,
      sortable: true,
    },
    {
      id: CONTENT_COLUMN_IDS.ACTIONS,
      accessor: CONTENT_ROW_ID_ACCESSOR,
      header: EMPTY_STRING,
      sortable: false,
      render: (_value, row) => (
        <ContentRowActions
          id={String(row.id)}
          status={String(row.status)}
          catalog={Boolean(row.catalog)}
          openLabel={t.dashboard.contentOpen}
          moreLabel={t.dashboard.contentMore}
          editLabel={t.dashboard.contentEdit}
          stageLabel={t.cmsBuilder.editInStage}
          duplicateLabel={t.dashboard.contentDuplicate}
          homepageLabel={t.dashboard.contentHomepage}
          draftLabel={t.dashboard.contentDraft}
          publishLabel={t.dashboard.contentPublish}
          deleteLabel={t.dashboard.contentDelete}
          deleteTitle={t.dashboard.contentDeleteTitle}
          deleteBody={t.dashboard.contentDeleteBody}
          deleteConfirm={t.dashboard.contentDeleteConfirm}
          deleteCancel={t.dashboard.contentDeleteCancel}
          deleting={saving}
          onOpen={(id) => {
            onOpenRow(id);
          }}
          onStage={(id) => navigate(cmsBuilderPath({ doc: id }))}
          onDuplicate={(id) => {
            void onDuplicatePage(id);
          }}
          onHomepage={(id) => {
            void onHomepage(id);
          }}
          onDraft={(id) => {
            void onSetStatus(id, CONTENT_STATUS_DRAFT);
          }}
          onPublish={(id) => {
            void onSetStatus(id, CONTENT_STATUS_PUBLISHED);
          }}
          onDelete={onDeletePage}
        />
      ),
    },
  ] as ColumnDefinition<ContentTableRow>[];

  return {
    t,
    saving,
    activeToken,
    error,
    loading,
    rows,
    columns,
    onNewPage,
    onOpenRow,
  };
};
