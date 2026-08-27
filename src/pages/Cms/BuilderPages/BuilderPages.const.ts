import { CMS_BUILDER_CANVAS_KEY, EMPTY_STRING } from '@const/strings.const';
import {
  NUMBER_THREE_HUNDRED_FORTY,
  NUMBER_ZERO,
} from '@const/numbers.const';
import type { CanvasKind, CanvasNode, CanvasNodeStyles } from './BuilderPages.types';

export const BUILDER_CANVAS_KEY = CMS_BUILDER_CANVAS_KEY;

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

export const LAYOUT_BLOCKS: readonly { id: CanvasKind; label: string }[] = [
  { id: CANVAS_KIND.SECTION, label: 'Section' },
  { id: CANVAS_KIND.COLUMN, label: 'Column' },
  { id: CANVAS_KIND.FLEX, label: 'Flex' },
  { id: CANVAS_KIND.GRID, label: 'Grid' },
  { id: CANVAS_KIND.MASONRY, label: 'Masonry' },
  { id: CANVAS_KIND.INK, label: 'Ink' },
  { id: CANVAS_KIND.FORM, label: 'Form' },
];

export const BUILDER_VIEWPORT = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
} as const;

export const BUILDER_VIEWPORT_WIDTH_PX = {
  desktop: 0,
  tablet: 768,
  mobile: 390,
} as const;

export const BUILDER_INSPECTOR_TAB = {
  CONTENT: 'inspector-content',
  STYLE: 'inspector-style',
  CODE: 'inspector-code',
} as const;

export const BUILDER_STAGE_TAB = {
  CANVAS: 'canvas',
} as const;

export const PALETTE_GROUP_ID = {
  LAYOUT: 'layout',
  CONTENT: 'content',
  FORM: 'form',
  CUSTOM: 'custom',
} as const;

export const PALETTE_ACCORDION_DEFAULT = ['basic'] as const;

export const BUILDER_STYLE_EMPTY = EMPTY_STRING;
export const EMPTY_NODE_STYLES: CanvasNodeStyles = {
  padding: EMPTY_STRING,
  margin: EMPTY_STRING,
  width: EMPTY_STRING,
  height: EMPTY_STRING,
  fontSize: EMPTY_STRING,
  fontWeight: EMPTY_STRING,
  lineHeight: EMPTY_STRING,
  letterSpacing: EMPTY_STRING,
  textAlign: EMPTY_STRING,
  border: EMPTY_STRING,
  borderRadius: EMPTY_STRING,
  boxShadow: EMPTY_STRING,
  display: EMPTY_STRING,
  flexDirection: EMPTY_STRING,
  gap: EMPTY_STRING,
  alignItems: EMPTY_STRING,
  justifyContent: EMPTY_STRING,
  opacity: EMPTY_STRING,
  zIndex: EMPTY_STRING,
  background: EMPTY_STRING,
  color: EMPTY_STRING,
};
export const BUILDER_RESIZE_HANDLE = 'se';
export const STYLE_FIELD_KEYS: ReadonlyArray<keyof CanvasNodeStyles> = [
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
];
export const AI_STYLE_SUGGESTIONS = [
  {
    id: 'type-hero',
    styles: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
  },
  {
    id: 'type-body',
    styles: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' },
  },
  {
    id: 'space-block',
    styles: { padding: '1.5rem', margin: '0 0 1rem' },
  },
  {
    id: 'accent-panel',
    styles: {
      background: 'var(--bifrost-cms-accent-soft)',
      color: 'var(--bifrost-cms-ink)',
      padding: '1rem',
      borderRadius: '0.5rem',
    },
  },
  {
    id: 'match-hero',
    styles: {
      background: 'var(--bifrost-cms-ink)',
      color: 'var(--bifrost-cms-paper)',
    },
  },
  {
    id: 'bridge-divider',
    styles: {
      border: '1px solid var(--bifrost-cms-border)',
    },
  },
  {
    id: 'tighten-form',
    styles: {
      width: `${NUMBER_THREE_HUNDRED_FORTY}px`,
    },
  },
] as const;

export const EMPTY_CANVAS_TREE: CanvasNode[] = [];

