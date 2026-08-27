import { NUMBER_EIGHT, NUMBER_ONE, NUMBER_ZERO } from '@const/numbers.const';
import { ATTR_DATA_I18N, EMPTY_STRING } from '@const/strings.const';
import { BEAR_WIDGET_CATALOG } from '../ContentEdit/ContentEdit.const';
import { loadCustomWidgets } from './customWidgets.utils';
import { MARKETING_WIDGETS } from './MarketingBlocks.const';
import { BEAR_PALETTE } from './BearPalette.const';
import {
  BUILDER_CANVAS_KEY,
  BUILDER_ID_PREFIX,
  BUILDER_ID_SLICE_END,
  BUILDER_ID_SLICE_START,
  BUILDER_PX_SUFFIX,
  BUILDER_RADIX,
  BUILDER_STAGE_AUTO,
  BUILDER_STAGE_NONE,
  BUILDER_VIEWPORT,
  BUILDER_VIEWPORT_WIDTH_PX,
  CANVAS_KIND,
  CANVAS_NODE_CLASS,
  CANVAS_NODE_KIND_PREFIX,
  CANVAS_NODE_SELECTED_CLASS,
  CONTAINER_KINDS,
  DEFAULT_FORM_HTML,
  DEFAULT_INK_HTML,
  EMPTY_CANVAS_TREE,
  LAYOUT_BLOCKS,
} from './BuilderPages.const';
import type {
  BuilderLayerRow,
  BuilderViewport,
  CanvasKind,
  CanvasNode,
  CanvasNodeStyles,
  PageCode,
} from './BuilderPages.types';

const createId = (): string =>
  `${BUILDER_ID_PREFIX}${Date.now()}-${Math.random()
    .toString(BUILDER_RADIX)
    .slice(BUILDER_ID_SLICE_START, BUILDER_ID_SLICE_END)}`;

const cloneNode = (node: CanvasNode): CanvasNode => ({
  ...node,
  id: createId(),
  children: node.children.map(cloneNode),
});

export const cloneCanvasTree = (nodes: CanvasNode[]): CanvasNode[] => nodes.map(cloneNode);

export const createLayoutNode = (kind: CanvasKind, label: string): CanvasNode => {
  let html: string | undefined;
  if (kind === CANVAS_KIND.INK) {
    html = DEFAULT_INK_HTML;
  } else if (kind === CANVAS_KIND.FORM) {
    html = DEFAULT_FORM_HTML;
  }
  return {
    id: createId(),
    kind,
    label,
    html,
    children: [],
  };
};

export const createWidgetNode = (widgetId: string): CanvasNode | null => {
  const widget =
    BEAR_PALETTE.find((entry) => entry.id === widgetId) ||
    BEAR_WIDGET_CATALOG.find((entry) => entry.id === widgetId) ||
    MARKETING_WIDGETS.find((entry) => entry.id === widgetId) ||
    loadCustomWidgets().find((entry) => entry.id === widgetId);
  if (!widget) {
    return null;
  }
  return {
    id: createId(),
    kind: CANVAS_KIND.WIDGET,
    label: widget.label,
    widgetId: widget.id,
    html: widget.html,
    children: [],
  };
};

const mapTree = (
  nodes: CanvasNode[],
  matcher: (node: CanvasNode) => boolean,
  update: (node: CanvasNode, siblings: CanvasNode[], index: number) => CanvasNode[] | null,
): CanvasNode[] => {
  const next: CanvasNode[] = [];
  nodes.forEach((node, index) => {
    if (matcher(node)) {
      const replaced = update(node, nodes, index);
      if (replaced) {
        next.push(...replaced);
      }
      return;
    }
    next.push({ ...node, children: mapTree(node.children, matcher, update) });
  });
  return next;
};

export const insertNode = (nodes: CanvasNode[], node: CanvasNode, parentId?: string): CanvasNode[] => {
  if (!parentId) {
    return [...nodes, node];
  }
  return mapTree(nodes, (current) => current.id === parentId, (current) => [
    { ...current, children: [...current.children, node] },
  ]);
};

