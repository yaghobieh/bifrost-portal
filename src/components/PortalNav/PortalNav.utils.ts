import { NUMBER_TWO, NUMBER_ZERO } from '@const/numbers.const';
import { EMPTY_STRING } from '@const/strings.const';

export const portalNavInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return EMPTY_STRING;
  }
  return trimmed.slice(NUMBER_ZERO, NUMBER_TWO).toUpperCase();
};
