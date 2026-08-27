import type { CanvasMenuAction } from '@pages/Cms/BuilderPages/BuilderPages.types';

export type CanvasContextMenuLabels = {
  edit: string;
  props: string;
  style: string;
  duplicate: string;
  moveUp: string;
  moveDown: string;
  copyStyles: string;
  pasteStyles: string;
  saveReusable: string;
  remove: string;
  kbdEdit: string;
  kbdProps: string;
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
