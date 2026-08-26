import type { DragEvent } from 'react';

export type WidgetPaletteChipProps = {
  label: string;
  previewSrc?: string;
  previewHtml?: string;
  onClick: () => void;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
};