export const removeNode = (nodes: CanvasNode[], nodeId: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, () => []);

export const duplicateNode = (nodes: CanvasNode[], nodeId: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, (current) => [current, cloneNode(current)]);

export const wrapNode = (nodes: CanvasNode[], nodeId: string, kind: CanvasKind, label: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, (current) => [
    {
      id: createId(),
      kind,
      label,
      children: [current],
    },
  ]);

export const moveNode = (nodes: CanvasNode[], nodeId: string, direction: -1 | 1): CanvasNode[] => {
  const index = nodes.findIndex((node) => node.id === nodeId);
  if (index >= NUMBER_ZERO) {
    const target = index + direction;
    if (target < NUMBER_ZERO || target >= nodes.length) {
      return nodes;
    }
    const next = [...nodes];
    const [item] = next.splice(index, NUMBER_ONE);
    next.splice(target, NUMBER_ZERO, item);
    return next;
  }
  return nodes.map((node) => ({ ...node, children: moveNode(node.children, nodeId, direction) }));
};

export const updateNodeHtml = (nodes: CanvasNode[], nodeId: string, html: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, (current) => [{ ...current, html }]);

export const findNode = (nodes: CanvasNode[], nodeId: string): CanvasNode | null => {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    const nested = findNode(node.children, nodeId);
    if (nested) {
      return nested;
    }
  }
  return null;
};

export const isContainerKind = (kind: CanvasKind): boolean => CONTAINER_KINDS.includes(kind);

export const nodeContainsId = (node: CanvasNode, nodeId: string): boolean => {
  if (node.id === nodeId) {
    return true;
  }
  return node.children.some((child) => nodeContainsId(child, nodeId));
};

export const relocateNode = (nodes: CanvasNode[], nodeId: string, parentId?: string): CanvasNode[] => {
  if (parentId === nodeId) {
    return nodes;
  }
  const node = findNode(nodes, nodeId);
  if (!node) {
    return nodes;
  }
  if (parentId) {
    const parent = findNode(nodes, parentId);
    if (!parent) {
      return nodes;
    }
    if (nodeContainsId(node, parentId)) {
      return nodes;
    }
  }
  const stripped = removeNode(nodes, nodeId);
  return insertNode(stripped, node, parentId);
};

export const updateNodeLabel = (nodes: CanvasNode[], nodeId: string, label: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, (current) => [{ ...current, label }]);

export const updateNodeStyles = (
  nodes: CanvasNode[],
  nodeId: string,
  styles: CanvasNodeStyles,
): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, (current) => [{ ...current, styles }]);

export const updateNodeCss = (nodes: CanvasNode[], nodeId: string, css: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, (current) => [{ ...current, css }]);

export const updateNodeJs = (nodes: CanvasNode[], nodeId: string, js: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === nodeId, (current) => [{ ...current, js }]);

export const createColumnsSection = (columnCount: number): CanvasNode => {
  const columns: CanvasNode[] = Array.from({ length: columnCount }, () =>
    createLayoutNode(CANVAS_KIND.COLUMN, layoutBlockLabel(CANVAS_KIND.COLUMN)),
  );
  return {
    id: createId(),
    kind: CANVAS_KIND.SECTION,
    label: layoutBlockLabel(CANVAS_KIND.SECTION),
    children: columns,
  };
};

export const flattenLayers = (
  nodes: CanvasNode[],
  depth = NUMBER_ZERO,
): BuilderLayerRow[] =>
  nodes.flatMap((node) => [
    { id: node.id, label: node.label, kind: node.kind, depth },
    ...flattenLayers(node.children, depth + NUMBER_ONE),
  ]);

export const nodeStyleObject = (styles?: CanvasNodeStyles): Record<string, string> => {
  if (!styles) {
    return {};
  }
  const next: Record<string, string> = {};
  (Object.keys(styles) as Array<keyof CanvasNodeStyles>).forEach((key) => {
    const value = styles[key];
    if (value) {
      next[key] = value;
    }
  });
  return next;
};

