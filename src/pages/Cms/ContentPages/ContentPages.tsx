import { useEffect, useState, type FC } from 'react';
import { Badge, BearIcons, Button, Card, Flex, Typography } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import { CmsShell, CMS_NAV_IDS } from '../CmsShell';
import { EMPTY_STRING } from '@const/index';
import {
  NUMBER_FOURTEEN,
  NUMBER_SIX,
  NUMBER_TEN,
  NUMBER_TWELVE,
  NUMBER_TWO,
  NUMBER_ZERO,
} from '@const/numbers.const';
import {
  CLOSE_SYMBOL,
  COLLECTION_TAB_ID,
  CONTENT_COLLECTION_DOCS,
  CONTENT_STATUS_DRAFT,
  CONTENT_STATUS_PUBLISHED,
  CONTENT_TABLE_PAGE_SIZE,
  CONTENT_TABLE_PAGE_SIZE_OPTIONS,
  COUNT_TOKEN,
  STATUS_FILTER,
  TEMPLATE_KIND,
  type StatusFilter,
} from './ContentPages.const';
import {
  formatEntriesFound,
  isReviewStatus,
  labelTemplateKind,
  matchesStatusFilter,
  runBulkAction,
} from './ContentPages.utils';
import { filterRowsByTemplate } from './helpers/ContentTemplateCubes';
import { useContentPages } from './hooks';
import type { ContentTableRow } from './ContentPages.types';
import { CreatePageTypeModal } from './helpers/CreatePageTypeModal';
import { loadAllPageTypes, PAGE_TYPES_UPDATED_EVENT } from './pageTypes.utils';
import { PAGE_TYPE_KIND, type PageTypeDefinition } from './pageTypes.types';

