export const ROUTES = {
  HOME: '/',
  DOCS: '/docs',
  DOCS_SLUG: '/docs/:slug',
  GUIDES: '/docs/how-to-use',
  API: '/api',
  CHANGELOG: '/changelog',
  DEMO: '/demo',
  ASK_AI: '/ai',
  MCP: '/docs/mcp',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const DEFAULT_DOC_SLUG = 'overview';

export const DOC_PATH = (slug: string): string => `${ROUTES.DOCS}/${slug}`;
