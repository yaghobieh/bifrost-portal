import type { FC, ReactNode } from 'react';
import { Button, Flex, Typography } from '@forgedevstack/bear';
import {
  CONTEXT_MENU_DANGER,
  CONTEXT_MENU_REUSE,
  CONTEXT_MENU_STRUCTURE,
  CONTEXT_MENU_STYLE,
  type CanvasContextMenuItem,
} from './CanvasContextMenu.const';
import type { CanvasContextMenuProps } from './CanvasContextMenu.types';
import { canvasMenuVars } from './CanvasContextMenu.utils';

const renderActionIcon = (action: CanvasContextMenuItem['action']): ReactNode => {
  switch (action) {
    case 'edit-content':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <path d="M11 2.5L13.5 5L5 13.5H2.5V11L11 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    case 'inspect-props':
    case 'inspect-style':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'duplicate':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <rect x="5" y="5" width="9" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 11V3.5C3 2.7 3.7 2 4.5 2H11" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'move-up':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <path d="M8 12.5V3.5M8 3.5L4.5 7M8 3.5L11.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'move-down':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <path d="M8 3.5V12.5M8 12.5L4.5 9M8 12.5L11.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'copy-styles':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <path d="M5.3 2C3.5 3 2.3 5 2.3 7.2C2.3 10.5 5 13.2 8.3 13.2C10.5 13.2 12.4 12 13.5 10.3C9.7 10.8 6.5 7.6 6.5 3.8C6.5 3.1 6.7 2.5 7 2C6.4 2 5.8 1.9 5.3 2Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      );
    case 'paste-styles':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <rect x="4" y="3" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'save-reusable':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <path d="M8 2L9.6 6H14L10.5 8.6L12 13L8 10.3L4 13L5.5 8.6L2 6H6.4L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case 'delete':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
          <path d="M3.5 4.5H12.5M6 4.5V3C6 2.4 6.4 2 7 2H9C9.6 2 10 2.4 10 3V4.5M5 4.5V12.5C5 13.1 5.4 13.5 6 13.5H10C10.6 13.5 11 13.1 11 12.5V4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

export const CanvasContextMenu: FC<CanvasContextMenuProps> = (props) => {
  const { title, canPasteStyles, labels, onAction } = props;
  const renderItem = (item: CanvasContextMenuItem) => {
    const disabled = Boolean(item.paste) && !canPasteStyles;
    const variant = item.danger ? 'danger' : 'ghost';
    const itemClass = item.danger
      ? 'bifrost-cms-canvas-menu__item bifrost-cms-canvas-menu__item--danger'
      : 'bifrost-cms-canvas-menu__item';
    const onItem = () => {
      if (disabled) {
        return;
      }
      onAction(item.action);
    };
    return (
      <Button
        key={item.action}
        type="button"
        size="sm"
        variant={variant}
        icon={renderActionIcon(item.action)}
        className={itemClass}
        disabled={disabled}
        onClick={onItem}
      >
        <span className="flex-1 text-left">{labels[item.labelKey]}</span>
        {item.kbdKey && <span className="bifrost-cms-canvas-menu__kbd">{labels[item.kbdKey]}</span>}
      </Button>
    );
  };
  return (
    <Flex
      direction="column"
      className="bifrost-cms-canvas-menu"
      style={canvasMenuVars(props.x, props.y)}
      onClick={(event) => event.stopPropagation()}
    >
      <Typography variant="caption" className="bifrost-cms-canvas-menu__section">
        {title}
      </Typography>
      {CONTEXT_MENU_STRUCTURE.map(renderItem)}
      <div className="bifrost-cms-canvas-menu__divider" />
      {CONTEXT_MENU_STYLE.map(renderItem)}
      <div className="bifrost-cms-canvas-menu__divider" />
      {CONTEXT_MENU_REUSE.map(renderItem)}
      <div className="bifrost-cms-canvas-menu__divider" />
      {CONTEXT_MENU_DANGER.map(renderItem)}
    </Flex>
  );
};
