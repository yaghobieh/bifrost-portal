import type { ContentItem } from '@sdk/modules/content';

export type TranslationPickerOption = {
  value: string;
  label: string;
};

export type TranslationApplyParams = {
  key: string;
  source: string;
};

export type ContentTranslationWidgetProps = {
  items: ContentItem[];
  onApply: (params: TranslationApplyParams) => void;
};
