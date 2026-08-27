export type TranslationJsonPanelProps = {
  value: string;
  suggestedKeys: string[];
  fillLabel: string;
  busy: boolean;
  onChange: (value: string) => void;
  onFill: () => void;
};