export const ContentPages: FC = () => {
  const {
    t,
    saving,
    activeToken,
    error,
    loading,
    rows,
    columns,
    onNewPage,
    onOpenRow,
    onSetStatus,
    onDeletePage,
    onDuplicatePage,
  } = useContentPages();

  const [pageTypes, setPageTypes] = useState<PageTypeDefinition[]>(() => loadAllPageTypes());
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);

  const [templateFilter, setTemplateFilter] = useState(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get('kind') || sp.get('collection') || COLLECTION_TAB_ID.ALL;
    } catch {
      return COLLECTION_TAB_ID.ALL;
    }
  });

  useEffect(() => {
    const handleTypesUpdate = () => {
      setPageTypes(loadAllPageTypes());
    };
    window.addEventListener(PAGE_TYPES_UPDATED_EVENT, handleTypesUpdate);
    return () => window.removeEventListener(PAGE_TYPES_UPDATED_EVENT, handleTypesUpdate);
  }, []);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>(STATUS_FILTER.ALL);
  const [searchQuery, setSearchQuery] = useState(EMPTY_STRING);
  const [selectedRows, setSelectedRows] = useState<ContentTableRow[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  const handleSelectStatusFilter = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setShowFilterPopover(false);
  };

  useEffect(() => {
    const onLocationChange = () => {
      try {
        const sp = new URLSearchParams(window.location.search);
        const k = sp.get('kind') || sp.get('collection');
        if (k) setTemplateFilter(k);
      } catch {
        // noop
      }
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const filteredByTemplate = filterRowsByTemplate(rows, templateFilter);
  const visibleRows = filteredByTemplate.filter((row) => {
    if (!matchesStatusFilter(row.status, statusFilter)) {
      return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = String(row.title || EMPTY_STRING).toLowerCase().includes(q);
    const slugMatch = String(row.slug || EMPTY_STRING).toLowerCase().includes(q);
    const idMatch = String(row.id || EMPTY_STRING).toLowerCase().includes(q);
    const authorMatch = String(row.createdBy || EMPTY_STRING).toLowerCase().includes(q);
    return titleMatch || slugMatch || idMatch || authorMatch;
  });

  const totalCount = rows.length;
  const publishedCount = rows.filter(
    (row) => String(row.status).toLowerCase() === CONTENT_STATUS_PUBLISHED,
  ).length;
  const draftCount = rows.filter(
    (row) => String(row.status).toLowerCase() === CONTENT_STATUS_DRAFT,
  ).length;
  const reviewCount = rows.filter((row) => isReviewStatus(row.status)).length;

  const collectionTabs = [
    {
      id: COLLECTION_TAB_ID.ALL,
      label: t.dashboard.contentTemplateFilterAll,
      count: totalCount,
    },
    {
      id: COLLECTION_TAB_ID.ARTICLES,
      label: labelTemplateKind(TEMPLATE_KIND.ARTICLE, t.dashboard),
      count: rows.filter(
        (row) =>
          row.template === TEMPLATE_KIND.ARTICLE ||
          row.collection === COLLECTION_TAB_ID.ARTICLES ||
          row.templateKind === TEMPLATE_KIND.ARTICLE,
      ).length,
    },
    {
      id: COLLECTION_TAB_ID.PAGES,
      label: labelTemplateKind(TEMPLATE_KIND.PAGE, t.dashboard),
      count: rows.filter(
        (row) =>
          row.template === TEMPLATE_KIND.PAGE ||
          row.collection === COLLECTION_TAB_ID.PAGES ||
          row.templateKind === TEMPLATE_KIND.PAGE,
      ).length,
    },
    {
      id: COLLECTION_TAB_ID.BLOG,
      label: t.cmsShell.blog,
      count: rows.filter(
        (row) =>
          row.collection === COLLECTION_TAB_ID.BLOG ||
          row.templateKind === COLLECTION_TAB_ID.BLOG,
      ).length,
    },
    {
      id: COLLECTION_TAB_ID.DOC,
      label: labelTemplateKind(TEMPLATE_KIND.DOC, t.dashboard),
      count: rows.filter(
        (row) =>
          row.template === TEMPLATE_KIND.DOC ||
          row.collection === CONTENT_COLLECTION_DOCS,
      ).length,
    },
    ...pageTypes
      .filter(
        (pageType) =>
          pageType.kind !== PAGE_TYPE_KIND.SINGLE &&
          pageType.kind !== PAGE_TYPE_KIND.COMPONENT &&
          ![
            COLLECTION_TAB_ID.ARTICLES,
            COLLECTION_TAB_ID.PAGES,
            COLLECTION_TAB_ID.BLOG,
            CONTENT_COLLECTION_DOCS,
          ].includes(pageType.id as (typeof COLLECTION_TAB_ID)[keyof typeof COLLECTION_TAB_ID]),
      )
      .map((pageType) => ({
        id: pageType.id,
        label: pageType.name,
        count: rows.filter(
          (row) => row.collection === pageType.id || row.templateKind === pageType.id,
        ).length,
      })),
  ];

  const handleBulkPublish = async () => {
    if (selectedRows.length === NUMBER_ZERO) return;
    setBulkLoading(true);
    try {
      await runBulkAction(selectedRows, (row) =>
        onSetStatus(String(row.id), CONTENT_STATUS_PUBLISHED),
      );
      setSelectedRows([]);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDraft = async () => {
    if (selectedRows.length === NUMBER_ZERO) return;
    setBulkLoading(true);
    try {
      await runBulkAction(selectedRows, (row) =>
        onSetStatus(String(row.id), CONTENT_STATUS_DRAFT),
      );
      setSelectedRows([]);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedRows.length === NUMBER_ZERO) return;
    setBulkLoading(true);
    try {
      await runBulkAction(selectedRows, (row) =>
        onDuplicatePage(String(row.id)),
      );
      setSelectedRows([]);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === NUMBER_ZERO) return;
    const confirmMessage = t.dashboard.deleteConfirm.replace(
      COUNT_TOKEN,
      String(selectedRows.length),
    );
    if (!window.confirm(confirmMessage)) return;
    setBulkLoading(true);
    try {
      await runBulkAction(selectedRows, (row) =>
        onDeletePage(String(row.id)),
      );
      setSelectedRows([]);
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.PAGES}>
      <Flex direction="column" gap={NUMBER_SIX} className="bifrost-cms-page">
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
          <Flex gap={NUMBER_TWO} align="center">
            <Button
              size="sm"
              variant="outline"
              icon={<BearIcons.PlusIcon size={NUMBER_FOURTEEN} />}
              onClick={() => setShowCreateTypeModal(true)}
              className="border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50 font-semibold shadow-2xs"
            >
              {t.dashboard.newPageType}
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={saving || !activeToken}
              icon={<BearIcons.PlusIcon size={NUMBER_FOURTEEN} />}
              onClick={() => {
                void onNewPage(templateFilter);
              }}
              className="bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold shadow-sm"
            >
              {t.dashboard.createEntry}
            </Button>
          </Flex>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card
            variant="outlined"
            padding="sm"
            className={`cursor-pointer transition-all bg-white border rounded-lg shadow-sm hover:border-gray-300 ${
              statusFilter === STATUS_FILTER.ALL ? 'ring-2 ring-[#1e3a8a]' : 'border-gray-100'
            }`}
            onClick={() => handleSelectStatusFilter(STATUS_FILTER.ALL)}
          >
            <Typography variant="caption" className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
              {t.dashboard.statusAll}
            </Typography>
            <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-0">
              {totalCount}
            </Typography>
          </Card>
          <Card
            variant="outlined"
            padding="sm"
            className={`cursor-pointer transition-all bg-white border rounded-lg shadow-sm hover:border-emerald-300 ${
              statusFilter === STATUS_FILTER.PUBLISHED ? 'ring-2 ring-emerald-500' : 'border-gray-100'
            }`}
            onClick={() => handleSelectStatusFilter(STATUS_FILTER.PUBLISHED)}
          >
            <Typography variant="caption" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-600 font-semibold mb-1">
              <BearIcons.CheckIcon size={NUMBER_TWELVE} /> {t.dashboard.statusPublished}
            </Typography>
            <Typography variant="h3" className="text-xl font-bold text-emerald-700 mb-0">
              {publishedCount}
            </Typography>
          </Card>
          <Card
            variant="outlined"
            padding="sm"
            className={`cursor-pointer transition-all bg-white border rounded-lg shadow-sm hover:border-gray-400 ${
              statusFilter === STATUS_FILTER.DRAFT ? 'ring-2 ring-gray-500' : 'border-gray-100'
            }`}
            onClick={() => handleSelectStatusFilter(STATUS_FILTER.DRAFT)}
          >
            <Typography variant="caption" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
              <BearIcons.EditIcon size={NUMBER_TWELVE} /> {t.dashboard.statusDrafts}
            </Typography>
            <Typography variant="h3" className="text-xl font-bold text-gray-700 mb-0">
              {draftCount}
            </Typography>
          </Card>
          <Card
            variant="outlined"
            padding="sm"
            className={`cursor-pointer transition-all bg-white border rounded-lg shadow-sm hover:border-amber-300 ${
              statusFilter === STATUS_FILTER.REVIEW ? 'ring-2 ring-amber-500' : 'border-gray-100'
            }`}
            onClick={() => handleSelectStatusFilter(STATUS_FILTER.REVIEW)}
          >
            <Typography variant="caption" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-600 font-semibold mb-1">
              <BearIcons.ClockIcon size={NUMBER_TWELVE} /> {t.dashboard.statusInReview}
            </Typography>
            <Typography variant="h3" className="text-xl font-bold text-amber-700 mb-0">
              {reviewCount}
            </Typography>
          </Card>
        </div>

        {Boolean(error) && (
          <Typography variant="body2" className="bifrost-cms-dashboard__error mb-0">
            {t.dashboard.contentLoadError}
          </Typography>
        )}

        {selectedRows.length > NUMBER_ZERO && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-sm animate-fadeIn">
            <Flex gap={NUMBER_TWO} align="center">
              <Badge variant="info" className="bg-[#1e3a8a] text-white font-bold">
                {t.dashboard.selectedCount.replace(COUNT_TOKEN, String(selectedRows.length))}
              </Badge>
              <Typography variant="body2" className="text-sm text-blue-900 font-medium">
                {t.dashboard.bulkApply}
              </Typography>
            </Flex>
            <Flex gap={NUMBER_TWO} align="center" className="flex-wrap">
              <Button
                size="sm"
                variant="outline"
                disabled={bulkLoading}
                onClick={handleBulkPublish}
                className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                icon={<BearIcons.CheckIcon size={NUMBER_TWELVE} />}
              >
                {t.dashboard.bulkPublish}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkLoading}
                onClick={handleBulkDraft}
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
                icon={<BearIcons.EditIcon size={NUMBER_TWELVE} />}
              >
                {t.dashboard.bulkDraft}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkLoading}
                onClick={handleBulkDuplicate}
                className="text-blue-900 border-blue-300 hover:bg-blue-50"
                icon={<BearIcons.CopyIcon size={NUMBER_TWELVE} />}
              >
                {t.dashboard.bulkDuplicate}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkLoading}
                onClick={handleBulkDelete}
                className="text-red-700 border-red-300 hover:bg-red-50"
                icon={<BearIcons.DeleteIcon size={NUMBER_TWELVE} />}
              >
                {t.dashboard.bulkDelete}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedRows([])}
                className="text-gray-500"
              >
                {t.dashboard.bulkDeselect}
              </Button>
            </Flex>
          </div>
        )}

        <div className="bifrost-cms-card bifrost-cms-pages-wrap">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between gap-3 items-stretch md:items-center">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {collectionTabs.map((tab) => {
                const isActive = templateFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTemplateFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {tab.label} <span className="opacity-75">({tab.count})</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowCreateTypeModal(true)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#1e3a8a] border border-dashed border-blue-300 hover:border-[#1e3a8a] hover:bg-blue-50 cursor-pointer whitespace-nowrap transition-all ml-1 shadow-2xs flex items-center gap-1"
                title={t.dashboard.createTypeTitle}
              >
                <BearIcons.PlusIcon size={NUMBER_TEN} />
                <span>{t.dashboard.newType}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilterPopover(!showFilterPopover)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 cursor-pointer ${
                    statusFilter !== STATUS_FILTER.ALL
                      ? 'bg-blue-100 text-blue-900 border-blue-300 font-semibold'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <BearIcons.FilterIcon size={NUMBER_TWELVE} />
                  <span>{t.dashboard.filterLabel}</span>
                  {statusFilter !== STATUS_FILTER.ALL && <span className="w-2 h-2 rounded-full bg-[#1e3a8a]" />}
                </button>

                {showFilterPopover && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                    <Typography variant="caption" className="text-xs uppercase font-bold text-gray-400 px-2 py-1 block">
                      {t.dashboard.filterByStatus}
                    </Typography>
                    <button
                      type="button"
                      onClick={() => handleSelectStatusFilter(STATUS_FILTER.ALL)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-100 flex justify-between ${
                        statusFilter === STATUS_FILTER.ALL ? 'font-bold text-[#1e3a8a]' : 'text-gray-700'
                      }`}
                    >
                      {t.dashboard.statusAll} <span>{totalCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectStatusFilter(STATUS_FILTER.PUBLISHED)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-100 flex justify-between ${
                        statusFilter === STATUS_FILTER.PUBLISHED ? 'font-bold text-emerald-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <BearIcons.CheckIcon size={NUMBER_TWELVE} className="text-emerald-600" />
                        {t.dashboard.statusPublished}
                      </span>
                      <span>{publishedCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectStatusFilter(STATUS_FILTER.DRAFT)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-100 flex justify-between ${
                        statusFilter === STATUS_FILTER.DRAFT ? 'font-bold text-gray-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <BearIcons.EditIcon size={NUMBER_TWELVE} className="text-gray-500" />
                        {t.dashboard.statusDrafts}
                      </span>
                      <span>{draftCount}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectStatusFilter(STATUS_FILTER.REVIEW)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-100 flex justify-between ${
                        statusFilter === STATUS_FILTER.REVIEW ? 'font-bold text-amber-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <BearIcons.ClockIcon size={NUMBER_TWELVE} className="text-amber-600" />
                        {t.dashboard.statusInReview}
                      </span>
                      <span>{reviewCount}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[200px] max-w-sm">
                <input
                  type="text"
                  placeholder={t.dashboard.searchEntries}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white"
                />
                {Boolean(searchQuery) && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery(EMPTY_STRING)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {CLOSE_SYMBOL}
                  </button>
                )}
              </div>
            </div>
          </div>

          <GridTable
            key={`${templateFilter}-${searchQuery}-${statusFilter}`}
            data={visibleRows}
            loading={loading}
            stickyHeader
            showPagination
            enableRowSelection
            enableMultiSelect
            getRowId={(row) => String(row.id)}
            onRowSelect={(selected) => {
              setSelectedRows(selected || []);
            }}
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

      <CreatePageTypeModal
        isOpen={showCreateTypeModal}
        onClose={() => setShowCreateTypeModal(false)}
        onCreated={(newType) => {
          setPageTypes(loadAllPageTypes());
          setTemplateFilter(newType.id);
        }}
      />
    </CmsShell>
  );
};
