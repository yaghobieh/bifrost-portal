import { ROUTES } from './routes.const';
import { DOC_PATH } from './routes.utils';

export type NavGroupId =
  | 'gettingStarted'
  | 'features'
  | 'coreConcepts'
  | 'guides'
  | 'apiReference';

export interface NavItem {
  slug: string;
  path: string;
  titleKey: string;
}

export interface NavGroup {
  id: NavGroupId;
  labelKey: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'gettingStarted',
    labelKey: 'nav.groupGettingStarted',
    items: [
      { slug: 'overview', path: DOC_PATH('overview'), titleKey: 'nav.overview' },
      { slug: 'how-to-use', path: DOC_PATH('how-to-use'), titleKey: 'nav.howToUse' },
      { slug: 'installation', path: DOC_PATH('installation'), titleKey: 'nav.installation' },
      { slug: 'installment', path: DOC_PATH('installment'), titleKey: 'nav.installment' },
      { slug: 'quickstart', path: DOC_PATH('quickstart'), titleKey: 'nav.quickstart' },
      { slug: 'cloud-or-local', path: DOC_PATH('cloud-or-local'), titleKey: 'nav.cloudOrLocal' },
      { slug: 'upgrade', path: DOC_PATH('upgrade'), titleKey: 'nav.upgrade' },
    ],
  },
  {
    id: 'features',
    labelKey: 'nav.groupFeatures',
    items: [
      { slug: 'admin', path: DOC_PATH('admin'), titleKey: 'nav.admin' },
      { slug: 'stage', path: DOC_PATH('stage'), titleKey: 'nav.stage' },
      { slug: 'draft-publish', path: DOC_PATH('draft-publish'), titleKey: 'nav.draftPublish' },
      { slug: 'locales', path: DOC_PATH('locales'), titleKey: 'nav.locales' },
      { slug: 'media', path: DOC_PATH('media'), titleKey: 'nav.media' },
      { slug: 'preview', path: DOC_PATH('preview'), titleKey: 'nav.preview' },
      { slug: 'audit', path: DOC_PATH('audit'), titleKey: 'nav.audit' },
    ],
  },
  {
    id: 'coreConcepts',
    labelKey: 'nav.groupCoreConcepts',
    items: [
      { slug: 'collections', path: DOC_PATH('collections'), titleKey: 'nav.collections' },
      { slug: 'agents', path: DOC_PATH('agents'), titleKey: 'nav.agents' },
      { slug: 'agent-logs', path: DOC_PATH('agent-logs'), titleKey: 'nav.agentLogs' },
      { slug: 'permissions', path: DOC_PATH('permissions'), titleKey: 'nav.permissions' },
      { slug: 'file-structure', path: DOC_PATH('file-structure'), titleKey: 'nav.fileStructure' },
    ],
  },
  {
    id: 'guides',
    labelKey: 'nav.groupGuides',
    items: [
      { slug: 'plugins', path: DOC_PATH('plugins'), titleKey: 'nav.plugins' },
      { slug: 'create-plugin', path: DOC_PATH('create-plugin'), titleKey: 'nav.createPlugin' },
      { slug: 'mcp', path: DOC_PATH('mcp'), titleKey: 'nav.mcp' },
      { slug: 'figma-mcp', path: DOC_PATH('figma-mcp'), titleKey: 'nav.figmaMcp' },
      { slug: 'configuration', path: DOC_PATH('configuration'), titleKey: 'nav.configuration' },
      { slug: 'development', path: DOC_PATH('development'), titleKey: 'nav.development' },
      { slug: 'stack', path: DOC_PATH('stack'), titleKey: 'nav.stack' },
    ],
  },
  {
    id: 'apiReference',
    labelKey: 'nav.groupApi',
    items: [
      { slug: 'rest', path: DOC_PATH('rest'), titleKey: 'nav.rest' },
      { slug: 'graphql', path: DOC_PATH('graphql'), titleKey: 'nav.graphql' },
    ],
  },
];

export const TOP_TABS = [
  { id: 'docs', path: DOC_PATH('overview'), titleKey: 'nav.docs' },
  { id: 'guides', path: ROUTES.GUIDES, titleKey: 'nav.guides' },
  { id: 'api', path: ROUTES.API, titleKey: 'nav.api' },
  { id: 'changelog', path: ROUTES.CHANGELOG, titleKey: 'nav.changelog' },
] as const;

export const EXTRA_LINKS = [
  { path: ROUTES.DEMO, titleKey: 'nav.demo' },
  { path: ROUTES.ASK_AI, titleKey: 'nav.askAi' },
] as const;

export const GUIDE_SLUGS: string[] = [
  'how-to-use',
  'plugins',
  'create-plugin',
  'mcp',
  'figma-mcp',
  'configuration',
  'development',
  'stack',
];
