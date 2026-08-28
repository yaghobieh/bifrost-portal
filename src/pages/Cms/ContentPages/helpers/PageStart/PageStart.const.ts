export const PAGE_START_IDS = {
  BLANK: 'blank',
  DOC: 'doc',
  MARKETING: 'marketing',
  REUSE: 'reuse',
} as const;

export const PAGE_START_LAYOUT = {
  BLANK: 'blank-canvas',
  DOC: 'documentation',
  MARKETING: 'landing-hero',
} as const;

export const PAGE_START_LAYOUT_BY_ID = {
  [PAGE_START_IDS.BLANK]: PAGE_START_LAYOUT.BLANK,
  [PAGE_START_IDS.DOC]: PAGE_START_LAYOUT.DOC,
  [PAGE_START_IDS.MARKETING]: PAGE_START_LAYOUT.MARKETING,
} as const;

export const PAGE_START_CTA_VARIANT = 'outline';
