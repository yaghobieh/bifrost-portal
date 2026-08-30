import { useEffect, type FC } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { Button, Card, Dropdown, Flex, Typography } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import type { ColumnDefinition } from '@forgedevstack/grid-table';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { cmsBuilderPath, cmsEditPath, EMPTY_STRING, SLASH } from '@const/index';
import { authNucleus, contentNucleus } from '@sdk/index';
import { saveContentRequest } from '@sdk/modules/content';
import { loadCmsProfile, loadCmsSite, persistCmsSiteRemote } from '../SettingsPages';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import {
  CONTENT_COLLECTION_PAGES,
  CONTENT_COLUMN_IDS,
  CONTENT_DATE_LOCALE,
  CONTENT_KIND_FILTER_OPERATOR,
  CONTENT_KIND_FILTER_TYPE,
  CONTENT_EMPTY_CLASS,
  CONTENT_ERROR_CLASS,
  CONTENT_KIND_ITEM,
  CONTENT_LIST_COLLECTIONS,
  CONTENT_NEW_PAGE_MENU_MIN_WIDTH,
  CONTENT_ROW_ID_ACCESSOR,
  CONTENT_STATUS_DRAFT,
  CONTENT_STATUS_PUBLISHED,
  CONTENT_TABLE_WRAP_CLASS,
  CONTENT_TEMPLATE_EMPTY,
  DOCUMENT_DEFAULT_LOCALE,
  DOCUMENT_STARTER_STATUS,
  SAVED_TEMPLATES_DIVIDER_KEY,
} from './ContentPages.const';
import type { ContentTableRow } from './ContentPages.types';
import {
  contentKindFilterOptions,
  contentStatusClass,
  contentStatusLabel,
  formatContentUpdated,
  isDocsLayout,
  labelTemplateKind,
  matchesContentKindFilter,
  payloadActor,
  templateFromPayload,
  templateKindFromPayload,
} from './ContentPages.utils';
import { ContentRowActions } from './helpers/ContentRowActions';
import { PAGE_START_IDS, PAGE_START_LAYOUT, PageStart } from './helpers/PageStart';
import type { PageStartId } from './helpers/PageStart';
import { cloneCanvasTree, canvasFromPayload } from '../BuilderPages/BuilderPages.utils';
import {
  PAYLOAD_KEY_AUTHOR,
  PAYLOAD_KEY_CAST_FIELDS,
  PAYLOAD_KEY_CAST_VALUES,
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_LAYOUT,
  PAYLOAD_KEY_TEMPLATE,
  PAYLOAD_KIND_KEY,
} from '../ContentEdit/ContentEdit.const';
import {
  CAST_VALUE_SUMMARY_JOIN,
  CAST_VALUE_SUMMARY_SEP,
} from '../ContentEdit/helpers/CastPageFields';
import {
  castFieldsFromPayload,
  castValuesFromPayload,
  findLinkedTemplate,
  mergeCastFields,
  summarizeCastValues,
} from '../ContentEdit/castFields.utils';
import {
  PAGE_LAYOUT_TEMPLATES,
  PAGE_SLUG_PREFIX,
  TEMPLATES_COLLECTION,
} from '../TemplatesPages/TemplatesPages.const';

