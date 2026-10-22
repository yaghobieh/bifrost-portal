import { useEffect, useState, type FC } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { BearIcons, Button, Card, Flex, Typography } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import type { ColumnDefinition } from '@forgedevstack/grid-table';
import { useAuth, useSites } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { cmsBlogEditPath, EMPTY_STRING } from '@const/index';
import { authNucleus, contentNucleus } from '@sdk/index';
import { saveContentRequest } from '@sdk/modules/content';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import {
  DOCUMENT_DEFAULT_LOCALE,
  DOCUMENT_STARTER_STATUS,
  CONTENT_TEMPLATE_EMPTY,
} from '../ContentPages/ContentPages.const';
import { formatContentUpdated, payloadActor } from '../ContentPages/ContentPages.utils';
import {
  PAYLOAD_KEY_AUTHOR,
  PAYLOAD_KEY_CATEGORIES,
  PAYLOAD_KEY_CAST_FIELDS,
  PAYLOAD_KEY_CAST_VALUES,
  PAYLOAD_KEY_CREATED_BY,
  PAYLOAD_KEY_SCHEDULE,
  PAYLOAD_KEY_UPDATED_BY,
} from '../ContentEdit/ContentEdit.const';
import { payloadString } from '../ContentEdit/ContentEdit.utils';
import { loadCmsProfile } from '../SettingsPages';
import {
  BLOG_COLLECTION,
  BLOG_COLUMN,
  BLOG_DATE_LOCALE,
  BLOG_ROW_ID,
  BLOG_SLUG_PREFIX,
} from './BlogPages.const';
import type { BlogTableRow } from './BlogPages.types';
import { blogCastFields } from './BlogPages.utils';
import { ShareContentModal, type ShareContentItem } from '../ContentPages/helpers/ShareContentModal';

