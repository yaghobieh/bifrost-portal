import { EMPTY_STRING } from '@const/strings.const';
import { CANVAS_KINDS, CANVAS_PAYLOAD_KEY, CONTAINER_KINDS, STYLE_FIELD_KEYS } from './StageCanvas.const';
import type {
  CanvasKind,
  CanvasNode,
  CanvasNodeProps,
  CanvasNodeStyles,
  NodeColorStyle,
} from './StageCanvas.types';

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

export const isCanvasKind = (value: unknown): value is CanvasKind => {
  if (typeof value !== 'string') {
    return false;
  }
  return CANVAS_KINDS.some((kind) => kind === value);
};

export const isContainerKind = (kind: CanvasKind): boolean => CONTAINER_KINDS.some((entry) => entry === kind);

const parseStyles = (value: unknown): CanvasNodeStyles | undefined => {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }
  const styles: CanvasNodeStyles = {};
  STYLE_FIELD_KEYS.forEach((key) => {
    const field = record[key];
    if (typeof field === 'string' && field) {
      styles[key] = field;
    }
  });
  return styles;
};

const parseProps = (value: unknown): CanvasNodeProps | undefined => {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }
  const props: CanvasNodeProps = {};
  if (typeof record.text === 'string') {
    props.text = record.text;
  }
  if (typeof record.title === 'string') {
    props.title = record.title;
  }
  return props;
};

export const parseCanvasNode = (value: unknown): CanvasNode | null => {
  const record = asRecord(value);
  if (!record) {
    return null;
  }
  if (typeof record.id !== 'string' || !record.id) {
    return null;
  }
  if (!isCanvasKind(record.kind)) {
    return null;
  }
  const label = typeof record.label === 'string' ? record.label : EMPTY_STRING;
  const childrenRaw = record.children;
  const children = Array.isArray(childrenRaw)
    ? childrenRaw.map(parseCanvasNode).filter((node): node is CanvasNode => Boolean(node))
    : [];
  const node: CanvasNode = {
    id: record.id,
    kind: record.kind,
    label,
    children,
  };
  if (typeof record.widgetId === 'string') {
    node.widgetId = record.widgetId;
  }
  if (typeof record.html === 'string') {
    node.html = record.html;
  }
  if (typeof record.css === 'string') {
    node.css = record.css;
  }
  if (typeof record.js === 'string') {
    node.js = record.js;
  }
  const styles = parseStyles(record.styles);
  if (styles) {
    node.styles = styles;
  }
  const props = parseProps(record.props);
  if (props) {
    node.props = props;
  }
  return node;
};

export const readCanvas = (payload: Record<string, unknown> | null | undefined): CanvasNode[] => {
  if (!payload) {
    return [];
  }
  const canvas = payload[CANVAS_PAYLOAD_KEY];
  if (!Array.isArray(canvas)) {
    return [];
  }
  return canvas.map(parseCanvasNode).filter((node): node is CanvasNode => Boolean(node));
};

export const nodeColorStyle = (styles?: CanvasNodeStyles): NodeColorStyle | undefined => {
  if (!styles) {
    return undefined;
  }
  const background = styles.background;
  const color = styles.color;
  if (!background && !color) {
    return undefined;
  }
  const next: NodeColorStyle = {};
  if (background) {
    next.background = background;
  }
  if (color) {
    next.color = color;
  }
  return next;
};

export const nodeText = (node: CanvasNode): string => {
  const fromProps = node.props?.text || node.props?.title;
  if (fromProps) {
    return fromProps;
  }
  if (isContainerKind(node.kind)) {
    return EMPTY_STRING;
  }
  return node.label;
};
