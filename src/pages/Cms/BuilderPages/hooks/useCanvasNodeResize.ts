import { useRef, type MouseEvent } from 'react';
import {
  NUMBER_FORTY,
  NUMBER_FOUR,
  NUMBER_THREE_HUNDRED_TWENTY,
  NUMBER_ZERO,
} from '@const/numbers.const';
import { POINTER_EVENT_MOVE, POINTER_EVENT_UP } from '@pages/Cms/CmsShell/CmsShell.const';
import { BUILDER_PX_SUFFIX, EMPTY_NODE_STYLES } from '@pages/Cms/BuilderPages/BuilderPages.const';
import type { CanvasNode, CanvasNodeStyles } from '@pages/Cms/BuilderPages/BuilderPages.types';
import { pointerMoveListener, updateNodeStyles } from '@pages/Cms/BuilderPages/BuilderPages.utils';

type UseCanvasNodeResizeInput = {
  node: CanvasNode;
  tree: CanvasNode[];
  apply: (next: CanvasNode[]) => void;
};

export const useCanvasNodeResize = (input: UseCanvasNodeResizeInput) => {
  const { node, tree, apply } = input;
  const treeRef = useRef(tree);
  treeRef.current = tree;

  const onResizeStart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = event.currentTarget.parentElement?.offsetWidth || NUMBER_ZERO;
    const startHeight = event.currentTarget.parentElement?.offsetHeight || NUMBER_ZERO;
    const minWidth = NUMBER_THREE_HUNDRED_TWENTY / NUMBER_FOUR;
    const onMove = (moveEvent: globalThis.MouseEvent) => {
      const nextWidth = Math.max(minWidth, startWidth + moveEvent.clientX - startX);
      const nextHeight = Math.max(NUMBER_FORTY, startHeight + moveEvent.clientY - startY);
      const styles: CanvasNodeStyles = {
        ...EMPTY_NODE_STYLES,
        ...node.styles,
        width: `${nextWidth}${BUILDER_PX_SUFFIX}`,
        height: `${nextHeight}${BUILDER_PX_SUFFIX}`,
      };
      apply(updateNodeStyles(treeRef.current, node.id, styles));
    };
    pointerMoveListener(onMove, () => undefined, POINTER_EVENT_MOVE, POINTER_EVENT_UP);
  };

  return { onResizeStart };
};
