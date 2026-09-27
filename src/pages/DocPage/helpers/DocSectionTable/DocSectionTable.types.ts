import type { RowData } from '@forgedevstack/grid-table';
import type { DocTable } from '@data/docs.types';

export type DocSectionTableProps = {
  table: DocTable;
};

export type DocSectionTableRow = RowData & {
  id: string;
};

export type DocSectionTableThemeMode = 'light' | 'dark';
