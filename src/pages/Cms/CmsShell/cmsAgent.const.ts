export const AGENT_TEMPLATE_IDS = {
  LANDING: 'landing-hero',
  DOCS: 'docs-article',
  BLANK: 'blank-canvas',
} as const;

export const AGENT_SUGGESTION_IDS = [
  AGENT_TEMPLATE_IDS.LANDING,
  AGENT_TEMPLATE_IDS.DOCS,
  AGENT_TEMPLATE_IDS.BLANK,
] as const;

export const AGENT_DOCK_ALIGN_START = 'start' as const;
export const AGENT_DOCK_ALIGN_END = 'end' as const;
export const AGENT_PANEL_CLASS = 'bifrost-cms__agent-panel';
export const AGENT_AVATAR_INITIALS = 'AI';
export const BOTTOM_NAV_SHOW_LABELS = 'always' as const;
export const USER_MENU_MIN_WIDTH = 220;
