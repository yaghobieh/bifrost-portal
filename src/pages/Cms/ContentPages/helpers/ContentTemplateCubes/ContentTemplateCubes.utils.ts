import { CONTENT_CUBE_KIND_ORDER, CONTENT_TEMPLATE_FILTER_ALL } from '../../ContentPages.const';
import type { ContentTableRow } from '../../ContentPages.types';
import { CONTENT_CUBE_COUNT_TOKEN } from './ContentTemplateCubes.const';
import type {
  BuildTemplateCubesParams,
  ContentTemplateCube,
} from './ContentTemplateCubes.types';

export const cubeKindsFromRows = (rows: ContentTableRow[]): string[] => {
  const present = new Set(rows.map((row) => row.templateKind));
  const ordered = CONTENT_CUBE_KIND_ORDER.filter((kind) => present.has(kind));
  const extras: string[] = [];
  present.forEach((kind) => {
    if (CONTENT_CUBE_KIND_ORDER.some((item) => item === kind)) {
      return;
    }
    extras.push(kind);
  });
  return [...ordered, ...extras];
};

export const countRowsForKind = (rows: ContentTableRow[], kind: string): number =>
  rows.filter((row) => row.templateKind === kind).length;

export const buildTemplateCubes = (params: BuildTemplateCubesParams): ContentTemplateCube[] => {
  const { rows, titleForKind, countLabel } = params;
  const kinds = cubeKindsFromRows(rows);
  const cubes: ContentTemplateCube[] = [];
  for (const kind of kinds) {
    const count = countRowsForKind(rows, kind);
    if (!count) {
      continue;
    }
    cubes.push({
      kind,
      title: titleForKind(kind),
      count,
      countLabel: countLabel.replace(CONTENT_CUBE_COUNT_TOKEN, String(count)),
    });
  }
  return cubes;
};

export const filterRowsByTemplate = (
  rows: ContentTableRow[],
  filter: string,
): ContentTableRow[] => {
  if (filter === CONTENT_TEMPLATE_FILTER_ALL) {
    return rows;
  }
  return rows.filter((row) => row.templateKind === filter);
};
