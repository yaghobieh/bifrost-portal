import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import { createNamedCastField } from '@pages/Cms/CastPages/CastPages.utils';
import { BLOG_FIELD } from './BlogPages.const';
import type { CastField } from '@pages/Cms/CastPages/CastPages.types';

export const blogCastFields = (): CastField[] => [
  createNamedCastField({
    id: BLOG_FIELD.TITLE,
    name: BLOG_FIELD.TITLE,
    label: BLOG_FIELD.TITLE,
    type: CAST_FIELD_TYPE.TEXT,
  }),
  createNamedCastField({
    id: BLOG_FIELD.EXCERPT,
    name: BLOG_FIELD.EXCERPT,
    label: BLOG_FIELD.EXCERPT,
    type: CAST_FIELD_TYPE.TEXTAREA,
  }),
  createNamedCastField({
    id: BLOG_FIELD.BODY,
    name: BLOG_FIELD.BODY,
    label: BLOG_FIELD.BODY,
    type: CAST_FIELD_TYPE.TEXTAREA,
  }),
  createNamedCastField({
    id: BLOG_FIELD.TAGS,
    name: BLOG_FIELD.TAGS,
    label: BLOG_FIELD.TAGS,
    type: CAST_FIELD_TYPE.TEXT,
  }),
];
