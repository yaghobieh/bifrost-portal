import type { BearThemeOverride, CustomVariantsMap } from '@forgedevstack/bear';
import type { CSSProperties } from 'react';
import {
  PINK_HEX,
  PINK_HOVER_HEX,
  PINK_SOFT_HEX,
} from '@const/strings.const';

export const BIFROST_NAVY = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#1E3A8A',
  600: '#172554',
  700: '#0F172A',
  800: '#0B1120',
  900: '#020617',
  950: '#01040D',
} as const;

export const BIFROST_PINK = BIFROST_NAVY;

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
    primary: BIFROST_NAVY,
    secondary: BIFROST_NEUTRAL,
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
    bg: '#1E3A8A',
    bgHover: '#172554',
    text: '#ffffff',
    ring: '#38BDF8',
  },
  bifrostGhost: {
    bg: '#EFF6FF',
    bgHover: 'rgba(30, 58, 138, 0.16)',
    text: '#1E3A8A',
    border: 'rgba(30, 58, 138, 0.28)',
  },
  ink: {
    bg: '#1E3A8A',
    bgHover: '#172554',
    text: '#ffffff',
    ring: '#38BDF8',
  },
  inkOutline: {
    bg: 'transparent',
    bgHover: '#EFF6FF',
    text: '#1E3A8A',
    border: '#1E3A8A',
  },
};

export const GRID_THEME_VARS: CSSProperties = {
  '--gt-accent-primary': '#1E3A8A',
  '--gt-accent-rgb': '30, 58, 138',
  '--gt-border-color': '#E7E7EC',
  '--gt-bg-primary': '#FFFFFF',
  '--gt-bg-secondary': '#FAFAFB',
  '--gt-bg-tertiary': '#F5F6F8',
  '--gt-bg-hover': '#EFF6FF',
  '--gt-text-primary': '#161618',
  '--gt-text-secondary': '#5B5F6A',
  '--gt-text-muted': '#93969F',
} as CSSProperties;

export { bifrostTheme as default };
