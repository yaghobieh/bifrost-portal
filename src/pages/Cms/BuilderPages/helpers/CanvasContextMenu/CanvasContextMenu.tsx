import type { FC } from 'react';
import { Flex, Typography } from '@forgedevstack/bear';
import { BUILDER_MENU_ACTION } from '../../BuilderPages.const';
import type { CanvasContextMenuProps } from './CanvasContextMenu.types';

export const CanvasContextMenu: FC<CanvasContextMenuProps> = (props) => {
  const { title, canPasteStyles, labels, onAction } = props;
  return (
    <Flex
      direction="column"
      className="bifrost-cms-canvas-menu"
      style={{ left: props.x, top: props.y }}
      onClick={(event) => event.stopPropagation()}
    >
      <Typography variant="caption" className="bifrost-cms-canvas-menu__section mb-0">
        {title}
      </Typography>
      <button type="button" className="bifrost-cms-canvas-menu__item" onClick={() => onAction(BUILDER_MENU_ACTION.EDIT_CONTENT)}>
        {labels.edit}
        <span className="bifrost-cms-canvas-menu__kbd">{labels.kbdEdit}</span>
      </button>
      <button type="button" className="bifrost-cms-canvas-menu__item" onClick={() => onAction(BUILDER_MENU_ACTION.DUPLICATE)}>
        {labels.duplicate}
        <span className="bifrost-cms-canvas-menu__kbd">{labels.kbdDuplicate}</span>
      </button>
      <button type="button" className="bifrost-cms-canvas-menu__item" onClick={() => onAction(BUILDER_MENU_ACTION.MOVE_UP)}>
        {labels.moveUp}
        <span className="bifrost-cms-canvas-menu__kbd">{labels.kbdUp}</span>
      </button>
      <button type="button" className="bifrost-cms-canvas-menu__item" onClick={() => onAction(BUILDER_MENU_ACTION.MOVE_DOWN)}>
        {labels.moveDown}
        <span className="bifrost-cms-canvas-menu__kbd">{labels.kbdDown}</span>
      </button>
      <div className="bifrost-cms-canvas-menu__divider" />
      <button type="button" className="bifrost-cms-canvas-menu__item" onClick={() => onAction(BUILDER_MENU_ACTION.COPY_STYLES)}>
        {labels.copyStyles}
        <span className="bifrost-cms-canvas-menu__kbd">{labels.kbdCopy}</span>
      </button>
      <button
        type="button"
        className="bifrost-cms-canvas-menu__item"
        disabled={!canPasteStyles}
        onClick={() => onAction(BUILDER_MENU_ACTION.PASTE_STYLES)}
      >
        {labels.pasteStyles}
      </button>
      <div className="bifrost-cms-canvas-menu__divider" />
      <button type="button" className="bifrost-cms-canvas-menu__item" onClick={() => onAction(BUILDER_MENU_ACTION.SAVE_REUSABLE)}>
        {labels.saveReusable}
      </button>
      <div className="bifrost-cms-canvas-menu__divider" />
      <button
        type="button"
        className="bifrost-cms-canvas-menu__item bifrost-cms-canvas-menu__item--danger"
        onClick={() => onAction(BUILDER_MENU_ACTION.DELETE)}
      >
        {labels.remove}
        <span className="bifrost-cms-canvas-menu__kbd">{labels.kbdDelete}</span>
      </button>
    </Flex>
  );
};
