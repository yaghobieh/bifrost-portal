export type TranslationAddBarProps = {
  keyValue: string;
  sourceValue: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  addLabel: string;
  onKey: (value: string) => void;
  onValue: (value: string) => void;
  onAdd: () => void;
};
