import type { LandingCopy } from '../src/data/pages.types';

export const LANDING_PAYLOAD: LandingCopy = {
  navProduct: 'Product',
  startFree: 'Start free',
  eyebrow: 'One content model. Every surface.',
  titleBefore: 'Content that reaches',
  titleEm: 'every surface',
  titleAfter: ', without three CMS stacks',
  sub: 'Bifrost is the ForgeStack CMS that bridges your content model to your website, app, docs, and inbox — a visual builder for editors, a real API for engineers, one source of truth for both.',
  readDocs: 'Read the docs →',
  stripBuilder: 'Visual page builder, not just a form',
  stripStore: 'Extension marketplace, not a plugin ceiling',
  stripCrew: 'Built-in crew chat and tasks',
  stripAi: 'AI suggestions on every block',
  previewUrl: 'app.bifrost.dev/dashboard',
  bridgeEyebrow: 'The bridge, literally',
  bridgeTitle: 'Model it once. It shows up everywhere.',
  bridgeSub: 'Every field, block, and relation you define in Bifrost is queryable the moment you save it — no separate export step per channel.',
  featEyebrow: 'Why teams switch',
  featTitle: 'Everything past the API, already built',
  featSub: 'Most headless stacks stop at content storage and a blank editor. Bifrost ships the tools your team actually runs day to day.',
  featStage: 'Stage',
  featStageBody: 'A real drag-and-drop canvas — sections, grids, and widgets, with live AI suggestions in the inspector as you build.',
  featStore: 'Store',
  featStoreBody: 'Install extensions the way you would add an npm package — spreadsheets, theming, forms — searchable, versioned, one click.',
  featCrew: 'Crew',
  featCrewBody: 'Channels, DMs, and a task board live in the CMS — no tab-switching to another chat app to ask who owns a draft.',
  featAi: 'AI assist',
  featAiBody: 'Suggestions for type, spacing, and structure appear inline as you edit — accept, tweak, or ignore, never auto-applied.',
  codeEyebrow: 'Built for engineers, not just editors',
  codeTitle: 'Query it like an API, because it is one',
  codeSub: 'Every model, every extension field, every relation is available over REST the moment your editors hit save — no publish-and-wait step.',
  codeCheckApi: 'REST generated from your model',
  codeCheckTs: 'TypeScript types shipped alongside the SDK',
  codeCheckHost: 'Self-host or Cloud — same API either way',
  codeComment: '// same data, same shape — web, app, or email',
  ctaTitle: 'Bridge your stack this week',
  ctaSub: 'Install locally or on Cloud. One project to start. Pack levels stay a developer page — not first installment.',
  footerBlurb: 'The CMS that bridges your content model to every surface you ship.',
  footerResources: 'Resources',
  footerCompany: 'Company',
  builtOn: 'Built on ForgeStack',
};

type SeedCanvasNode = {
  id: string;
  kind: 'section' | 'ink';
  label: string;
  html?: string;
  children: SeedCanvasNode[];
};

const articleCanvas = (params: {
  slug: string;
  title: string;
  lead: string;
  body: string;
}): SeedCanvasNode[] => {
  const { slug, title, lead, body } = params;
  return [
    {
      id: `${slug}-section`,
      kind: 'section',
      label: title,
      children: [
        {
          id: `${slug}-body`,
          kind: 'ink',
          label: 'Body',
          html: `<h1>${title}</h1><p>${lead}</p><p>${body}</p>`,
          children: [],
        },
      ],
    },
  ];
};

export const SITE_PAGES_SEED = [
  {
    slug: 'changelog',
    title: 'Changelog',
    payload: {
      title: 'Changelog',
      lead: 'Portal sprint 1.0.0 — public docs and landing copy from Postgres, Vercel-ready API, API Explorer, MCP, Figma MCP, Ask AI, and demo.',
      body: 'Edit this page in CMS → Content → pages / changelog. Every public route is a pages row with its own payload.kind. Open Stage to restyle the layout.',
      canvas: articleCanvas({
        slug: 'changelog',
        title: 'Changelog',
        lead: 'Portal sprint 1.0.0 — public docs and landing copy from Postgres, Vercel-ready API, API Explorer, MCP, Figma MCP, Ask AI, and demo.',
        body: 'Edit this page in CMS → Content. Open Stage to restyle the layout.',
      }),
    },
  },
  {
    slug: 'demo',
    title: 'Live demo',
    payload: {
      title: 'Live demo',
      lead: 'A public walkthrough of Bifrost chrome. Sign in to the CMS at /cms on this same origin.',
      body: 'This portal reads one published pages row per route. Change copy in CMS and refresh — do not edit static catalogs.',
      note: 'Deploy on Vercel with DATABASE_URL as a server env.',
      previewUrl: LANDING_PAYLOAD.previewUrl,
      canvas: articleCanvas({
        slug: 'demo',
        title: 'Live demo',
        lead: 'A public walkthrough of Bifrost chrome. Sign in to the CMS at /cms on this same origin.',
        body: 'This portal reads one published pages row per route. Change copy in CMS and refresh.',
      }),
    },
  },
  {
    slug: 'ask-ai',
    title: 'Ask AI',
    payload: {
      title: 'Ask AI',
      lead: 'Ask anything about installment, MCP, collections, agents, or the REST API. The assistant is grounded in CMS pages.',
      body: 'Add your OpenAI token as OPENAI_API_KEY in a local env file (never commit it). Until then, answers come from matching pages fetched one slug at a time.',
      note: 'Ask AI calls GET /api/public/pages/:slug for each match. There is no bulk docs dump.',
      canvas: articleCanvas({
        slug: 'ask-ai',
        title: 'Ask AI',
        lead: 'Ask anything about installment, MCP, collections, agents, or the REST API.',
        body: 'The assistant is grounded in CMS pages. Open Stage to restyle this intro.',
      }),
    },
  },
  {
    slug: 'plans',
    title: 'Plans',
    payload: {
      title: 'Plans',
      lead: 'Standard covers Stage, API, and hosting. The AI plan adds one-click catalog translation for your public locales.',
      body: 'Edit plans copy and layout in CMS → Content → pages / plans, then restyle in Stage.',
      canvas: articleCanvas({
        slug: 'plans',
        title: 'Plans',
        lead: 'Standard covers Stage, API, and hosting. The AI plan adds one-click catalog translation for your public locales.',
        body: 'Edit this page in CMS → Content. Open Stage to restyle the layout.',
      }),
    },
  },
  {
    slug: 'api',
    title: 'API Explorer',
    payload: {
      title: 'API Explorer',
      lead: 'Call the same REST the public site uses. Collection pages, one slug at a time.',
      body: 'The table below is the live explorer. Intro copy and layout come from CMS Stage.',
      canvas: articleCanvas({
        slug: 'api',
        title: 'API Explorer',
        lead: 'Call the same REST the public site uses. Collection pages, one slug at a time.',
        body: 'Intro copy lives in CMS. Open Stage to restyle this block.',
      }),
    },
  },
];
