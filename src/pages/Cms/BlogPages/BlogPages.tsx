import { useEffect, type FC } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { Button, Flex, Typography } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import type { ColumnDefinition } from '@forgedevstack/grid-table';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { cmsEditPath, EMPTY_STRING } from '@const/index';
import { authNucleus, contentNucleus } from '@sdk/index';
import { saveContentRequest } from '@sdk/modules/content';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import {
  DOCUMENT_DEFAULT_LOCALE,
  DOCUMENT_STARTER_STATUS,
} from '../ContentPages/ContentPages.const';
import { formatContentUpdated } from '../ContentPages/ContentPages.utils';
import { PAYLOAD_KEY_CAST_FIELDS, PAYLOAD_KEY_CAST_VALUES } from '../ContentEdit/ContentEdit.const';
import {
  BLOG_COLLECTION,
  BLOG_COLUMN,
  BLOG_DATE_LOCALE,
  BLOG_ROW_ID,
  BLOG_SLUG_PREFIX,
  BLOG_TABLE_WRAP_CLASS,
} from './BlogPages.const';
import type { BlogTableRow } from './BlogPages.types';
import { blogCastFields } from './BlogPages.utils';

export const BlogPages: FC = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, loading, error, saving, fetchContent } = useNucleus(contentNucleus);
  const activeToken = token || providerToken;

  useEffect(() => {
    if (!activeToken) return;
    void fetchContent(activeToken);
  }, [activeToken, fetchContent]);

  const rows: BlogTableRow[] = items
    .filter((item) => item.collection === BLOG_COLLECTION)
    .map((item) => ({
      id: item.id,
      title: item.title || item.slug,
      slug: item.slug,
      status: item.status,
      updated: formatContentUpdated(item.updatedAt, BLOG_DATE_LOCALE),
    }));

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
      },
    });
    if (!item) {
      return;
    }
    await fetchContent(activeToken);
    navigate(cmsEditPath(item.id));
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.BLOG}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <CmsPageHeader
          title={t.dashboard.blogTitle}
          subtitle={t.dashboard.blogSubtitle}
          extra={
            <Button size="sm" variant="primary" disabled={saving || !activeToken} onClick={() => void onNewPost()}>
              {t.dashboard.blogNewPost}
            </Button>
          }
        />
        {error && (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.dashboard.contentLoadError}
          </Typography>
        )}
        <div className={BLOG_TABLE_WRAP_CLASS}>
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
            onRowClick={(row) => navigate(cmsEditPath(String(row.id)))}
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
                  id: BLOG_COLUMN.SLUG,
                  accessor: BLOG_COLUMN.SLUG,
                  header: t.dashboard.contentColSlug,
                  sortable: true,
                },
                {
                  id: BLOG_COLUMN.STATUS,
                  accessor: BLOG_COLUMN.STATUS,
                  header: t.dashboard.contentColStatus,
                },
                {
                  id: BLOG_COLUMN.UPDATED,
                  accessor: BLOG_COLUMN.UPDATED,
                  header: t.dashboard.contentColUpdated,
                },
                {
                  id: BLOG_COLUMN.ACTIONS,
                  accessor: BLOG_ROW_ID,
                  header: EMPTY_STRING,
                  sortable: false,
                  render: (_value, row) => (
                    <button
                      type="button"
                      className="bifrost-cms-link"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(cmsEditPath(String(row.id)));
                      }}
                    >
                      {t.dashboard.contentOpen}
                    </button>
                  ),
                },
              ] as ColumnDefinition<BlogTableRow>[]
            }
          />
        </div>
      </Flex>
    </CmsShell>
  );
};
