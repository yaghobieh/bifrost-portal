import type { RowData } from '@forgedevstack/grid-table';
import type { DocTable } from '@data/docs.types';

export type WidgetGridTableProps = {
  table?: DocTable;
  html?: string;
  editable?: boolean;
  className?: string;
  onTableChange?: (table: DocTable) => void;
};

export type WidgetGridTableRow = RowData & {
  id: string;
};

export type WidgetGridTableThemeMode = 'light' | 'dark';
