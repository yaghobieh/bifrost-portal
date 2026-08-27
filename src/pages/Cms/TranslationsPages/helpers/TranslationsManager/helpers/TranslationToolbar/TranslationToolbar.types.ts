import type { TranslationViewId } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.types';

export type TranslationToolbarProps = {
  locales: string[];
  sourceLocale: string;
  activeLocale: string;
  query: string;
  view: TranslationViewId;
  addLocaleOpen: boolean;
  addLocaleValue: string;
  sourceLabel: string;
  addLocaleLabel: string;
  searchLabel: string;
  importLabel: string;
  exportLabel: string;
  tableLabel: string;
  jsonLabel: string;
  onLocale: (locale: string) => void;
  onQuery: (value: string) => void;
  onView: (view: TranslationViewId) => void;
  onImportFile: (file: File) => void;
  onExport: () => void;
  onToggleAddLocale: () => void;
  onAddLocaleValue: (value: string) => void;
  onAddLocale: () => void;
};
