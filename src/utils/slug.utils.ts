import { NUMBER_ONE, NUMBER_ZERO } from '@const/numbers.const';
import { SPACE } from '@const/strings.const';

export const SLUG_PART_SEP = '-';

export const titleFromSlug = (slug: string): string =>
  slug
    .split(SLUG_PART_SEP)
    .filter(Boolean)
    .map((part) => `${part.slice(NUMBER_ZERO, NUMBER_ONE).toUpperCase()}${part.slice(NUMBER_ONE)}`)
    .join(SPACE);
