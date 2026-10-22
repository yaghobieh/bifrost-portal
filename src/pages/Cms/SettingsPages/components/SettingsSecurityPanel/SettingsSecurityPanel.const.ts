import type {
  AdminUser,
  ApiToken,
  RolePermissionMatrix,
  WebhookItem,
} from './SettingsSecurityPanel.types';

export const CMS_SECURITY_USERS_KEY = 'bifrost-cms-admin-users';
export const CMS_SECURITY_PERMS_KEY = 'bifrost-cms-role-permissions';
export const CMS_SECURITY_TOKENS_KEY = 'bifrost-cms-api-tokens';
export const CMS_SECURITY_WEBHOOKS_KEY = 'bifrost-cms-webhooks';

export const CONTENT_TYPE_RESOURCES = [
  { id: 'pages', name: 'Pages' },
  { id: 'articles', name: 'Articles' },
  { id: 'blog_posts', name: 'Blog Posts' },
  { id: 'products', name: 'Products / Catalog' },
  { id: 'media', name: 'Media Library' },
  { id: 'components', name: 'Components & Blocks' },
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'John Yaghobieh',
    email: 'john@forge.dev',
    role: 'Super Admin',
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.c@bifrost.io',
    role: 'Editor',
    status: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-3',
    name: 'Alex Rivera',
    email: 'alex.r@external-press.org',
    role: 'Author',
    status: 'active',
    lastActive: 'Yesterday',
  },
  {
    id: 'usr-4',
    name: 'David Kim',
    email: 'david.k@marketing.co',
    role: 'Author',
    status: 'invited',
    lastActive: 'Never',
  },
];

export const INITIAL_ROLE_PERMISSIONS: RolePermissionMatrix = {
  'Super Admin': {
    pages: { create: true, read: true, update: true, delete: true, publish: true },
    articles: { create: true, read: true, update: true, delete: true, publish: true },
    blog_posts: { create: true, read: true, update: true, delete: true, publish: true },
    products: { create: true, read: true, update: true, delete: true, publish: true },
    media: { create: true, read: true, update: true, delete: true, publish: true },
    components: { create: true, read: true, update: true, delete: true, publish: true },
  },
  Editor: {
    pages: { create: true, read: true, update: true, delete: false, publish: true },
    articles: { create: true, read: true, update: true, delete: false, publish: true },
    blog_posts: { create: true, read: true, update: true, delete: true, publish: true },
    products: { create: true, read: true, update: true, delete: false, publish: true },
    media: { create: true, read: true, update: true, delete: true, publish: true },
    components: { create: false, read: true, update: false, delete: false, publish: false },
  },
  Author: {
    pages: { create: false, read: true, update: false, delete: false, publish: false },
    articles: { create: true, read: true, update: true, delete: false, publish: false },
    blog_posts: { create: true, read: true, update: true, delete: false, publish: false },
    products: { create: false, read: true, update: false, delete: false, publish: false },
    media: { create: true, read: true, update: false, delete: false, publish: false },
    components: { create: false, read: true, update: false, delete: false, publish: false },
  },
};

export const INITIAL_API_TOKENS: ApiToken[] = [
  {
    id: 'tok-1',
    name: 'Production Next.js Frontend',
    token: 'bf_live_948f2b1a9e3347cda772183eef098192',
    maskedToken: 'bf_live_••••••••••••••••098192',
    scope: 'read-only',
    createdAt: '2026-10-10',
    expiresAt: 'Never',
    lastUsed: '10 mins ago',
  },
  {
    id: 'tok-2',
    name: 'CI/CD Ingestion Worker',
    token: 'bf_live_8371ef390acb45ffba99103e55102941',
    maskedToken: 'bf_live_••••••••••••••••102941',
    scope: 'full-access',
    createdAt: '2026-10-15',
    expiresAt: '1 year',
    lastUsed: '3 hours ago',
  },
  {
    id: 'tok-3',
    name: 'Staging Vercel Preview',
    token: 'bf_live_6723ab8174ef2098bc55998124901844',
    maskedToken: 'bf_live_••••••••••••••••901844',
    scope: 'read-only',
    createdAt: '2026-10-18',
    expiresAt: '90 days',
    lastUsed: 'Yesterday',
  },
];

export const INITIAL_WEBHOOKS: WebhookItem[] = [
  {
    id: 'wh-1',
    name: 'Vercel Production Deploy Hook',
    url: 'https://api.vercel.com/v1/integrations/deploy/prj_prod_9918/trigger',
    platform: 'vercel',
    events: ['content.publish', 'content.delete', 'site.update'],
    status: 'active',
    lastTriggered: '2026-10-21 17:42:00',
    lastStatus: 200,
  },
  {
    id: 'wh-2',
    name: 'Netlify Preview Sync',
    url: 'https://api.netlify.com/build_hooks/670183e9b119024',
    platform: 'netlify',
    events: ['content.publish'],
    status: 'active',
    lastTriggered: '2026-10-20 09:12:00',
    lastStatus: 200,
  },
  {
    id: 'wh-3',
    name: 'Algolia Search Indexer',
    url: 'https://search-indexer.bifrost.io/webhooks/reindex',
    platform: 'custom',
    events: ['content.publish', 'content.delete'],
    status: 'paused',
    lastTriggered: '2026-10-19 14:00:00',
    lastStatus: 200,
  },
];
