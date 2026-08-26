export type CanvasKind =
  | 'section'
  | 'column'
  | 'flex'
  | 'grid'
  | 'masonry'
  | 'ink'
  | 'widget'
  | 'form';

export type CanvasNodeStyles = {
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  display?: string;
  flexDirection?: string;
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  opacity?: string;
  zIndex?: string;
  background?: string;
  color?: string;
};

export type CanvasNodeProps = {
  text?: string;
  title?: string;
};

export type CanvasNode = {
  id: string;
  kind: CanvasKind;
  label: string;
  widgetId?: string;
  html?: string;
  css?: string;
  js?: string;
  styles?: CanvasNodeStyles;
  children: CanvasNode[];
  props?: CanvasNodeProps;
};

export type StageCanvasProps = {
  nodes: CanvasNode[];
  cloudName?: string;
};

export type NodeColorStyle = {
  background?: string;
  color?: string;
};
