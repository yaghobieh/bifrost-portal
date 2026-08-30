import type { DragEvent } from 'react';
import { DRAG_FIELD_MIME } from '@const/index';
import { NUMBER_ONE } from '@const/numbers.const';

export const dropIndexFromEvent = (event: DragEvent<HTMLDivElement>): number | null => {
  const raw = event.dataTransfer.getData(DRAG_FIELD_MIME);
  if (!raw) {
    return null;
  }
  const index = Number(raw);
  if (Number.isNaN(index)) {
    return null;
  }
  return index;
};

export const nextDropIndex = (from: number, to: number): number => {
  if (from < to) {
    return to - NUMBER_ONE;
  }
  return to;
};
