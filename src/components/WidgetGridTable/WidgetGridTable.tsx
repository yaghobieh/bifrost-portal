import type { FC } from 'react';
import { useBear } from '@forgedevstack/bear';
import { GridTable } from '@forgedevstack/grid-table';
import { GRID_THEME_VARS } from '@config/bear-theme';
import { EMPTY_STRING } from '@const/strings.const';
import type { WidgetGridTableProps } from './WidgetGridTable.types';
import {
  applyGridTableCellEdit,
  tableFromHtmlOrDefault,
  widgetGridTableColumns,
  widgetGridTableRows,
  widgetGridTableThemeMode,
} from './WidgetGridTable.utils';

export const WidgetGridTable: FC<WidgetGridTableProps> = (props) => {
  const { table, html, editable, className, onTableChange } = props;
  const { mode } = useBear();
  const themeMode = widgetGridTableThemeMode(mode);
  const resolved = table ?? tableFromHtmlOrDefault(html ?? EMPTY_STRING);
  const data = widgetGridTableRows(resolved);
  const columns = widgetGridTableColumns(resolved);

  return (
    <div className={className}>
      <GridTable
        data={data}
        columns={columns}
        stickyHeader
        showPagination={false}
        showFilter={false}
        showGlobalFilter={false}
        showColumnToggle={false}
        enableDragDrop={false}
        enableColumnResize
        enableCellEdit={editable}
        showSortIndicator
        density="comfortable"
        themeMode={themeMode}
        gridThemeVars={GRID_THEME_VARS}
        tableEffects={{ hover: true, sort: true, row: true }}
        getRowId={(row) => String(row.id)}
        onCellEdit={
          editable && onTableChange
            ? (rowId, columnId, value) => {
                onTableChange(
                  applyGridTableCellEdit({
                    table: resolved,
                    rowId: String(rowId),
                    columnId,
                    value,
                  }),
                );
              }
            : undefined
        }
      />
    </div>
  );
};
