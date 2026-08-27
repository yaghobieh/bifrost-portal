import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import { NUMBER_THREE_HUNDRED_TWENTY } from '@const/numbers.const';
import { POINTER_EVENT_MOVE, POINTER_EVENT_UP } from '@pages/Cms/CmsShell/CmsShell.const';
import { pointerMoveListener } from '@pages/Cms/BuilderPages/BuilderPages.utils';

type UseStagePreviewResizeInput = {
  previewWidth: number;
  setPreviewWidth: Dispatch<SetStateAction<number>>;
};

export const useStagePreviewResize = (input: UseStagePreviewResizeInput) => {
  const { previewWidth, setPreviewWidth } = input;
  const onPreviewResizeStart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth =
      previewWidth || event.currentTarget.parentElement?.clientWidth || NUMBER_THREE_HUNDRED_TWENTY;
    const onMove = (moveEvent: globalThis.MouseEvent) => {
      setPreviewWidth(Math.max(NUMBER_THREE_HUNDRED_TWENTY, startWidth + moveEvent.clientX - startX));
    };
    pointerMoveListener(onMove, () => undefined, POINTER_EVENT_MOVE, POINTER_EVENT_UP);
  };
  return { onPreviewResizeStart };
};
