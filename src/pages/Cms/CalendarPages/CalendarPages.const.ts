import { EMPTY_STRING } from '@const/strings.const';

export const CALENDAR_PAGE_ID = 'bifrost-cms-calendar';
export const CALENDAR_DEFAULT_DURATION_MS = 3600000;
export const CALENDAR_TITLE_INPUT_ID = 'bifrost-cms-calendar-title';
export const CALENDAR_USER_SELECT_ID = 'bifrost-cms-calendar-user';
export const CALENDAR_EMPTY = EMPTY_STRING;
export const CALENDAR_COL_TITLE = 'title';
export const CALENDAR_COL_START = 'start';
export const CALENDAR_COL_PEOPLE = 'people';
export const CALENDAR_VIEW_WEEK = 'week';

export const CALENDAR_THEME_LIGHT = {
  background: 'var(--bear-bg-primary)',
  text: 'var(--bear-text-primary)',
  muted: 'var(--bear-text-secondary)',
  border: 'var(--bear-border-default)',
} as const;

export const CALENDAR_THEME_DARK = {
  background: 'var(--bear-bg-primary)',
  text: 'var(--bear-text-primary)',
  muted: 'var(--bear-text-secondary)',
  border: 'var(--bear-border-default)',
} as const;

export const calendarThemeFrom = (accent: string, mode: 'dark' | 'light') => {
  const surface = mode === 'dark' ? CALENDAR_THEME_DARK : CALENDAR_THEME_LIGHT;
  return {
    primary: accent,
    today: accent,
    event: accent,
    background: surface.background,
    text: surface.text,
    muted: surface.muted,
    border: surface.border,
  };
};
