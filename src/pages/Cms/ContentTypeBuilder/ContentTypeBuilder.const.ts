import {
  NUMBER_ZERO,
  NUMBER_ONE,
  NUMBER_TWO,
  NUMBER_THREE,
  NUMBER_FOUR,
  NUMBER_FIVE,
  NUMBER_SIX,
  NUMBER_EIGHT,
  NUMBER_TEN,
  NUMBER_TWELVE,
  NUMBER_FOURTEEN,
  NUMBER_SIXTEEN,
  NUMBER_EIGHTEEN,
  NUMBER_TWENTY,
  NUMBER_TWENTY_FOUR,
  NUMBER_THIRTY_TWO,
} from '@const/numbers.const';
import { EMPTY_STRING, PINK_HEX, PINK_SOFT_HEX } from '@const/index';
import type { PageTypeKind } from '../ContentPages/pageTypes.types';
import type { AttributeTypeOption } from './ContentTypeBuilder.types';

export const CONTENT_TYPE_KINDS = {
  COLLECTION: 'collection' as PageTypeKind,
  SINGLE: 'single' as PageTypeKind,
  COMPONENT: 'component' as PageTypeKind,
};

export const BUILDER_ICON_SIZE_SM = NUMBER_FOURTEEN;
export const BUILDER_ICON_SIZE_MD = NUMBER_SIXTEEN;
export const BUILDER_ICON_SIZE_LG = NUMBER_TWENTY;
export const BUILDER_ICON_SIZE_XL = NUMBER_TWENTY_FOUR;

export const BUILDER_STORAGE_KEY_ACTIVE_TYPE = 'cms_ctb_active_type';
export const BUILDER_STORAGE_KEY_ACTIVE_KIND = 'cms_ctb_active_kind';

export const BUILDER_DEFAULT_KIND = CONTENT_TYPE_KINDS.COLLECTION;
export const BUILDER_SUCCESS_TIMEOUT_MS = 2500;

export const BUILDER_EMPTY_STRING = EMPTY_STRING;
export const BUILDER_DEFAULT_AUTHOR = 'Editor';

export const ATTRIBUTE_TYPE_OPTIONS: AttributeTypeOption[] = [
  {
    type: 'text',
    labelKey: 'fieldString',
    descKey: 'fieldStringDesc',
    iconName: 'FileText',
    color: '#3B82F6',
  },
  {
    type: 'rich-text',
    labelKey: 'fieldRichText',
    descKey: 'fieldRichTextDesc',
    iconName: 'Edit',
    color: '#8B5CF6',
  },
  {
    type: 'number',
    labelKey: 'fieldNumber',
    descKey: 'fieldNumberDesc',
    iconName: 'Hash',
    color: '#10B981',
  },
  {
    type: 'boolean',
    labelKey: 'fieldBoolean',
    descKey: 'fieldBooleanDesc',
    iconName: 'Check',
    color: '#F59E0B',
  },
  {
    type: 'date',
    labelKey: 'fieldDate',
    descKey: 'fieldDateDesc',
    iconName: 'Calendar',
    color: '#EC4899',
  },
  {
    type: 'media',
    labelKey: 'fieldMedia',
    descKey: 'fieldMediaDesc',
    iconName: 'Image',
    color: '#06B6D4',
  },
  {
    type: 'relation',
    labelKey: 'fieldRelation',
    descKey: 'fieldRelationDesc',
    iconName: 'Link',
    color: '#6366F1',
  },
  {
    type: 'json',
    labelKey: 'fieldJson',
    descKey: 'fieldJsonDesc',
    iconName: 'Code',
    color: '#64748B',
  },
  {
    type: 'component',
    labelKey: 'fieldComponent',
    descKey: 'fieldComponentDesc',
    iconName: 'Layers',
    color: '#EA0A8E',
  },
];

export const BUILDER_COLORS = {
  PINK: PINK_HEX,
  PINK_SOFT: PINK_SOFT_HEX,
  PRIMARY_BLUE: '#3B82F6',
  SUCCESS_GREEN: '#10B981',
  WARNING_ORANGE: '#F59E0B',
  NEUTRAL_BORDER: '#E2E8F0',
  NEUTRAL_DARK_BORDER: '#334155',
  NEUTRAL_BG_HOVER: '#F8FAFC',
};
