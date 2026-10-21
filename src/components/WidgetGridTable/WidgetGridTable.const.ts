export const GRID_TABLE_WIDGET_ID = 'grid-table';
export const TABLE_WIDGET_ID = 'table';
export const DATA_TABLE_WIDGET_ID = 'data-table';

export const GRID_TABLE_WIDGET_IDS = [
  GRID_TABLE_WIDGET_ID,
  TABLE_WIDGET_ID,
  DATA_TABLE_WIDGET_ID,
] as const;

export const GRID_TABLE_BEAR_GRID_TABLE = 'GridTable';
export const GRID_TABLE_BEAR_TABLE = 'Table';
export const GRID_TABLE_BEAR_DATA_TABLE = 'DataTable';

export const GRID_TABLE_BEAR_COMPONENTS = [
  GRID_TABLE_BEAR_GRID_TABLE,
  GRID_TABLE_BEAR_TABLE,
  GRID_TABLE_BEAR_DATA_TABLE,
] as const;

export const GRID_TABLE_COL_PREFIX = 'c';
export const GRID_TABLE_ROW_PREFIX = 'r';
export const GRID_TABLE_THEME_LIGHT = 'light' as const;
export const GRID_TABLE_THEME_DARK = 'dark' as const;
export const GRID_TABLE_FIELD_PREFIX = 'widget_';
export const GRID_TABLE_FIELD_ID_PREFIX = 'w-';
export const GRID_TABLE_TH_OPEN = '<th>';
export const GRID_TABLE_TH_CLOSE = '</th>';
export const GRID_TABLE_TD_OPEN = '<td>';
export const GRID_TABLE_TD_CLOSE = '</td>';
export const GRID_TABLE_TR_OPEN = '<tr>';
export const GRID_TABLE_TR_CLOSE = '</tr>';
export const DEFAULT_GRID_TABLE_HEADERS = ['Title', 'Status'] as const;
export const DEFAULT_GRID_TABLE_ROWS = [['Installation', 'Published']] as const;
