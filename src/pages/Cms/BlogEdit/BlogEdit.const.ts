import { CMS_MODE_LIGHT } from '@const/strings.const';
import { NUMBER_ZERO } from '@const/numbers.const';
import { BLOG_CATEGORIES } from '../BlogPages/BlogPages.const';
import { CONTENT_EDIT_STATUS } from '../ContentEdit/ContentEdit.const';

export const BLOG_EDIT_DEFAULT_STATUS = CONTENT_EDIT_STATUS.DRAFT;
export const BLOG_EDIT_DEFAULT_CATEGORY = BLOG_CATEGORIES[NUMBER_ZERO];
export const BLOG_SEO_COUNT_TOKEN = '{count}';
export const BLOG_SEO_MAX_TOKEN = '{max}';
export const BLOG_EDIT_INK_COLOR_MODE = CMS_MODE_LIGHT;
export const BLOG_EDIT_INK_VARIANT = 'document';
export const BLOG_EDIT_INK_FEATURES = {
  blocks: true,
  slash: true,
  table: true,
  ai: true,
} as const;
