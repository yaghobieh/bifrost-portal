import type { DragEvent, ReactNode } from 'react';

export type BuilderWidgetChipProps = {
  label: string;
  icon?: ReactNode;
  draggable?: boolean;
  onClick: () => void;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
};
