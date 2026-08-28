import type { FC } from 'react';
import { Button, Card, Dropdown, Flex, Typography } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import { NUMBER_TWO_HUNDRED_TWENTY } from '@const/numbers.const';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { PageStart } from './helpers/PageStart';
import { useContentPages } from './hooks';

export const ContentPages: FC = () => {
  const {
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
  } = useContentPages();

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
                    minWidth={NUMBER_TWO_HUNDRED_TWENTY}
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

        <PageStart cards={startCards} onStart={onStartPage} />

        {Boolean(error) && (
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
            onRowClick={(row) => {
              void onOpenRow(String(row.id));
            }}
            columns={columns}
          />
        </div>
      </Flex>
    </CmsShell>
  );
};
