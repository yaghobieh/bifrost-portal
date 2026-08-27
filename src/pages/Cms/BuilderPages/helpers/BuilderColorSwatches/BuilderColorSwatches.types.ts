export type BuilderColorSwatch = {
  id: string;
  value: string;
  label: string;
};

export type BuilderColorSwatchesProps = {
  colors: readonly BuilderColorSwatch[];
  selected: string;
  onPick: (value: string) => void;
};
