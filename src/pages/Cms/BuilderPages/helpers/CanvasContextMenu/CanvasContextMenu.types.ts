import type { CanvasMenuAction } from '../../BuilderPages.types';

export type CanvasContextMenuLabels = {
  edit: string;
  duplicate: string;
  moveUp: string;
  moveDown: string;
  copyStyles: string;
  pasteStyles: string;
  saveReusable: string;
  remove: string;
  kbdEdit: string;
  kbdDuplicate: string;
  kbdUp: string;
  kbdDown: string;
  kbdCopy: string;
  kbdDelete: string;
};

export type CanvasContextMenuProps = {
  x: number;
  y: number;
  title: string;
  canPasteStyles: boolean;
  labels: CanvasContextMenuLabels;
  onAction: (action: CanvasMenuAction) => void;
};
