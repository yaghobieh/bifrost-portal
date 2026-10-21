export type BlogCategoryChipsProps = {
  ids: readonly string[];
  active: string;
  labelFor: (id: string) => string;
  onSelect: (id: string) => void;
};
