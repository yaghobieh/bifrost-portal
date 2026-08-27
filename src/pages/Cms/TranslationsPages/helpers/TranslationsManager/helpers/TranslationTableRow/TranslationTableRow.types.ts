import type { TranslationRow } from '@pages/Cms/TranslationsPages/helpers/TranslationsManager/TranslationsManager.types';

export type TranslationTableRowProps = {
  row: TranslationRow;
  placeholder: string;
  acceptLabel: string;
  rejectLabel: string;
  translateOneLabel: string;
  doneLabel: string;
  missingLabel: string;
  aiLabel: string;
  busy: boolean;
  onTarget: (key: string, value: string) => void;
  onAccept: (key: string) => void;
  onReject: (key: string) => void;
  onTranslateOne: (key: string) => void;
};
