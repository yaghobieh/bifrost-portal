import type { DragEvent, MouseEvent, ReactNode } from 'react';
import type { CanvasNode } from '@pages/Cms/BuilderPages/BuilderPages.types';

export type BuilderCanvasNodeProps = {
  node: CanvasNode;
  selectedId: string;
  preview: boolean;
  tree: CanvasNode[];
  duplicateLabel: string;
  deleteLabel: string;
  resizeLabel: string;
  apply: (next: CanvasNode[]) => void;
  setSelectedId: (id: string) => void;
  setDropParentId: (id: string) => void;
  onContextMenu: (event: MouseEvent<HTMLElement>, nodeId: string) => void;
  onDragStartNode: (event: DragEvent<HTMLElement>, nodeId: string) => void;
  acceptDrop: (event: DragEvent<HTMLElement>, parentId?: string, afterId?: string) => void;
  localeBag: Record<string, string>;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onHtmlChange: (id: string, html: string) => void;
  renderChild: (node: CanvasNode) => ReactNode;
};
