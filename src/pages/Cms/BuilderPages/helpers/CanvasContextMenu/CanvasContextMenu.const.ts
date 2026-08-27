import type { CanvasMenuAction } from '@pages/Cms/BuilderPages/BuilderPages.types';
import type { CanvasContextMenuLabels } from './CanvasContextMenu.types';

export type CanvasContextMenuItem = {
  action: CanvasMenuAction;
  labelKey: keyof CanvasContextMenuLabels;
  kbdKey?: keyof CanvasContextMenuLabels;
  danger?: boolean;
  paste?: boolean;
};

export const CONTEXT_MENU_STRUCTURE: readonly CanvasContextMenuItem[] = [
  { action: 'edit-content', labelKey: 'edit', kbdKey: 'kbdEdit' },
  { action: 'inspect-props', labelKey: 'props', kbdKey: 'kbdProps' },
  { action: 'inspect-style', labelKey: 'style' },
  { action: 'duplicate', labelKey: 'duplicate', kbdKey: 'kbdDuplicate' },
  { action: 'move-up', labelKey: 'moveUp', kbdKey: 'kbdUp' },
  { action: 'move-down', labelKey: 'moveDown', kbdKey: 'kbdDown' },
];

export const CONTEXT_MENU_STYLE: readonly CanvasContextMenuItem[] = [
  { action: 'copy-styles', labelKey: 'copyStyles', kbdKey: 'kbdCopy' },
  { action: 'paste-styles', labelKey: 'pasteStyles', paste: true },
];

export const CONTEXT_MENU_REUSE: readonly CanvasContextMenuItem[] = [
  { action: 'save-reusable', labelKey: 'saveReusable' },
];

export const CONTEXT_MENU_DANGER: readonly CanvasContextMenuItem[] = [
  { action: 'delete', labelKey: 'remove', kbdKey: 'kbdDelete', danger: true },
];