export const loadBuilderTree = (): CanvasNode[] => {
  try {
    const raw = localStorage.getItem(BUILDER_CANVAS_KEY);
    if (!raw) {
      return EMPTY_CANVAS_TREE;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed as CanvasNode[];
    }
    if (typeof parsed === 'string' && parsed.trim()) {
      return [
        {
          id: createId(),
          kind: CANVAS_KIND.WIDGET,
          label: 'Legacy',
          html: parsed,
          children: [],
        },
      ];
    }
    return EMPTY_CANVAS_TREE;
  } catch {
    return EMPTY_CANVAS_TREE;
  }
};

export const saveBuilderTree = (nodes: CanvasNode[]): void => {
  localStorage.setItem(BUILDER_CANVAS_KEY, JSON.stringify(nodes));
};

const isCanvasNode = (value: unknown): value is CanvasNode => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const node = value as CanvasNode;
  return typeof node.id === 'string' && typeof node.kind === 'string' && Array.isArray(node.children);
};

export const canvasFromPayload = (payload: Record<string, unknown> | undefined): CanvasNode[] | null => {
  if (!payload) {
    return null;
  }
  const canvas = payload.canvas;
  if (!Array.isArray(canvas)) {
    return null;
  }
  if (!canvas.every(isCanvasNode)) {
    return null;
  }
  return canvas;
};

export const withCanvasPayload = (
  payload: Record<string, unknown>,
  tree: CanvasNode[],
  code?: PageCode,
): Record<string, unknown> => ({
  ...payload,
  canvas: tree,
  code: code ?? payload.code,
});

export const emptyPageCode = (): PageCode => ({
  css: EMPTY_STRING,
  js: EMPTY_STRING,
  scripts: [],
});

export const codeFromPayload = (payload: Record<string, unknown> | undefined): PageCode => {
  if (!payload) {
    return emptyPageCode();
  }
  const code = payload.code;
  if (!code || typeof code !== 'object') {
    return emptyPageCode();
  }
  const record = code as Record<string, unknown>;
  const css = typeof record.css === 'string' ? record.css : EMPTY_STRING;
  const js = typeof record.js === 'string' ? record.js : EMPTY_STRING;
  const scripts = Array.isArray(record.scripts)
    ? record.scripts.filter((item): item is string => typeof item === 'string')
    : [];
  return { css, js, scripts };
};

const ensureNode = (value: unknown): CanvasNode | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const record = value as Record<string, unknown>;
  const kind = typeof record.kind === 'string' ? record.kind : CANVAS_KIND.WIDGET;
  const label = typeof record.label === 'string' ? record.label : kind;
  const childrenRaw = Array.isArray(record.children) ? record.children : [];
  const children = childrenRaw.map(ensureNode).filter((node): node is CanvasNode => Boolean(node));
  return {
    id: typeof record.id === 'string' ? record.id : createId(),
    kind: kind as CanvasKind,
    label,
    widgetId: typeof record.widgetId === 'string' ? record.widgetId : undefined,
    html: typeof record.html === 'string' ? record.html : undefined,
    css: typeof record.css === 'string' ? record.css : undefined,
    js: typeof record.js === 'string' ? record.js : undefined,
    children,
  };
};

export const parseMarketingAiPage = (
  raw: string,
): { nodes: CanvasNode[]; code: PageCode } | null => {
  try {
    const trimmed = raw.trim().replace(/^```(?:json)?/i, EMPTY_STRING).replace(/```$/i, EMPTY_STRING);
    const parsed: unknown = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const nodesRaw = Array.isArray(record.nodes) ? record.nodes : [];
    const nodes = nodesRaw.map(ensureNode).filter((node): node is CanvasNode => Boolean(node));
    if (nodes.length === NUMBER_ZERO) {
      return null;
    }
    const css = typeof record.css === 'string' ? record.css : EMPTY_STRING;
    const js = typeof record.js === 'string' ? record.js : EMPTY_STRING;
    const scripts = Array.isArray(record.scripts)
      ? record.scripts.filter((item): item is string => typeof item === 'string')
      : [];
    return { nodes: cloneCanvasTree(nodes), code: { css, js, scripts } };
  } catch {
    return null;
  }
};

