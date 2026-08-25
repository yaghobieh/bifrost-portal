import type { BearThemeOverride, CustomVariantsMap } from '@forgedevstack/bear';
import type { CSSProperties } from 'react';
import {
  PINK_HEX,
  PINK_HOVER_HEX,
  PINK_SOFT_HEX,
} from '@const/strings.const';

export const BIFROST_PINK = {
  50: '#FDE9F5',
  100: '#F9C8E6',
  200: '#F49BD4',
  300: '#EE6CC4',
  400: '#F03AAB',
  500: PINK_HEX,
  600: PINK_HOVER_HEX,
  700: '#8C0A63',
  800: '#6B0850',
  900: '#4A0638',
  950: '#2A0320',
} as const;

export const BIFROST_NEUTRAL = {
  50: '#FAFAFB',
  100: '#F5F6F8',
  200: '#E7E7EC',
  300: '#D3D5DC',
  400: '#93969F',
  500: '#5B5F6A',
  600: '#3D414B',
  700: '#161618',
  800: '#14161C',
  900: '#0E1014',
  950: '#08090C',
} as const;

export const bifrostTheme: BearThemeOverride = {
  colors: {
    primary: BIFROST_PINK,
    secondary: BIFROST_NEUTRAL,
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAFB',
      tertiary: '#F5F6F8',
    },
    text: {
      primary: '#161618',
      secondary: '#5B5F6A',
      muted: '#93969F',
      inverted: '#FFFFFF',
    },
    border: {
      default: '#E7E7EC',
      subtle: '#F0F1F4',
      strong: '#D3D5DC',
    },
  },
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.625rem',
    xl: '0.875rem',
    '2xl': '1.25rem',
  },
};

export const bifrostVariants: CustomVariantsMap = {
  bifrost: {
    bg: PINK_HEX,
    bgHover: PINK_HOVER_HEX,
    text: '#ffffff',
    ring: '#F03AAB',
  },
  bifrostGhost: {
    bg: PINK_SOFT_HEX,
    bgHover: 'rgba(234, 10, 142, 0.16)',
    text: PINK_HEX,
    border: 'rgba(234, 10, 142, 0.28)',
  },
};

export const GRID_THEME_VARS: CSSProperties = {
  '--gt-accent-primary': PINK_HEX,
  '--gt-accent-rgb': '234, 10, 142',
  '--gt-border-color': '#E7E7EC',
  '--gt-bg-primary': '#FFFFFF',
  '--gt-bg-secondary': '#FAFAFB',
  '--gt-bg-tertiary': '#F5F6F8',
  '--gt-bg-hover': PINK_SOFT_HEX,
  '--gt-text-primary': '#161618',
  '--gt-text-secondary': '#5B5F6A',
  '--gt-text-muted': '#93969F',
} as CSSProperties;

export { bifrostTheme as default };
