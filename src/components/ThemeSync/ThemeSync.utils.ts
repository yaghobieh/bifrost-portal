import type { BearThemeOverride, CustomVariant } from '@forgedevstack/bear';
import {
  THEME_BUTTON_TEXT_HEX,
  THEME_VARIANT_BIFROST,
  THEME_VARIANT_INK,
} from './ThemeSync.const';

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