export const ContentPages: FC = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, loading, error, saving, fetchContent, deleteContent } =
    useNucleus(contentNucleus);
  const activeToken = token || providerToken;
  const actorName = loadCmsProfile().displayName || loadCmsProfile().username;
  const kindFilterOptions = contentKindFilterOptions(t.dashboard);

  useEffect(() => {
    if (!activeToken) return;
    void fetchContent(activeToken);
  }, [activeToken, fetchContent]);

  const rows: ContentTableRow[] = items
    .filter((item) =>
      CONTENT_LIST_COLLECTIONS.includes(
        item.collection as (typeof CONTENT_LIST_COLLECTIONS)[number],
      ),
    )
    .map((item) => {
      const templateKind = templateKindFromPayload(item.payload, item.collection);
      return {
        id: item.id,
        kind: CONTENT_KIND_ITEM as typeof CONTENT_KIND_ITEM,
        title: item.title || item.slug,
        slug: item.slug,
        collection: item.collection,
        template: templateFromPayload(item.payload),
        templateKind,
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
        createdBy:
          payloadActor(item.payload, PAYLOAD_KEY_CREATED_BY) ||
          payloadActor(item.payload, PAYLOAD_KEY_AUTHOR),
        updatedAt: item.updatedAt,
        updated: formatContentUpdated(item.updatedAt, CONTENT_DATE_LOCALE),
      };
    });

  const onNewPage = async (layoutId: string) => {
    if (!activeToken) return;
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
        [PAYLOAD_KIND_KEY]: templateKindFromPayload(
          {
            [PAYLOAD_KEY_LAYOUT]: layout?.id || layoutId,
            [PAYLOAD_KEY_TEMPLATE]: saved?.id,
          },
          CONTENT_COLLECTION_PAGES,
        ),
        [PAYLOAD_KEY_CAST_FIELDS]: layout?.castFields || castFieldsFromPayload(saved?.payload),
        [PAYLOAD_KEY_CAST_VALUES]: layout?.castValues || castValuesFromPayload(saved?.payload),
        [PAYLOAD_KEY_CREATED_BY]: actorName,
      },
    });
    if (!item) return;
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

  const onDeletePage = (id: string) => {
    if (!activeToken) return;
    void deleteContent(activeToken, id);
  };

  const onStartPage = (id: PageStartId) => {
    if (id === PAGE_START_IDS.BLANK) {
      void onNewPage(PAGE_START_LAYOUT.BLANK);
      return;
    }
    if (id === PAGE_START_IDS.DOC) {
      void onNewPage(PAGE_START_LAYOUT.DOC);
      return;
    }
    if (id === PAGE_START_IDS.MARKETING) {
      void onNewPage(PAGE_START_LAYOUT.MARKETING);
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

  const onSetStatus = async (id: string, status: typeof CONTENT_STATUS_DRAFT | typeof CONTENT_STATUS_PUBLISHED) => {
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
      payload: source.payload,
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

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.PAGES}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <CmsPageHeader
          title={t.dashboard.contentTitle}
          subtitle={t.dashboard.contentSubtitle}
          extra={
            <Card variant="elevated" padding="md">
              <Flex justify="between" align="center" gap={3} className="flex-wrap">
                <div>
                  <Typography variant="h4" className="mb-1">
                    {t.dashboard.templatesTitle}
                  </Typography>
                  <Typography variant="body2" className="bifrost-cms__muted mb-0">
                    {t.dashboard.templatesSubtitle}
                  </Typography>
                </div>
                <Flex gap={2} align="center">
            <Dropdown
              placement="bottom-end"
              minWidth={CONTENT_NEW_PAGE_MENU_MIN_WIDTH}
              trigger={
                <Button size="sm" variant="primary" disabled={saving || !activeToken}>
                  {t.dashboard.newPage}
                </Button>
              }
              items={newPageItems}
            />
                </Flex>
              </Flex>
            </Card>
          }
        />

        <PageStart
          cards={[
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
          ]}
          onStart={onStartPage}
        />

        {error && (
          <Typography variant="body2" className={CONTENT_ERROR_CLASS}>
            {t.dashboard.contentLoadError}
          </Typography>
        )}

        <div className={CONTENT_TABLE_WRAP_CLASS}>
          <GridTable
            data={rows}
            loading={loading}
            stickyHeader
            showPagination={false}
            showFilter
            showFilterChips
            emptyContent={
              <Typography variant="body2" className={CONTENT_EMPTY_CLASS}>
                {t.dashboard.listEmpty}
              </Typography>
            }
            onRowClick={(row) => navigate(cmsEditPath(String(row.id)))}
            columns={
              [
                {
                  id: CONTENT_COLUMN_IDS.TITLE,
                  accessor: CONTENT_COLUMN_IDS.TITLE,
                  header: t.dashboard.contentColTitle,
                  sortable: true,
                  filterable: false,
                  render: (value) => <b>{String(value ?? EMPTY_STRING)}</b>,
                },
                {
                  id: CONTENT_COLUMN_IDS.SLUG,
                  accessor: CONTENT_COLUMN_IDS.SLUG,
                  header: t.dashboard.contentColSlug,
                  sortable: true,
                  filterable: false,
                },
                {
                  id: CONTENT_COLUMN_IDS.KIND,
                  accessor: CONTENT_COLUMN_IDS.KIND,
                  header: t.dashboard.contentColKind,
                  filterable: true,
                  filterType: CONTENT_KIND_FILTER_TYPE,
                  filterOptions: kindFilterOptions,
                  defaultFilterOperator: CONTENT_KIND_FILTER_OPERATOR,
                  filterFn: matchesContentKindFilter,
                  render: (_value, row) =>
                    labelTemplateKind(String(row.templateKind), t.dashboard),
                },
                {
                  id: CONTENT_COLUMN_IDS.TEMPLATE,
                  accessor: CONTENT_COLUMN_IDS.TEMPLATE,
                  header: t.dashboard.contentColTemplate,
                  filterable: false,
                  render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
                },
                {
                  id: CONTENT_COLUMN_IDS.CREATED_BY,
                  accessor: CONTENT_COLUMN_IDS.CREATED_BY,
                  header: t.dashboard.contentColCreatedBy,
                  filterable: false,
                  render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
                },
                {
                  id: CONTENT_COLUMN_IDS.FIELDS,
                  accessor: CONTENT_COLUMN_IDS.FIELDS,
                  header: t.dashboard.contentColFields,
                  filterable: false,
                  render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
                },
                {
                  id: CONTENT_COLUMN_IDS.STATUS,
                  accessor: CONTENT_COLUMN_IDS.STATUS,
                  header: t.dashboard.contentColStatus,
                  filterable: false,
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
                  filterable: false,
                },
                {
                  id: CONTENT_COLUMN_IDS.ACTIONS,
                  accessor: CONTENT_ROW_ID_ACCESSOR,
                  header: EMPTY_STRING,
                  sortable: false,
                  filterable: false,
                  render: (_value, row) => (
                    <ContentRowActions
                      id={String(row.id)}
                      status={String(row.status)}
                      openLabel={t.dashboard.contentOpen}
                      moreLabel={t.dashboard.contentMore}
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
                      onOpen={(id) => navigate(cmsEditPath(id))}
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
              ] as ColumnDefinition<ContentTableRow>[]
            }
          />
        </div>
      </Flex>
    </CmsShell>
  );
};
