import { useState, type FC } from 'react';
import { Badge, Button, Card, Flex, Select, Typography } from '@forgedevstack/bear';
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

  const totalCount = rows.length;
  const publishedCount = rows.filter((r) => String(r.status) === 'published').length;
  const draftCount = rows.filter((r) => String(r.status) === 'draft').length;

  const collectionTabs = [
    { id: CONTENT_TEMPLATE_FILTER_ALL, label: t.dashboard.contentTemplateFilterAll, count: totalCount },
    {
      id: TEMPLATE_KIND.ARTICLE,
      label: labelTemplateKind(TEMPLATE_KIND.ARTICLE, t.dashboard),
      count: rows.filter((r) => r.template === TEMPLATE_KIND.ARTICLE).length,
    },
    {
      id: TEMPLATE_KIND.PAGE,
      label: labelTemplateKind(TEMPLATE_KIND.PAGE, t.dashboard),
      count: rows.filter((r) => r.template === TEMPLATE_KIND.PAGE).length,
    },
    {
      id: TEMPLATE_KIND.DOC,
      label: labelTemplateKind(TEMPLATE_KIND.DOC, t.dashboard),
      count: rows.filter((r) => r.template === TEMPLATE_KIND.DOC).length,
    },
    {
      id: TEMPLATE_KIND.MARKETING,
      label: labelTemplateKind(TEMPLATE_KIND.MARKETING, t.dashboard),
      count: rows.filter((r) => r.template === TEMPLATE_KIND.MARKETING || r.template === TEMPLATE_KIND.LANDING).length,
    },
  ];

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.PAGES}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <div className="bifrost-cms-header-row flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-0">
                {t.cmsShell.contentManager}
              </Typography>
              <Badge variant="info">
                {formatEntriesFound(t.dashboard.entriesFound, visibleRows.length)}
              </Badge>
            </div>
            <Typography variant="body2" className="text-sm text-gray-500 mt-1">
              {t.dashboard.contentSubtitle}
            </Typography>
          </div>
          <Flex gap={2} align="center">
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
          </Flex>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card variant="outlined" padding="sm" className="bg-white border border-gray-100 rounded-lg shadow-sm">
            <Typography variant="caption" className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Total Entries
            </Typography>
            <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-0">
              {totalCount}
            </Typography>
          </Card>
          <Card variant="outlined" padding="sm" className="bg-white border border-gray-100 rounded-lg shadow-sm">
            <Typography variant="caption" className="text-xs uppercase tracking-wider text-emerald-600 font-semibold mb-1">
              ● Published
            </Typography>
            <Typography variant="h3" className="text-xl font-bold text-emerald-700 mb-0">
              {publishedCount}
            </Typography>
          </Card>
          <Card variant="outlined" padding="sm" className="bg-white border border-gray-100 rounded-lg shadow-sm">
            <Typography variant="caption" className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-1">
              ○ Drafts
            </Typography>
            <Typography variant="h3" className="text-xl font-bold text-amber-700 mb-0">
              {draftCount}
            </Typography>
          </Card>
        </div>

        {Boolean(error) && (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.dashboard.contentLoadError}
          </Typography>
        )}

        <div className="bifrost-cms-card bifrost-cms-pages-wrap">
          {/* Collection tabs & search toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between gap-3 items-stretch md:items-center">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {collectionTabs.map((tab) => {
                const isActive = templateFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTemplateFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {tab.label} <span className="opacity-75">({tab.count})</span>
                  </button>
                );
              })}
            </div>
            <div className="relative min-w-[240px] max-w-sm">
              <input
                type="text"
                placeholder={t.dashboard.searchEntries}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              {Boolean(searchQuery) && (
                <button
                  type="button"
                  onClick={() => setSearchQuery(EMPTY_STRING)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
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
