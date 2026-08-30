import { NUMBER_ZERO } from '@const/numbers.const';
import type { Messages } from '@i18n/types';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import type { CastFieldType } from '@pages/Cms/CastPages/CastPages.types';
import {
  CAST_FIELD_TYPE_LABEL_KEY,
  CAST_FIELD_TYPE_VALUES,
  CAST_OPTIONS_SEP,
} from './CastPageFields.const';
import type { CastTypeOption } from './CastPageFields.types';

export const castTypeOptions = (castCopy: Messages['cmsCast']): CastTypeOption[] =>
  CAST_FIELD_TYPE_VALUES.map((value) => ({
    value,
    label: castCopy[CAST_FIELD_TYPE_LABEL_KEY[value]],
  }));

/**
 * Prefer wrapping the result in useMemo when the raw options string is stable.
 */
export const parseCastSelectOptions = (raw: string): CastTypeOption[] =>
  raw
    .split(CAST_OPTIONS_SEP)
    .map((part) => part.trim())
    .filter((part) => part.length > NUMBER_ZERO)
    .map((label) => ({ value: label, label }));

export const isCastLongText = (type: CastFieldType): boolean =>
  type === CAST_FIELD_TYPE.TEXTAREA || type === CAST_FIELD_TYPE.RICH;
