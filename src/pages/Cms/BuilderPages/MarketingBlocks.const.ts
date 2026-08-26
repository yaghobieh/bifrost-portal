export const MARKETING_BLUE = '#2951C4';
export const MARKETING_VIOLET = '#8A3FD4';
export const MARKETING_PINK = '#EA0A8E';
export const MARKETING_WHITE = '#ffffff';
export const MARKETING_INK = '#14161C';
export const MARKETING_MUTED = '#5B5F6A';
export const MARKETING_CANVAS = '#F5F6FA';
export const MARKETING_GRADIENT = `linear-gradient(90deg,${MARKETING_BLUE},${MARKETING_VIOLET},${MARKETING_PINK})`;

export const MARKETING_WIDGET_IDS = {
  HERO: 'mkt-hero',
  HERO_SPLIT: 'mkt-hero-split',
  HERO_MINIMAL: 'mkt-hero-minimal',
  SPLIT_AUTH: 'mkt-split-auth',
  CREDENTIALS: 'mkt-credentials',
  OAUTH_ROW: 'mkt-oauth-row',
  TESTIMONIAL: 'mkt-testimonial',
  FEATURE_GRID: 'mkt-feature-grid',
  BRIDGE: 'mkt-bridge',
  CODE: 'mkt-code',
  STAT_STRIP: 'mkt-stat-strip',
  CTA_BAND: 'mkt-cta-band',
  GRADIENT_BUTTON: 'mkt-gradient-button',
  FOOTER: 'mkt-footer',
} as const;

export const MARKETING_WIDGET_GROUP = {
  HERO: 'hero',
  AUTH: 'auth',
  CONTENT: 'content',
  CONVERSION: 'conversion',
  FOOTER: 'footer',
} as const;

export type MarketingWidgetId =
  (typeof MARKETING_WIDGET_IDS)[keyof typeof MARKETING_WIDGET_IDS];

export type MarketingWidgetGroupId =
  (typeof MARKETING_WIDGET_GROUP)[keyof typeof MARKETING_WIDGET_GROUP];

export type MarketingWidgetDef = {
  id: MarketingWidgetId;
  group: MarketingWidgetGroupId;
  label: string;
  html: string;
};

export const MARKETING_WIDGET_GROUPS: readonly MarketingWidgetGroupId[] = [
  MARKETING_WIDGET_GROUP.HERO,
  MARKETING_WIDGET_GROUP.AUTH,
  MARKETING_WIDGET_GROUP.CONTENT,
  MARKETING_WIDGET_GROUP.CONVERSION,
  MARKETING_WIDGET_GROUP.FOOTER,
];

