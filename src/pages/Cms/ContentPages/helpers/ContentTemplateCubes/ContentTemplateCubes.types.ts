import type { ContentTableRow } from '../../ContentPages.types';

export type ContentTemplateCube = {
  kind: string;
  title: string;
  count: number;
  countLabel: string;
};

export type ContentTemplateCubesProps = {
  cubes: ContentTemplateCube[];
  onSelect: (kind: string) => void;
};

export type BuildTemplateCubesParams = {
  rows: ContentTableRow[];
  titleForKind: (kind: string) => string;
  countLabel: string;
};
