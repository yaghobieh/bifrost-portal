import { GridTable } from '@forgedevstack/grid-table';
import type { RowData } from '@forgedevstack/grid-table';
import type { CmsGridTableProps } from './CmsGridTable.types';

export const CmsGridTable = <T extends RowData>(props: CmsGridTableProps<T>) => {
  const { data, columns, onRowClick, emptyContent, loading, enableCellEdit, onCellEdit, getRowId } = props;
  return (
    <div className="bifrost-cms-grid">
      <GridTable
        data={data}
        columns={columns}
        stickyHeader
        showPagination={false}
        showFilter={false}
        loading={loading}
        emptyContent={emptyContent}
        enableCellEdit={enableCellEdit}
        onCellEdit={onCellEdit}
        getRowId={getRowId}
        onRowClick={onRowClick ? (row) => onRowClick(row) : undefined}
      />
    </div>
  );
};
