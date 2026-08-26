import type { FC } from 'react';
import { Button, Flex, Typography, useBear } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import type { ColumnDefinition } from '@forgedevstack/grid-table';
import { useLingo } from '@forgedevstack/lingo';
import { DocShell } from '@components/DocShell';
import { API_ENDPOINTS } from '@const/api.const';
import type { ApiEndpoint } from '@const/api.const';
import {
  EXPLORER_COLLECTION_COL_PX,
  EXPLORER_METHOD_COL_PX,
  EXPLORER_PAGE_SIZE,
  EXPLORER_PAGE_SIZE_MAX,
  EXPLORER_PATH_COL_PX,
  NUMBER_TEN,
} from '@const/numbers.const';
import { GRID_THEME_VARS } from '@config/bear-theme';
import { downloadPostmanCollection } from '@utils/postman.utils';
import { CMS_API_SLUG } from '@const/strings.const';
import { usePublicPage } from '@hooks/usePublicPage';
import { PublicPageCanvas } from '@components/PublicPageCanvas';
import { PageLoader } from '@components/PageLoader';
import { API_EXPLORER_TAB } from './ApiExplorer.const';
import { apiExplorerThemeMode } from './ApiExplorer.utils';

export const ApiExplorer: FC = () => {
  const { t } = useLingo();
  const { mode } = useBear();
  const { item, loading } = usePublicPage(CMS_API_SLUG);
  const themeMode = apiExplorerThemeMode({ mode });
  const columns: ColumnDefinition<ApiEndpoint>[] = [
    {
      id: 'method',
      accessor: 'method',
      header: t('explorer.method'),
      width: EXPLORER_METHOD_COL_PX,
      sortable: true,
      filterable: false,
      render: (value: unknown) => (
        <span className="Bp-method">{String(value)}</span>
      ),
    },
    {
      id: 'path',
      accessor: 'path',
      header: t('explorer.path'),
      width: EXPLORER_PATH_COL_PX,
      sortable: true,
      filterable: false,
    },
    {
      id: 'collection',
      accessor: 'collection',
      header: t('explorer.collection'),
      width: EXPLORER_COLLECTION_COL_PX,
      sortable: true,
      filterable: false,
    },
    {
      id: 'summary',
      accessor: 'summary',
      header: t('explorer.summary'),
      sortable: false,
      filterable: false,
    },
  ];

  if (loading) {
    return <PageLoader />;
  }

  return (
    <DocShell activeTab={API_EXPLORER_TAB}>
      <div className="Bp-explorer">
        <PublicPageCanvas payload={item?.payload} />
        <Flex align="center" justify="between" gap={4} className="Bp-explorer__toolbar">
          <div>
            <Typography variant="h1">{t('explorer.title')}</Typography>
            <Typography variant="body1">{t('explorer.lead')}</Typography>
          </div>
          <Button variant="bifrost" onClick={downloadPostmanCollection}>
            {t('explorer.exportPostman')}
          </Button>
        </Flex>
        <GridTable
          data={API_ENDPOINTS}
          columns={columns}
          stickyHeader
          showPagination
          showGlobalFilter
          showFilter={false}
          showColumnToggle={false}
          showFilterChips={false}
          enableColumnMenu={false}
          enableDragDrop={false}
          enableFind={false}
          enableColumnResize
          showSortIndicator
          density="comfortable"
          themeMode={themeMode}
          gridThemeVars={GRID_THEME_VARS}
          paginationConfig={{
            initialPageSize: EXPLORER_PAGE_SIZE,
            pageSizeOptions: [NUMBER_TEN, EXPLORER_PAGE_SIZE_MAX],
          }}
          tableEffects={{ hover: true, sort: true, row: false }}
          getRowId={(row) => row.id}
        />
      </div>
    </DocShell>
  );
};
