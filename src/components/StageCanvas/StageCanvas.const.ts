import type { CanvasKind } from './StageCanvas.types';

export const CANVAS_KIND = {
  SECTION: 'section',
  COLUMN: 'column',
  FLEX: 'flex',
  GRID: 'grid',
  MASONRY: 'masonry',
  INK: 'ink',
  WIDGET: 'widget',
  FORM: 'form',
} as const satisfies Record<string, CanvasKind>;

export const CANVAS_KINDS: readonly CanvasKind[] = [
  CANVAS_KIND.SECTION,
  CANVAS_KIND.COLUMN,
  CANVAS_KIND.FLEX,
  CANVAS_KIND.GRID,
  CANVAS_KIND.MASONRY,
  CANVAS_KIND.INK,
  CANVAS_KIND.WIDGET,
  CANVAS_KIND.FORM,
];

export const CONTAINER_KINDS: readonly CanvasKind[] = [
  CANVAS_KIND.SECTION,
  CANVAS_KIND.COLUMN,
  CANVAS_KIND.FLEX,
  CANVAS_KIND.GRID,
  CANVAS_KIND.MASONRY,
];

export const FLEX_DIRECTION_COLUMN = 'column';
export const FLEX_DIRECTION_ROW = 'row';

export const DIRECTION_BY_KIND: Record<CanvasKind, 'row' | 'column'> = {
  section: FLEX_DIRECTION_COLUMN,
  column: FLEX_DIRECTION_COLUMN,
  flex: FLEX_DIRECTION_ROW,
  grid: FLEX_DIRECTION_ROW,
  masonry: FLEX_DIRECTION_ROW,
  ink: FLEX_DIRECTION_COLUMN,
  widget: FLEX_DIRECTION_COLUMN,
  form: FLEX_DIRECTION_COLUMN,
};

export const WRAP_BY_KIND: Partial<Record<CanvasKind, 'wrap'>> = {
  flex: 'wrap',
  grid: 'wrap',
  masonry: 'wrap',
};

export const STYLE_FIELD_KEYS = [
  'padding',
  'margin',
  'width',
  'height',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'display',
  'flexDirection',
  'gap',
  'alignItems',
  'justifyContent',
  'background',
  'color',
  'border',
  'borderRadius',
  'boxShadow',
  'opacity',
  'zIndex',
] as const;

export const CANVAS_PAYLOAD_KEY = 'canvas';
