import { useEffect, useState } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import type { ColumnDefinition } from '@forgedevstack/grid-table';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { cmsBuilderPath, cmsEditPath, EMPTY_STRING, SLASH } from '@const/index';
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
  SAVED_TEMPLATES_DIVIDER_KEY,
  TEMPLATE_KIND,
} from '../ContentPages.const';
import type { ContentTableRow, UseContentPagesResult } from '../ContentPages.types';
import {
  catalogDocId,
  catalogDocSlugs,
  contentStatusClass,
  contentStatusLabel,
  docsCastValues,
  formatContentUpdated,
  isCatalogDocId,
  isDocsLayout,
  payloadActor,
  slugFromCatalogId,
  templateKindFromPayload,
  titleFromSlug,
  uniqueSlugs,
  buildDocsCastFields,
} from '../ContentPages.utils';
import { ContentRowActions } from '../helpers/ContentRowActions';
import {
  PAGE_START_IDS,
  PAGE_START_LAYOUT,
  PAGE_START_LAYOUT_BY_ID,
} from '../helpers/PageStart';
import type { PageStartId } from '../helpers/PageStart';
import { fetchPublicDocsList } from '@data/index';
import type { CmsDocItem } from '@data/docs.types';
import { cloneCanvasTree, canvasFromPayload } from '@pages/Cms/BuilderPages/BuilderPages.utils';
import {
  PAYLOAD_KEY_CAST_FIELDS,
  PAYLOAD_KEY_CAST_VALUES,
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_LAYOUT,
  PAYLOAD_KEY_TEMPLATE,
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
  PAGE_LAYOUT_TEMPLATES,
  PAGE_SLUG_PREFIX,
  TEMPLATES_COLLECTION,
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

  const templateKindLabel = (kind: string): string => {
    if (kind === TEMPLATE_KIND.DOC) {
      return t.dashboard.contentTemplateDoc;
    }
    if (kind === TEMPLATE_KIND.MARKETING) {
      return t.dashboard.contentTemplateMarketing;
    }
    if (kind === TEMPLATE_KIND.BLANK) {
      return t.dashboard.contentTemplateBlank;
    }
    return t.dashboard.contentTemplatePage;
  };

  const cmsRows: ContentTableRow[] = items
    .filter((item) =>
      CONTENT_LIST_COLLECTIONS.some((collection) => collection === item.collection),
    )
    .map((item) => ({
      id: item.id,
      kind: CONTENT_KIND_ITEM as typeof CONTENT_KIND_ITEM,
      title: item.title || item.slug,
      slug: item.slug,
      collection: item.collection,
      template: templateKindLabel(templateKindFromPayload(item.payload, item.collection)),
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
    }));
  const knownSlugs = new Set(cmsRows.map((row) => row.slug));
  const publishedBySlug = new Map(publicDocs.map((item) => [item.slug, item]));
  const catalogSlugs = uniqueSlugs([
    ...catalogDocSlugs(),
    ...publicDocs.map((item) => item.slug),
  ]).filter((slug) => !knownSlugs.has(slug));
  const catalogRows: ContentTableRow[] = catalogSlugs.map((slug) => {
    const published = publishedBySlug.get(slug);
    const publishedAt = published?.updatedAt || EMPTY_STRING;
    return {
      id: catalogDocId(slug),
      kind: CONTENT_KIND_ITEM as typeof CONTENT_KIND_ITEM,
      title: published?.title || titleFromSlug(slug),
      slug,
      collection: CONTENT_COLLECTION_PAGES,
      template: templateKindLabel(TEMPLATE_KIND.DOC),
      fields: EMPTY_STRING,
      status: published ? CONTENT_STATUS_PUBLISHED : CONTENT_STATUS_DRAFT,
      createdBy: EMPTY_STRING,
      updatedBy: EMPTY_STRING,
      updatedAt: publishedAt,
      updated: publishedAt
        ? formatContentUpdated(publishedAt, CONTENT_DATE_LOCALE)
        : CONTENT_TEMPLATE_EMPTY,
      catalog: true,
    };
  });
  const rows: ContentTableRow[] = [...catalogRows, ...cmsRows];

  const onNewPage = async (layoutId: string) => {
    if (!activeToken) {
      return;
    }
    const layout = PAGE_LAYOUT_TEMPLATES.find((item) => item.id === layoutId);
    const saved = items.find((item) => item.id === layoutId);
    const fromSaved = saved ? canvasFromPayload(saved.payload) : null;
    const canvas = layout
      ? cloneCanvasTree(layout.tree)
      : fromSaved
        ? cloneCanvasTree(fromSaved)
        : [];
    const title = layout?.title || saved?.title || t.dashboard.newPageBlank;
    const slug = `${PAGE_SLUG_PREFIX}${Date.now()}`;
    const item = await saveContentRequest(activeToken, {
      collection: CONTENT_COLLECTION_PAGES,
      slug,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title,
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        canvas,
        [PAYLOAD_KEY_LAYOUT]: layout?.id || layoutId,
        [PAYLOAD_KEY_TEMPLATE]: saved?.id,
        [PAYLOAD_KEY_CAST_FIELDS]: layout?.castFields || castFieldsFromPayload(saved?.payload),
        [PAYLOAD_KEY_CAST_VALUES]: layout?.castValues || castValuesFromPayload(saved?.payload),
        [PAYLOAD_KEY_CREATED_BY]: actorName,
        [PAYLOAD_KEY_UPDATED_BY]: actorName,
      },
    });
    if (!item) {
      return;
    }
    await fetchContent(activeToken);
    if (layout && isDocsLayout(layout.id)) {
      navigate(cmsEditPath(item.id));
      return;
    }
    if (saved) {
      navigate(cmsEditPath(item.id));
      return;
    }
    navigate(cmsBuilderPath({ doc: item.id }));
  };

  const onOpenRow = async (id: string) => {
    if (!isCatalogDocId(id)) {
      navigate(cmsEditPath(id));
      return;
    }
    if (!activeToken) {
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
    const item = await saveContentRequest(activeToken, {
      collection: CONTENT_COLLECTION_PAGES,
      slug,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: titleFromSlug(slug),
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        [PAYLOAD_KEY_LAYOUT]: PAGE_START_LAYOUT.DOC,
        [PAYLOAD_KEY_CAST_FIELDS]: buildDocsCastFields(),
        [PAYLOAD_KEY_CAST_VALUES]: docsCastValues(),
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

  const onDeletePage = (id: string) => {
    if (!activeToken) {
      return;
    }
    void deleteContent(activeToken, id);
  };

  const onStartPage = (id: PageStartId) => {
    const layoutId = PAGE_START_LAYOUT_BY_ID[id as keyof typeof PAGE_START_LAYOUT_BY_ID];
    if (layoutId) {
      void onNewPage(layoutId);
      return;
    }
    const firstSaved = items.find((item) => item.collection === TEMPLATES_COLLECTION);
    if (firstSaved) {
      void onNewPage(firstSaved.id);
    }
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

  const savedTemplates = items.filter((item) => item.collection === TEMPLATES_COLLECTION);
  const newPageItems = [
    ...PAGE_LAYOUT_TEMPLATES.map((layout) => ({
      key: layout.id,
      label: layout.title,
      onClick: () => {
        void onNewPage(layout.id);
      },
    })),
    ...(savedTemplates.length
      ? [{ key: SAVED_TEMPLATES_DIVIDER_KEY, label: EMPTY_STRING, divider: true as const }]
      : []),
    ...savedTemplates.map((item) => ({
      key: item.id,
      label: item.title || item.slug,
      onClick: () => {
        void onNewPage(item.id);
      },
    })),
  ];

  const startCards = [
    {
      id: PAGE_START_IDS.BLANK,
      title: t.dashboard.startBlankTitle,
      body: t.dashboard.startBlankBody,
      cta: t.dashboard.startBlankCta,
      tag: EMPTY_STRING,
      recommended: false,
    },
    {
      id: PAGE_START_IDS.DOC,
      title: t.dashboard.startDocTitle,
      body: t.dashboard.startDocBody,
      cta: t.dashboard.startDocCta,
      tag: t.dashboard.startRecommended,
      recommended: true,
    },
    {
      id: PAGE_START_IDS.MARKETING,
      title: t.dashboard.startMarketingTitle,
      body: t.dashboard.startMarketingBody,
      cta: t.dashboard.startMarketingCta,
      tag: EMPTY_STRING,
      recommended: false,
    },
    {
      id: PAGE_START_IDS.REUSE,
      title: t.dashboard.startReuseTitle,
      body: t.dashboard.startReuseBody,
      cta: t.dashboard.startReuseCta,
      tag: EMPTY_STRING,
      recommended: false,
    },
  ];

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
            void onOpenRow(id);
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
    startCards,
    columns,
    newPageItems,
    onStartPage,
    onOpenRow,
  };
};
