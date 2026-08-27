export type BearPaletteGroupId =
  | 'basic'
  | 'layout'
  | 'form'
  | 'media'
  | 'feedback'
  | 'overlay'
  | 'general';

export type BearPaletteWidget = {
  id: string;
  label: string;
  bearComponent: string;
  group: BearPaletteGroupId;
  html: string;
};
