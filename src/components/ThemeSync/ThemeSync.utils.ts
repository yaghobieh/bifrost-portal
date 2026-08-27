import type { BearThemeOverride, CustomVariant } from '@forgedevstack/bear';
import { CMS_LOGIN_PATH } from '@config/cms.config';
import { SLASH } from '@const/index';
import {
  THEME_BUTTON_TEXT_HEX,
  THEME_VARIANT_BIFROST,
  THEME_VARIANT_INK,
} from './ThemeSync.const';

export const isCmsLoginPath = (pathname: string): boolean =>
  pathname === CMS_LOGIN_PATH || pathname.startsWith(`${CMS_LOGIN_PATH}${SLASH}`);

export const cmsPrimaryVariant = (primary: string): CustomVariant => ({
  bg: primary,
  bgHover: primary,
  text: THEME_BUTTON_TEXT_HEX,
  ring: primary,
  border: primary,
});

export const applyCmsBearPrimary = (
  updateTheme: (overrides: BearThemeOverride) => void,
  addVariant: (name: string, config: CustomVariant) => void,
  primary: string,
): void => {
  updateTheme({ colors: { primary } } as BearThemeOverride);
  const variant = cmsPrimaryVariant(primary);
  addVariant(THEME_VARIANT_BIFROST, variant);
  addVariant(THEME_VARIANT_INK, variant);
};
