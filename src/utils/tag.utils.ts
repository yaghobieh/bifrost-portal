import { SPACE, TAG_SEP } from '@const/strings.const';
import { NUMBER_ZERO } from '@const/numbers.const';

export const splitTags = (raw: string): string[] =>
  raw
    .split(TAG_SEP)
    .map((part) => part.trim())
    .filter((part) => part.length > NUMBER_ZERO);

export const joinTags = (tags: string[]): string => tags.join(`${TAG_SEP}${SPACE}`);

export const tagSelectOptions = (tags: string[]): { value: string; label: string }[] =>
  tags.map((tag) => ({ value: tag, label: tag }));
