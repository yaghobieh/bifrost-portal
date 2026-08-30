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

export const parseCastSelectOptions = (raw: string): CastTypeOption[] =>
  raw
    .split(CAST_OPTIONS_SEP)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((label) => ({ value: label, label }));

export const isCastLongText = (type: CastFieldType): boolean => {
  if (type === CAST_FIELD_TYPE.TEXTAREA) {
    return true;
  }
  if (type === CAST_FIELD_TYPE.RICH) {
    return true;
  }
  return false;
};