export const LAYOUT_MIME = 'application/x-ink-layout';
export const BUILDER_DRAG_EFFECT_COPY = 'copy';
export const BUILDER_MENU_ACTION = {
  DUPLICATE: 'duplicate',
  DELETE: 'delete',
  WRAP_FLEX: 'wrap-flex',
  WRAP_GRID: 'wrap-grid',
  ADD_SECTION: 'add-section',
  MOVE_UP: 'move-up',
  MOVE_DOWN: 'move-down',
  EDIT_CONTENT: 'edit-content',
  INSPECT_PROPS: 'inspect-props',
  INSPECT_STYLE: 'inspect-style',
  COPY_STYLES: 'copy-styles',
  PASTE_STYLES: 'paste-styles',
  SAVE_REUSABLE: 'save-reusable',
} as const;
export const BUILDER_MOVE_BACK = -1;
export const BUILDER_MOVE_FORWARD = 1;
export const DEFAULT_INK_HTML = '<p>Write with Ink.</p>';
export const DEFAULT_INK_FALLBACK = '<p></p>';
export const DEFAULT_FORM_HTML =
  '<form class="bifrost-cms-widget-form"><label>Name</label><input type="text" /><label>Email</label><input type="email" /><button type="submit">Send</button></form>';

export const CANVAS_NODE_CLASS = 'bifrost-cms-canvas-node';
export const CANVAS_NODE_SELECTED_CLASS = 'bifrost-cms-canvas-node--selected';
export const CANVAS_NODE_KIND_PREFIX = 'bifrost-cms-canvas-node--';
export const CANVAS_NODE_LABEL_CLASS = 'bifrost-cms-canvas-node__label';
export const CANVAS_NODE_RESIZE_CLASS = 'bifrost-cms-canvas-node__resize';
export const BUILDER_STAGE_PREVIEW_CLASS = 'bifrost-cms-builder__stage--preview';
export const BUILDER_PUBLISH_KEY_SAVE = 'save';
export const BUILDER_PUBLISH_KEY_TEMPLATE = 'template';
export const BUILDER_RADIUS_NONE = '0';
export const BUILDER_RADIUS_MEDIUM = '0.5rem';
export const BUILDER_RADIUS_FULL = '999px';
export const BUILDER_RADIUS_OPTIONS = [
  { id: 'none', value: BUILDER_RADIUS_NONE },
  { id: 'medium', value: BUILDER_RADIUS_MEDIUM },
  { id: 'full', value: BUILDER_RADIUS_FULL },
] as const;
export const BUILDER_BG_SWATCHES = [
  { id: 'paper', value: 'var(--bifrost-cms-paper)' },
  { id: 'ink', value: 'var(--bifrost-cms-ink)' },
  { id: 'canvas', value: 'var(--bifrost-cms-canvas-fill)' },
] as const;
export const BUILDER_ACCENT_HEXES = [
  'var(--bifrost-cms-blue)',
  'var(--bifrost-cms-violet)',
  'var(--bifrost-cms-pink)',
] as const;
export const BUILDER_ACCENT_DISPLAY = ['#2951C4', '#8A3FD4', '#EA0A8E'] as const;
export const BUILDER_GRADIENT_VALUE = 'var(--bifrost-cms-gradient)';
export const BUILDER_FIELD_WIDTH_DEFAULT = String(NUMBER_THREE_HUNDRED_FORTY);
export const BUILDER_IMAGE_FIELD_KEYS = ['src', 'alt', 'width', 'height', 'loading'] as const;
export const BUILDER_IMAGE_ACCEPT = 'image/*';
export const BUILDER_IMAGE_MAX_FILES = 1;
export const BUILDER_CODE_THEME = 'dark' as const;
export const CONTAINER_KINDS: readonly CanvasKind[] = [
  'section',
  'column',
  'flex',
  'grid',
  'masonry',
];
export const BUILDER_PX_SUFFIX = 'px';
export const BUILDER_STAGE_NONE = 'none';
export const BUILDER_STAGE_AUTO = 'auto';
export const BUILDER_ID_PREFIX = 'n-';
export const BUILDER_ID_SLICE_START = 2;
export const BUILDER_ID_SLICE_END = 8;
export const BUILDER_RADIX = 36;
export const BUILDER_CREATE_ID_EMPTY = NUMBER_ZERO;
