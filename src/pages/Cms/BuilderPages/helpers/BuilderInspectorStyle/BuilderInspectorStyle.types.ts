import type { CanvasNodeStyles } from '@pages/Cms/BuilderPages/BuilderPages.types';

export type BuilderInspectorStyleProps = {
  selectedStyles: CanvasNodeStyles;
  backgroundLabel: string;
  paletteLabel: string;
  gradientLabel: string;
  radiusLabel: string;
  radiusNone: string;
  radiusMedium: string;
  radiusFull: string;
  fieldWidthLabel: string;
  fieldWidthHint: string;
  suggestionsLabel: string;
  suggestionLabels: Record<string, string>;
  swatchLabels: Record<string, string>;
  styleFieldLabels: Record<string, string>;
  onBackground: (value: string) => void;
  onRadius: (value: string) => void;
  onWidth: (value: string) => void;
  onStyleField: (key: keyof CanvasNodeStyles, value: string) => void;
  onHint: (id: string) => void;
};
