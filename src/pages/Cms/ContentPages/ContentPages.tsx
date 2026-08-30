import { useState, type FC } from 'react';
import { Button, Flex, Select, Typography } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import {
  CONTENT_CUBE_KIND_ORDER,
  CONTENT_TABLE_PAGE_SIZE,
  CONTENT_TABLE_PAGE_SIZE_OPTIONS,
  CONTENT_TEMPLATE_FILTER_ALL,
  TEMPLATE_KIND,
} from './ContentPages.const';
import { labelTemplateKind } from './ContentPages.utils';
import { isStringValue } from '@utils';
import { filterRowsByTemplate } from './helpers/ContentTemplateCubes';
import { useContentPages } from './hooks';

export const ContentPages: FC = () => {
  const { t, saving, activeToken, error, loading, rows, columns, onNewPage, onOpenRow } =
    useContentPages();
  const [templateFilter, setTemplateFilter] = useState(CONTENT_TEMPLATE_FILTER_ALL);
  const visibleRows = filterRowsByTemplate(rows, templateFilter);
  const kindOptions = [
    {
      value: CONTENT_TEMPLATE_FILTER_ALL,
      label: t.dashboard.contentTemplateFilterAll,
    },
    ...CONTENT_CUBE_KIND_ORDER.map((kind) => ({
      value: kind,
      label: labelTemplateKind(kind, t.dashboard),
    })),
    {
      value: TEMPLATE_KIND.BLANK,
      label: labelTemplateKind(TEMPLATE_KIND.BLANK, t.dashboard),
    },
  ];

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.PAGES}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <CmsPageHeader
          title={t.dashboard.contentTitle}
          subtitle={t.dashboard.contentSubtitle}
          actionTitle={t.dashboard.templatesTitle}
          actionBody={t.dashboard.templatesSubtitle}
          extra={
            <Button
              size="sm"
              variant="primary"
              disabled={saving || !activeToken}
              onClick={() => {
                void onNewPage();
              }}
            >
              {t.dashboard.newPage}
            </Button>
          }
        />

        {Boolean(error) && (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.dashboard.contentLoadError}
          </Typography>
        )}

        <div className="bifrost-cms-card bifrost-cms-pages-wrap">
          <Select
            label={t.dashboard.contentColKind}
            value={templateFilter}
            options={kindOptions}
            onChange={(next) => {
              if (isStringValue(next)) {
                setTemplateFilter(next);
              }
            }}
            fullWidth
          />
          <GridTable
            key={templateFilter}
            data={visibleRows}
            loading={loading}
            stickyHeader
            showPagination
            paginationConfig={{
              initialPageSize: CONTENT_TABLE_PAGE_SIZE,
              pageSizeOptions: CONTENT_TABLE_PAGE_SIZE_OPTIONS,
            }}
            showFilter={false}
            emptyContent={
              <Typography variant="body2" className="bifrost-cms__muted mb-0">
                {t.dashboard.listEmpty}
              </Typography>
            }
            onRowClick={(row) => {
              onOpenRow(String(row.id));
            }}
            columns={columns}
          />
        </div>
      </Flex>
    </CmsShell>
  );
};
