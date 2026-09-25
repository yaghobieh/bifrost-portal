import { useState, type FC } from 'react';
import { Button, Flex, Select, Typography } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { EMPTY_STRING } from '@const/index';
import {
  CONTENT_CUBE_KIND_ORDER,
  CONTENT_TABLE_PAGE_SIZE,
  CONTENT_TABLE_PAGE_SIZE_OPTIONS,
  CONTENT_TEMPLATE_FILTER_ALL,
  TEMPLATE_KIND,
} from './ContentPages.const';
import { formatEntriesFound, labelTemplateKind } from './ContentPages.utils';
import { isStringValue } from '@utils';
import { filterRowsByTemplate } from './helpers/ContentTemplateCubes';
import { useContentPages } from './hooks';

export const ContentPages: FC = () => {
  const { t, saving, activeToken, error, loading, rows, columns, onNewPage, onOpenRow } =
    useContentPages();
  const [templateFilter, setTemplateFilter] = useState(CONTENT_TEMPLATE_FILTER_ALL);
  const [searchQuery, setSearchQuery] = useState(EMPTY_STRING);

  const filteredByTemplate = filterRowsByTemplate(rows, templateFilter);
  const visibleRows = filteredByTemplate.filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = String(row.title || EMPTY_STRING).toLowerCase().includes(q);
    const slugMatch = String(row.slug || EMPTY_STRING).toLowerCase().includes(q);
    const idMatch = String(row.id || EMPTY_STRING).toLowerCase().includes(q);
    return titleMatch || slugMatch || idMatch;
  });

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
        <div className="bifrost-cms-header-row flex justify-between items-center">
          <div>
            <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-1">
              {t.cmsShell.contentManager}
            </Typography>
            <Typography variant="body2" className="text-sm text-gray-500">
              {formatEntriesFound(t.dashboard.entriesFound, visibleRows.length)}
            </Typography>
          </div>
          <Button
            size="sm"
            variant="primary"
            disabled={saving || !activeToken}
            onClick={() => {
              void onNewPage();
            }}
          >
            {t.dashboard.createEntry}
          </Button>
        </div>

        {Boolean(error) && (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.dashboard.contentLoadError}
          </Typography>
        )}

        <div className="bifrost-cms-card bifrost-cms-pages-wrap">
          <Flex gap={3} align="center" className="p-4 border-b border-gray-200 bg-gray-50 flex-wrap">
            <div style={{ minWidth: 240, flex: 1 }}>
              <input
                type="text"
                placeholder={t.dashboard.searchEntries}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
            <div style={{ minWidth: 200 }}>
              <Select
                value={templateFilter}
                options={kindOptions}
                onChange={(next) => {
                  if (isStringValue(next)) {
                    setTemplateFilter(next);
                  }
                }}
                fullWidth
              />
            </div>
          </Flex>
          <GridTable
            key={`${templateFilter}-${searchQuery}`}
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
              <Typography variant="body2" className="bifrost-cms__muted mb-0 py-8 text-center">
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
