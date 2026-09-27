import type { ColumnDefinition } from '@forgedevstack/grid-table';
import {
  BEAR_CLASS_PREFIX,
  DATA_BEAR_WIDGET_ATTR,
  EMPTY_STRING,
  HTML_TAG_DIV,
} from '@const/strings.const';
import type { DocTable } from '@data/docs.types';
import {
  GRID_TABLE_BEAR_COMPONENTS,
  GRID_TABLE_BEAR_GRID_TABLE,
  GRID_TABLE_COL_PREFIX,
  GRID_TABLE_FIELD_ID_PREFIX,
  GRID_TABLE_FIELD_PREFIX,
  GRID_TABLE_ROW_PREFIX,
  GRID_TABLE_TD_CLOSE,
  GRID_TABLE_TD_OPEN,
  GRID_TABLE_TH_CLOSE,
  GRID_TABLE_TH_OPEN,
  GRID_TABLE_THEME_DARK,
  GRID_TABLE_THEME_LIGHT,
  GRID_TABLE_TR_CLOSE,
  GRID_TABLE_TR_OPEN,
  GRID_TABLE_WIDGET_IDS,
  DEFAULT_GRID_TABLE_HEADERS,
  DEFAULT_GRID_TABLE_ROWS,
} from './WidgetGridTable.const';
import type { WidgetGridTableRow, WidgetGridTableThemeMode } from './WidgetGridTable.types';

export const gridTableColumnId = (index: number): string => `${GRID_TABLE_COL_PREFIX}${index}`;

export const gridTableRowId = (index: number): string => `${GRID_TABLE_ROW_PREFIX}${index}`;

export const widgetGridTableThemeMode = (mode: string): WidgetGridTableThemeMode => {
  if (mode === GRID_TABLE_THEME_LIGHT) {
    return GRID_TABLE_THEME_LIGHT;
  }
  return GRID_TABLE_THEME_DARK;
};

export const widgetGridTableRows = (table: DocTable): WidgetGridTableRow[] =>
  table.rows.map((cells, rowIndex) => {
    const row: WidgetGridTableRow = { id: gridTableRowId(rowIndex) };
    table.headers.forEach((_header, colIndex) => {
      row[gridTableColumnId(colIndex)] = cells[colIndex] ?? EMPTY_STRING;
    });
    return row;
  });

export const widgetGridTableColumns = (
  table: DocTable,
): ColumnDefinition<WidgetGridTableRow>[] =>
  table.headers.map((header, index) => ({
    id: gridTableColumnId(index),
    accessor: gridTableColumnId(index),
    header,
    sortable: true,
    filterable: false,
  }));

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const unescapeHtml = (value: string): string =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');

const cellTexts = (root: ParentNode, selector: string): string[] =>
  Array.from(root.querySelectorAll(selector)).map((node) => unescapeHtml(node.textContent ?? EMPTY_STRING));

export const parseTableFromHtml = (html: string): DocTable | null => {
  if (!html || typeof DOMParser === 'undefined') {
    return null;
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const host =
    doc.querySelector(`[${DATA_BEAR_WIDGET_ATTR}]`) ||
    doc.querySelector('table') ||
    doc.body;
  const headerCells = cellTexts(host, 'thead th');
  const headers = headerCells.length ? headerCells : cellTexts(host, 'tr:first-child th');
  const bodyRows = Array.from(host.querySelectorAll('tbody tr'));
  const rowNodes = bodyRows.length ? bodyRows : Array.from(host.querySelectorAll('tr')).slice(headers.length ? 1 : 0);
  const rows = rowNodes.map((row) =>
    Array.from(row.querySelectorAll('td')).map((cell) => unescapeHtml(cell.textContent ?? EMPTY_STRING)),
  );
  if (!headers.length || !rows.length) {
    return null;
  }
  return { headers, rows };
};

export const serializeGridTableHtml = (table: DocTable): string => {
  const head = table.headers
    .map((header) => `${GRID_TABLE_TH_OPEN}${escapeHtml(header)}${GRID_TABLE_TH_CLOSE}`)
    .join(EMPTY_STRING);
  const body = table.rows
    .map((row) => {
      const cells = row
        .map((cell) => `${GRID_TABLE_TD_OPEN}${escapeHtml(cell)}${GRID_TABLE_TD_CLOSE}`)
        .join(EMPTY_STRING);
      return `${GRID_TABLE_TR_OPEN}${cells}${GRID_TABLE_TR_CLOSE}`;
    })
    .join(EMPTY_STRING);
  const inner = `<thead>${GRID_TABLE_TR_OPEN}${head}${GRID_TABLE_TR_CLOSE}</thead><tbody>${body}</tbody>`;
  return `<${HTML_TAG_DIV} ${DATA_BEAR_WIDGET_ATTR}="${GRID_TABLE_BEAR_GRID_TABLE}" class="${BEAR_CLASS_PREFIX}${GRID_TABLE_BEAR_GRID_TABLE}">${inner}</${HTML_TAG_DIV}>`;
};

export const isGridTableHtml = (html: string): boolean =>
  GRID_TABLE_BEAR_COMPONENTS.some(
    (name) => html.includes(`${DATA_BEAR_WIDGET_ATTR}="${name}"`),
  );

export const isGridTableWidgetId = (widgetId: string | undefined): boolean => {
  if (!widgetId) {
    return false;
  }
  return GRID_TABLE_WIDGET_IDS.some((id) => id === widgetId);
};

export const isGridTableField = (
  field: { id: string; name: string },
  value: string,
): boolean => {
  if (isGridTableHtml(value)) {
    return true;
  }
  return GRID_TABLE_WIDGET_IDS.some((id) => {
    if (field.name.startsWith(`${GRID_TABLE_FIELD_PREFIX}${id}_`)) {
      return true;
    }
    return field.id.startsWith(`${GRID_TABLE_FIELD_ID_PREFIX}${id}-`);
  });
};

export const gridTableSectionIdFromFieldName = (name: string): string | null => {
  const match = GRID_TABLE_WIDGET_IDS.find((id) =>
    name.startsWith(`${GRID_TABLE_FIELD_PREFIX}${id}_`),
  );
  if (!match) {
    return null;
  }
  return name.slice(`${GRID_TABLE_FIELD_PREFIX}${match}_`.length);
};

export const applyGridTableCellEdit = (params: {
  table: DocTable;
  rowId: string;
  columnId: string;
  value: unknown;
}): DocTable => {
  const { table, rowId, columnId, value } = params;
  const rowIndex = table.rows.findIndex((_row, index) => gridTableRowId(index) === rowId);
  const colIndex = table.headers.findIndex((_header, index) => gridTableColumnId(index) === columnId);
  if (rowIndex < 0 || colIndex < 0) {
    return table;
  }
  const nextValue = typeof value === 'string' ? value : String(value ?? EMPTY_STRING);
  return {
    headers: table.headers,
    rows: table.rows.map((row, index) => {
      if (index !== rowIndex) {
        return row;
      }
      return row.map((cell, cellIndex) => (cellIndex === colIndex ? nextValue : cell));
    }),
  };
};

export const DEFAULT_GRID_TABLE: DocTable = {
  headers: [...DEFAULT_GRID_TABLE_HEADERS],
  rows: DEFAULT_GRID_TABLE_ROWS.map((row) => [...row]),
};

export const tableFromHtmlOrDefault = (html: string): DocTable =>
  parseTableFromHtml(html) ?? DEFAULT_GRID_TABLE;
