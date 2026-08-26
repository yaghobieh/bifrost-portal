export const MARKETING_BLUE = '#2951C4';
export const MARKETING_WHITE = '#ffffff';
export const MARKETING_INK = '#14161C';
export const MARKETING_MUTED = '#5B5F6A';
export const MARKETING_GRADIENT = MARKETING_BLUE;

export const MARKETING_WIDGET_IDS = {
  HERO: 'mkt-hero',
  SPLIT_AUTH: 'mkt-split-auth',
  FEATURE_GRID: 'mkt-feature-grid',
  CTA_BAND: 'mkt-cta-band',
  FOOTER: 'mkt-footer',
} as const;

export const MARKETING_WIDGET_PREVIEW = {
  HERO: '/cms/widgets/mkt-hero.svg',
  SPLIT_AUTH: '/cms/widgets/mkt-split-auth.svg',
  FEATURE_GRID: '/cms/widgets/mkt-feature-grid.svg',
  CTA_BAND: '/cms/widgets/mkt-cta-band.svg',
  FOOTER: '/cms/widgets/mkt-footer.svg',
} as const;

export type MarketingWidgetId =
  (typeof MARKETING_WIDGET_IDS)[keyof typeof MARKETING_WIDGET_IDS];

export type MarketingWidgetDef = {
  id: MarketingWidgetId;
  label: string;
  html: string;
  previewSrc: string;
};

export const MARKETING_WIDGETS: readonly MarketingWidgetDef[] = [
  {
    id: MARKETING_WIDGET_IDS.HERO,
    label: 'Hero',
    previewSrc: MARKETING_WIDGET_PREVIEW.HERO,
    html: `<section style="padding:4.5rem 1.5rem;background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};text-align:center"><h1 style="margin:0 0 0.75rem;font-size:2.5rem;letter-spacing:-0.03em">Ship the page, not the stack</h1><p style="margin:0 auto 1.5rem;max-width:36rem;opacity:0.92">Hero, proof, and a single call to action — ready for landing and auth screens.</p><a href="#" style="display:inline-block;background:${MARKETING_WHITE};color:${MARKETING_BLUE};padding:0.75rem 1.25rem;border-radius:0.5rem;font-weight:600">Get started</a></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.SPLIT_AUTH,
    label: 'Split auth',
    previewSrc: MARKETING_WIDGET_PREVIEW.SPLIT_AUTH,
    html: `<section style="display:grid;grid-template-columns:1fr 1fr;min-height:22rem"><div style="background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};padding:2.5rem 2rem;display:flex;flex-direction:column;justify-content:center"><h2 style="margin:0 0 0.5rem">Welcome back</h2><p style="margin:0;opacity:0.9">Sign in to edit pages and publish.</p></div><div style="background:${MARKETING_WHITE};color:${MARKETING_INK};padding:2.5rem 2rem;display:flex;flex-direction:column;justify-content:center;gap:0.75rem"><label>Email<input type="email" style="display:block;width:100%;margin-top:0.25rem;padding:0.5rem" /></label><label>Password<input type="password" style="display:block;width:100%;margin-top:0.25rem;padding:0.5rem" /></label><button type="button" style="background:${MARKETING_BLUE};color:${MARKETING_WHITE};border:0;padding:0.65rem 1rem;border-radius:0.4rem;font-weight:600">Sign in</button></div></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.FEATURE_GRID,
    label: 'Feature grid',
    previewSrc: MARKETING_WIDGET_PREVIEW.FEATURE_GRID,
    html: `<section style="padding:3rem 1.5rem;background:${MARKETING_WHITE};color:${MARKETING_INK}"><h2 style="text-align:center;margin:0 0 1.5rem">Built for the site you run</h2><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;max-width:56rem;margin:0 auto"><article style="border:1px solid #E7E7EC;border-radius:0.75rem;padding:1.25rem"><h3 style="margin:0 0 0.4rem">Stage</h3><p style="margin:0;color:${MARKETING_MUTED}">Drop layouts, not raw grids.</p></article><article style="border:1px solid #E7E7EC;border-radius:0.75rem;padding:1.25rem"><h3 style="margin:0 0 0.4rem">Cast</h3><p style="margin:0;color:${MARKETING_MUTED}">Typed fields per page.</p></article><article style="border:1px solid #E7E7EC;border-radius:0.75rem;padding:1.25rem"><h3 style="margin:0 0 0.4rem">Crew</h3><p style="margin:0;color:${MARKETING_MUTED}">Users, roles, and chat.</p></article></div></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.CTA_BAND,
    label: 'CTA band',
    previewSrc: MARKETING_WIDGET_PREVIEW.CTA_BAND,
    html: `<section style="padding:2.5rem 1.5rem;background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap"><div><h2 style="margin:0 0 0.35rem">Start free</h2><p style="margin:0;opacity:0.92">Install Bifrost and publish from your own database.</p></div><a href="#" style="display:inline-block;background:${MARKETING_WHITE};color:${MARKETING_BLUE};padding:0.75rem 1.25rem;border-radius:0.5rem;font-weight:600">Install</a></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.FOOTER,
    label: 'Footer',
    previewSrc: MARKETING_WIDGET_PREVIEW.FOOTER,
    html: `<footer style="padding:2rem 1.5rem;background:${MARKETING_INK};color:${MARKETING_WHITE};display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap"><strong>Bifrost</strong><nav style="display:flex;gap:1.25rem"><a href="#" style="color:${MARKETING_WHITE}">Docs</a><a href="#" style="color:${MARKETING_WHITE}">Plans</a><a href="#" style="color:${MARKETING_WHITE}">GitHub</a></nav></footer>`,
  },
];