export const BlogPages: FC = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, loading, error, saving, fetchContent, deleteContent } = useNucleus(contentNucleus);
  const { sites, activeSiteId } = useSites();
  const activeToken = token || providerToken;
  const actorName = loadCmsProfile().displayName || loadCmsProfile().username;

  const [shareItem, setShareItem] = useState<ShareContentItem | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!activeToken) return;
    void fetchContent(activeToken);
  }, [activeToken, fetchContent]);

  const rows: BlogTableRow[] = items
    .filter((item) => item.collection === BLOG_COLLECTION)
    .map((item) => ({
      id: item.id,
      title: item.title || item.slug,
      author:
        payloadString(item.payload, PAYLOAD_KEY_AUTHOR) ||
        payloadActor(item.payload, PAYLOAD_KEY_CREATED_BY),
      category: payloadString(item.payload, PAYLOAD_KEY_CATEGORIES),
      status: item.status,
      published: formatContentUpdated(
        payloadString(item.payload, PAYLOAD_KEY_SCHEDULE) || item.updatedAt,
        BLOG_DATE_LOCALE,
      ),
    }));

  const handleSharePost = (row: BlogTableRow | Record<string, unknown>) => {
    const id = String(row.id || '');
    const title = String(row.title || id);
    setShareItem({
      id,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      kind: 'post',
      collection: BLOG_COLLECTION,
      currentSiteId: activeSiteId,
    });
    setShowShareModal(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!activeToken) return;
    if (!window.confirm(t.dashboard.deleteConfirm.replace('{count}', '1'))) return;
    await deleteContent(activeToken, id);
    await fetchContent(activeToken);
  };

  const handleShareToSite = async (targetSiteId: string, item: ShareContentItem) => {
    if (!activeToken) return;
    const source = items.find((i) => i.id === item.id);
    if (!source) return;
    await saveContentRequest(activeToken, {
      collection: BLOG_COLLECTION,
      slug: `${source.slug}-${targetSiteId}`,
      locale: source.locale || DOCUMENT_DEFAULT_LOCALE,
      title: `${source.title} (${targetSiteId})`,
      status: source.status || DOCUMENT_STARTER_STATUS,
      payload: {
        ...source.payload,
        siteId: targetSiteId,
        site_id: targetSiteId,
        [PAYLOAD_KEY_CREATED_BY]: actorName,
        [PAYLOAD_KEY_UPDATED_BY]: actorName,
      },
    });
    await fetchContent(activeToken);
  };

  const onNewPost = async () => {
    if (!activeToken) {
      return;
    }
    const fields = blogCastFields();
    const item = await saveContentRequest(activeToken, {
      collection: BLOG_COLLECTION,
      slug: `${BLOG_SLUG_PREFIX}${Date.now()}`,
      locale: DOCUMENT_DEFAULT_LOCALE,
      title: t.dashboard.blogNewPost,
      status: DOCUMENT_STARTER_STATUS,
      payload: {
        [PAYLOAD_KEY_CAST_FIELDS]: fields,
        [PAYLOAD_KEY_CAST_VALUES]: {},
        [PAYLOAD_KEY_AUTHOR]: actorName,
        [PAYLOAD_KEY_CREATED_BY]: actorName,
        [PAYLOAD_KEY_UPDATED_BY]: actorName,
      },
    });
    if (!item) {
      return;
    }
    await fetchContent(activeToken);
    navigate(cmsBlogEditPath(item.id));
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.BLOG}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <CmsPageHeader
          title={t.dashboard.blogTitle}
          subtitle={t.dashboard.blogSubtitle}
          extra={
            <Card variant="elevated" padding="md">
              <Flex justify="between" align="center" gap={3} className="flex-wrap">
                <div>
                  <Typography variant="h4" className="mb-1">
                    {t.dashboard.blogNewPost}
                  </Typography>
                  <Typography variant="body2" className="bifrost-cms__muted mb-0">
                    {t.dashboard.blogSubtitle}
                  </Typography>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={saving || !activeToken}
                  onClick={() => void onNewPost()}
                >
                  {t.dashboard.blogNewPost}
                </Button>
              </Flex>
            </Card>
          }
        />
        {error && (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.dashboard.contentLoadError}
          </Typography>
        )}
        <div className="bifrost-cms-card bifrost-cms-pages-wrap">
          <GridTable
            data={rows}
            loading={loading}
            stickyHeader
            showPagination={false}
            showFilter={false}
            emptyContent={
              <Typography variant="body2" className="bifrost-cms__muted mb-0">
                {t.dashboard.listEmpty}
              </Typography>
            }
            onRowClick={(row) => navigate(cmsBlogEditPath(String(row.id)))}
            onRowDoubleClick={(row) => handleSharePost(row)}
            columns={
              [
                {
                  id: BLOG_COLUMN.TITLE,
                  accessor: BLOG_COLUMN.TITLE,
                  header: t.dashboard.contentColTitle,
                  sortable: true,
                  render: (value) => <b>{String(value ?? EMPTY_STRING)}</b>,
                },
                {
                  id: BLOG_COLUMN.AUTHOR,
                  accessor: BLOG_COLUMN.AUTHOR,
                  header: t.dashboard.blogColAuthor,
                  render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
                },
                {
                  id: BLOG_COLUMN.CATEGORY,
                  accessor: BLOG_COLUMN.CATEGORY,
                  header: t.dashboard.blogColCategory,
                  render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
                },
                {
                  id: BLOG_COLUMN.STATUS,
                  accessor: BLOG_COLUMN.STATUS,
                  header: t.dashboard.contentColStatus,
                },
                {
                  id: BLOG_COLUMN.PUBLISHED,
                  accessor: BLOG_COLUMN.PUBLISHED,
                  header: t.dashboard.blogColPublished,
                  render: (value) => String(value || CONTENT_TEMPLATE_EMPTY),
                },
                {
                  id: BLOG_COLUMN.ACTIONS,
                  accessor: BLOG_ROW_ID,
                  header: EMPTY_STRING,
                  sortable: false,
                  render: (_value, row) => (
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        className="px-2 py-1 text-xs font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded flex items-center gap-1 transition-colors"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(cmsBlogEditPath(String(row.id)));
                        }}
                        title={t.dashboard.contentEdit}
                      >
                        <BearIcons.EditIcon size={12} className="text-gray-500" />
                        <span>{t.dashboard.contentEdit}</span>
                      </button>

                      <button
                        type="button"
                        className="p-1 text-gray-500 hover:text-[#1e3a8a] hover:bg-blue-50 rounded transition-colors"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSharePost(row);
                        }}
                        title="Share post across sites"
                        aria-label="Share post"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleDeletePost(String(row.id));
                        }}
                        title={t.dashboard.contentDelete}
                        aria-label={t.dashboard.contentDelete}
                      >
                        <BearIcons.DeleteIcon size={13} />
                      </button>
                    </div>
                  ),
                },
              ] as ColumnDefinition<BlogTableRow>[]
            }
          />
        </div>
      </Flex>

      <ShareContentModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareItem(null);
        }}
        item={shareItem}
        sites={sites}
        activeSiteId={activeSiteId}
        onShareToSite={handleShareToSite}
      />
    </CmsShell>
  );
};
