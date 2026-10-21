import type { ColumnDefinition } from '@forgedevstack/grid-table';
import { EMPTY_STRING } from '@const/strings.const';
import type { DocTable } from '@data/docs.types';
import {
  DOC_TABLE_COL_PREFIX,
  DOC_TABLE_ROW_PREFIX,
  DOC_TABLE_THEME_DARK,
  DOC_TABLE_THEME_LIGHT,
} from './DocSectionTable.const';
import type { DocSectionTableRow, DocSectionTableThemeMode } from './DocSectionTable.types';

export const docTableColumnId = (index: number): string => `${DOC_TABLE_COL_PREFIX}${index}`;

export const docTableRowId = (index: number): string => `${DOC_TABLE_ROW_PREFIX}${index}`;

export const docSectionTableThemeMode = (mode: string): DocSectionTableThemeMode => {
  if (mode === DOC_TABLE_THEME_LIGHT) {
    return DOC_TABLE_THEME_LIGHT;
  }
  return DOC_TABLE_THEME_DARK;
};

export const docSectionTableRows = (table: DocTable): DocSectionTableRow[] =>
  table.rows.map((cells, rowIndex) => {
    const row: DocSectionTableRow = { id: docTableRowId(rowIndex) };
    table.headers.forEach((_header, colIndex) => {
      row[docTableColumnId(colIndex)] = cells[colIndex] ?? EMPTY_STRING;
    });
    return row;
  });

export const docSectionTableColumns = (
  table: DocTable,
): ColumnDefinition<DocSectionTableRow>[] =>
  table.headers.map((header, index) => ({
    id: docTableColumnId(index),
    accessor: docTableColumnId(index),
    header,
    sortable: true,
    filterable: false,
  }));