export const MARKETING_WIDGETS: readonly MarketingWidgetDef[] = [
  {
    id: MARKETING_WIDGET_IDS.HERO,
    group: MARKETING_WIDGET_GROUP.HERO,
    label: 'Centered hero',
    html: `<section style="padding:4.5rem 1.5rem;background:${MARKETING_INK};color:${MARKETING_WHITE};text-align:center"><p style="letter-spacing:.08em;text-transform:uppercase;color:${MARKETING_PINK};font-size:.75rem">One content model. Every surface.</p><h1 style="margin:.75rem auto 1rem;max-width:36rem;font-size:2.4rem">Content that reaches every surface</h1><p style="margin:0 auto 1.5rem;max-width:32rem;opacity:.8">Hero, proof, and a single call to action.</p><a href="#" style="display:inline-block;background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};padding:.75rem 1.25rem;border-radius:.5rem;font-weight:600">Start free</a></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.HERO_SPLIT,
    group: MARKETING_WIDGET_GROUP.HERO,
    label: 'Split hero',
    html: `<section style="display:grid;grid-template-columns:1fr 1fr;min-height:22rem"><div style="background:${MARKETING_INK};color:${MARKETING_WHITE};padding:2.5rem 2rem;display:flex;flex-direction:column;justify-content:center;gap:.5rem"><div style="display:flex;gap:4px"><span style="width:8px;height:8px;background:${MARKETING_BLUE}"></span><span style="width:8px;height:8px;background:${MARKETING_VIOLET}"></span><span style="width:8px;height:8px;background:${MARKETING_PINK}"></span></div><h2 style="margin:0">Bifrost</h2></div><div style="background:${MARKETING_WHITE};padding:2.5rem 2rem;display:flex;flex-direction:column;justify-content:center;gap:.75rem"><div style="height:2rem;background:${MARKETING_CANVAS};border-radius:.4rem"></div><div style="height:2rem;background:${MARKETING_CANVAS};border-radius:.4rem"></div><div style="height:2.2rem;border-radius:.4rem;background:${MARKETING_GRADIENT}"></div></div></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.HERO_MINIMAL,
    group: MARKETING_WIDGET_GROUP.HERO,
    label: 'Minimal hero',
    html: `<section style="padding:3.5rem 1.5rem;text-align:center;background:${MARKETING_WHITE};color:${MARKETING_INK}"><h1 style="margin:0 0 .75rem;font-size:2rem">Ship the page, not the stack</h1><p style="margin:0 auto;max-width:28rem;color:${MARKETING_MUTED}">A quiet hero for docs and product pages.</p></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.SPLIT_AUTH,
    group: MARKETING_WIDGET_GROUP.AUTH,
    label: 'Split auth',
    html: `<section style="display:grid;grid-template-columns:1fr 1fr;min-height:22rem"><div style="background:${MARKETING_INK};color:${MARKETING_WHITE};padding:2.5rem 2rem;display:flex;flex-direction:column;justify-content:center"><h2 style="margin:0 0 0.5rem">Welcome back</h2><p style="margin:0;opacity:0.9">Sign in to edit pages and publish.</p></div><div style="background:${MARKETING_WHITE};color:${MARKETING_INK};padding:2.5rem 2rem;display:flex;flex-direction:column;justify-content:center;gap:0.75rem"><label>Email<input type="email" style="display:block;width:100%;margin-top:0.25rem;padding:0.5rem" /></label><label>Password<input type="password" style="display:block;width:100%;margin-top:0.25rem;padding:0.5rem" /></label><button type="button" style="background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};border:0;padding:0.65rem 1rem;border-radius:0.4rem;font-weight:600">Sign in</button></div></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.CREDENTIALS,
    group: MARKETING_WIDGET_GROUP.AUTH,
    label: 'Credentials form',
    html: `<section style="padding:2rem;background:${MARKETING_WHITE};max-width:22rem;margin:0 auto"><h2 style="margin:0 0 1rem">Sign in</h2><label style="display:block;margin-bottom:.75rem">Email<input type="email" style="display:block;width:100%;margin-top:.25rem;padding:.5rem" /></label><label style="display:block;margin-bottom:1rem">Password<input type="password" style="display:block;width:100%;margin-top:.25rem;padding:.5rem" /></label><button type="button" style="width:100%;background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};border:0;padding:.7rem;border-radius:.4rem;font-weight:600">Continue</button></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.OAUTH_ROW,
    group: MARKETING_WIDGET_GROUP.AUTH,
    label: 'OAuth row',
    html: `<section style="display:flex;gap:.75rem;padding:1.25rem;background:${MARKETING_WHITE}"><button type="button" style="flex:1;padding:.7rem;border:1px solid #E4E6EE;border-radius:.4rem;background:${MARKETING_WHITE}">Google</button><button type="button" style="flex:1;padding:.7rem;border:1px solid #E4E6EE;border-radius:.4rem;background:${MARKETING_WHITE}">GitHub</button></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.TESTIMONIAL,
    group: MARKETING_WIDGET_GROUP.AUTH,
    label: 'Testimonial quote',
    html: `<section style="padding:2rem;background:${MARKETING_CANVAS};color:${MARKETING_INK}"><blockquote style="margin:0;font-size:1.15rem">“One model. Website, app, docs.”</blockquote><p style="margin:.75rem 0 0;color:${MARKETING_MUTED}">Captain, Bifrost</p></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.FEATURE_GRID,
    group: MARKETING_WIDGET_GROUP.CONTENT,
    label: 'Feature grid',
    html: `<section style="padding:3rem 1.5rem;background:${MARKETING_WHITE};color:${MARKETING_INK}"><h2 style="text-align:center;margin:0 0 1.5rem">Built for the site you run</h2><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem;max-width:56rem;margin:0 auto"><article style="border:1px solid #E7E7EC;border-radius:0.75rem;padding:1.25rem"><h3 style="margin:0 0 0.4rem">Marketing</h3><p style="margin:0;color:${MARKETING_MUTED}">Whole patterns, not raw grids.</p></article><article style="border:1px solid #E7E7EC;border-radius:0.75rem;padding:1.25rem"><h3 style="margin:0 0 0.4rem">Cast</h3><p style="margin:0;color:${MARKETING_MUTED}">Typed fields per page.</p></article><article style="border:1px solid #E7E7EC;border-radius:0.75rem;padding:1.25rem"><h3 style="margin:0 0 0.4rem">Crew</h3><p style="margin:0;color:${MARKETING_MUTED}">Users, roles, and chat.</p></article><article style="border:1px solid #E7E7EC;border-radius:0.75rem;padding:1.25rem"><h3 style="margin:0 0 0.4rem">Live</h3><p style="margin:0;color:${MARKETING_MUTED}">Presence on every page.</p></article></div></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.BRIDGE,
    group: MARKETING_WIDGET_GROUP.CONTENT,
    label: 'Bridge diagram',
    html: `<section style="padding:2.5rem 1.5rem;background:${MARKETING_INK};color:${MARKETING_WHITE};text-align:center"><p style="margin:0 0 .75rem;letter-spacing:.08em;text-transform:uppercase;color:${MARKETING_PINK};font-size:.75rem">Bridge</p><h2 style="margin:0">Content realm → every surface</h2></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.CODE,
    group: MARKETING_WIDGET_GROUP.CONTENT,
    label: 'Code showcase',
    html: `<section style="padding:2rem;background:${MARKETING_INK};color:${MARKETING_WHITE}"><pre style="margin:0;font-size:.85rem;opacity:.9">GET /api/pages\n{ "slug": "home", "status": "published" }</pre></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.STAT_STRIP,
    group: MARKETING_WIDGET_GROUP.CONTENT,
    label: 'Stat strip',
    html: `<section style="display:flex;justify-content:space-around;padding:1.5rem;background:${MARKETING_WHITE};border-top:1px solid #E4E6EE;border-bottom:1px solid #E4E6EE"><div><strong>24</strong><p style="margin:0;color:${MARKETING_MUTED}">Pages</p></div><div><strong>34</strong><p style="margin:0;color:${MARKETING_MUTED}">Published</p></div><div><strong>12</strong><p style="margin:0;color:${MARKETING_MUTED}">Crew</p></div></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.CTA_BAND,
    group: MARKETING_WIDGET_GROUP.CONVERSION,
    label: 'CTA band',
    html: `<section style="padding:2.5rem 1.5rem;background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap"><div><h2 style="margin:0 0 0.35rem">Start free</h2><p style="margin:0;opacity:0.92">Install Bifrost and publish from your own database.</p></div><a href="#" style="display:inline-block;background:${MARKETING_WHITE};color:${MARKETING_BLUE};padding:0.75rem 1.25rem;border-radius:0.5rem;font-weight:600">Install</a></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.GRADIENT_BUTTON,
    group: MARKETING_WIDGET_GROUP.CONVERSION,
    label: 'Gradient button',
    html: `<section style="padding:1.5rem;text-align:center;background:${MARKETING_WHITE}"><a href="#" style="display:inline-block;background:${MARKETING_GRADIENT};color:${MARKETING_WHITE};padding:.8rem 1.4rem;border-radius:.5rem;font-weight:600">Get started</a></section>`,
  },
  {
    id: MARKETING_WIDGET_IDS.FOOTER,
    group: MARKETING_WIDGET_GROUP.FOOTER,
    label: 'Footer',
    html: `<footer style="padding:2rem 1.5rem;background:${MARKETING_INK};color:${MARKETING_WHITE};display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap"><strong>Bifrost</strong><nav style="display:flex;gap:1.25rem"><a href="#" style="color:${MARKETING_WHITE}">Docs</a><a href="#" style="color:${MARKETING_WHITE}">Plans</a><a href="#" style="color:${MARKETING_WHITE}">Status</a></nav></footer>`,
  },
];
