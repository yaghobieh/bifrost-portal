export const PROVIDER_PASSWORD = 'password';
export const USER_ROLE_USER = 'user';
export const USER_PLAN_FREE = 'free';
export const VIEWER_USERNAME = 'admin';
export const VIEWER_PASSWORD = 'admin';
export const VIEWER_EMAIL = 'admin@bifrost.local';
export const VIEWER_NAME = 'Admin';
export const VIEWER_CREW_SLUG = 'guest';
export const DEFAULT_JWT_SECRET = 'dev-only-change-me';
export const CMS_DOCS_COLLECTION = 'docs';
export const CMS_DOCS_LOCALE = 'en';
export const CMS_CONTENT_STATUS_PUBLISHED = 'published';

export const GUEST_PERMISSIONS = ['page:read', 'media:read'] as const;

export const CREW_ROLES = [
  {
    slug: 'captain',
    name: 'Captain',
    description: 'Full CMS control — users, roles, publish, live edit.',
    permissions: [
      'page:read',
      'page:create',
      'page:edit',
      'page:delete',
      'page:publish',
      'page:live-edit',
      'media:read',
      'media:upload',
      'user:read',
      'user:create',
      'role:read',
      'role:create',
      'extension:read',
      'extension:install',
      'settings:read',
      'settings:edit',
    ],
    system: true,
  },
  {
    slug: 'officer',
    name: 'Officer',
    description: 'Edit and publish content; no role administration.',
    permissions: [
      'page:read',
      'page:create',
      'page:edit',
      'page:publish',
      'page:live-edit',
      'media:read',
      'media:upload',
      'extension:read',
      'settings:read',
    ],
    system: true,
  },
  {
    slug: 'crew',
    name: 'Crew',
    description: 'Draft and edit; cannot publish or manage users.',
    permissions: ['page:read', 'page:create', 'page:edit', 'media:read', 'media:upload'],
    system: true,
  },
  {
    slug: VIEWER_CREW_SLUG,
    name: 'Guest',
    description: 'Read-only published content.',
    permissions: [...GUEST_PERMISSIONS],
    system: true,
  },
] as const;
