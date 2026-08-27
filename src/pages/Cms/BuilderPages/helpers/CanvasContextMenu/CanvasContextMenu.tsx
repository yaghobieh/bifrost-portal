import type { FC } from 'react';
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
        className={itemClass}
        disabled={disabled}
        onClick={onItem}
      >
        {labels[item.labelKey]}
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
