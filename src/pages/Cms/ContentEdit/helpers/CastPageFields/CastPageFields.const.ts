import { NUMBER_FOUR, NUMBER_TWO_HUNDRED } from '@const/numbers.const';
import { BRIDGE_BLUE_HEX } from '@const/strings.const';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import type { CastFieldType } from '@pages/Cms/CastPages/CastPages.types';
import type { Messages } from '@i18n/types';

export const CAST_PAGE_VALUE_PREFIX = 'cast-value-';
export const CAST_TYPE_SELECT_ID_PREFIX = 'cms-cast-type-';
export const CAST_OPTIONS_SEP = ',';
export const CAST_TEXTAREA_ROWS = NUMBER_FOUR;
export const CAST_RICH_MIN_HEIGHT_PX = NUMBER_TWO_HUNDRED;

export const CAST_FIELD_TYPE_VALUES = [
  CAST_FIELD_TYPE.TEXT,
  CAST_FIELD_TYPE.TEXTAREA,
  CAST_FIELD_TYPE.NUMBER,
  CAST_FIELD_TYPE.EMAIL,
  CAST_FIELD_TYPE.IMAGE,
  CAST_FIELD_TYPE.RICH,
  CAST_FIELD_TYPE.FILE,
  CAST_FIELD_TYPE.BACKGROUND,
  CAST_FIELD_TYPE.SELECT,
] as const satisfies readonly CastFieldType[];

type CastTypeLabelKey = keyof Pick<
  Messages['cmsCast'],
  | 'typeText'
  | 'typeTextarea'
  | 'typeNumber'
  | 'typeEmail'
  | 'typeImage'
  | 'typeRich'
  | 'typeFile'
  | 'typeBackground'
  | 'typeSelect'
>;

export const CAST_FIELD_TYPE_LABEL_KEY: Record<CastFieldType, CastTypeLabelKey> = {
  [CAST_FIELD_TYPE.TEXT]: 'typeText',
  [CAST_FIELD_TYPE.TEXTAREA]: 'typeTextarea',
  [CAST_FIELD_TYPE.NUMBER]: 'typeNumber',
  [CAST_FIELD_TYPE.EMAIL]: 'typeEmail',
  [CAST_FIELD_TYPE.IMAGE]: 'typeImage',
  [CAST_FIELD_TYPE.RICH]: 'typeRich',
  [CAST_FIELD_TYPE.FILE]: 'typeFile',
  [CAST_FIELD_TYPE.BACKGROUND]: 'typeBackground',
  [CAST_FIELD_TYPE.SELECT]: 'typeSelect',
};

export const CAST_VALUE_INPUT_TYPE = {
  [CAST_FIELD_TYPE.TEXT]: 'text',
  [CAST_FIELD_TYPE.TEXTAREA]: 'text',
  [CAST_FIELD_TYPE.NUMBER]: 'number',
  [CAST_FIELD_TYPE.EMAIL]: 'email',
  [CAST_FIELD_TYPE.IMAGE]: 'url',
  [CAST_FIELD_TYPE.RICH]: 'text',
  [CAST_FIELD_TYPE.FILE]: 'text',
  [CAST_FIELD_TYPE.BACKGROUND]: 'text',
  [CAST_FIELD_TYPE.SELECT]: 'text',
} as const;

export const CAST_VALUE_SUMMARY_JOIN = ' · ';
export const CAST_VALUE_SUMMARY_SEP = ': ';
export const CAST_BACKGROUND_FALLBACK = BRIDGE_BLUE_HEX;
export const CAST_FILE_MAX_FILES = 1;
export const CAST_FILE_UPLOAD_VARIANT = 'dropzone';