export const layoutBlockLabel = (kind: CanvasKind): string =>
  LAYOUT_BLOCKS.find((block) => block.id === kind)?.label ?? EMPTY_STRING;

export const stageViewportModifier = (viewport: BuilderViewport): string => {
  if (viewport === BUILDER_VIEWPORT.TABLET) {
    return ' bifrost-cms-builder__stage--tablet';
  }
  if (viewport === BUILDER_VIEWPORT.MOBILE) {
    return ' bifrost-cms-builder__stage--mobile';
  }
  return EMPTY_STRING;
};

export const stageShellVars = (input: {
  viewport: BuilderViewport;
  previewWidth: number;
}): Record<string, string> => {
  const { viewport, previewWidth } = input;
  if (previewWidth) {
    const width = `${previewWidth}${BUILDER_PX_SUFFIX}`;
    return {
      '--bifrost-cms-stage-max': width,
      '--bifrost-cms-stage-w': width,
    };
  }
  if (viewport === BUILDER_VIEWPORT.DESKTOP) {
    return {
      '--bifrost-cms-stage-max': BUILDER_STAGE_NONE,
      '--bifrost-cms-stage-w': BUILDER_STAGE_AUTO,
    };
  }
  return {
    '--bifrost-cms-stage-max': `${BUILDER_VIEWPORT_WIDTH_PX[viewport]}${BUILDER_PX_SUFFIX}`,
    '--bifrost-cms-stage-w': BUILDER_STAGE_AUTO,
  };
};

export const builderLayoutVars = (input: {
  paletteWidth: number;
  inspectorWidth: number;
}): Record<string, string> => ({
  '--bifrost-cms-palette-w': `${input.paletteWidth}${BUILDER_PX_SUFFIX}`,
  '--bifrost-cms-inspector-w': `${input.inspectorWidth}${BUILDER_PX_SUFFIX}`,
});

export const applyHtmlTranslation = (html: string, bag: Record<string, string>): string => {
  const keyMatch = html.match(new RegExp(`${ATTR_DATA_I18N}="([^"]+)"`));
  if (!keyMatch) {
    return html;
  }
  const next = bag[keyMatch[1]];
  if (!next) {
    return html;
  }
  return html.replace(/>([^<]*)</, `>${next}<`);
};

export const canvasNodeClassName = (kind: CanvasKind, selected: boolean): string => {
  const selectedClass = selected ? ` ${CANVAS_NODE_SELECTED_CLASS}` : EMPTY_STRING;
  return `${CANVAS_NODE_CLASS} ${CANVAS_NODE_KIND_PREFIX}${kind}${selectedClass}`;
};

export const insertNodeAfter = (nodes: CanvasNode[], node: CanvasNode, afterId: string): CanvasNode[] =>
  mapTree(nodes, (current) => current.id === afterId, (current) => [current, node]);

export const relocateNodeAfter = (nodes: CanvasNode[], nodeId: string, afterId: string): CanvasNode[] => {
  if (nodeId === afterId) {
    return nodes;
  }
  const node = findNode(nodes, nodeId);
  if (!node) {
    return nodes;
  }
  if (nodeContainsId(node, afterId)) {
    return nodes;
  }
  const stripped = removeNode(nodes, nodeId);
  return insertNodeAfter(stripped, node, afterId);
};

export const layerDepth = (depth: number): number => Math.min(depth, NUMBER_EIGHT);

export const pointerMoveListener = (
  onMove: (event: MouseEvent) => void,
  onUp: () => void,
  moveEvent: keyof WindowEventMap,
  upEvent: keyof WindowEventMap,
): void => {
  const handleMove = (event: Event) => {
    onMove(event as MouseEvent);
  };
  const handleUp = () => {
    window.removeEventListener(moveEvent, handleMove);
    window.removeEventListener(upEvent, handleUp);
    onUp();
  };
  window.addEventListener(moveEvent, handleMove);
  window.addEventListener(upEvent, handleUp);
};
