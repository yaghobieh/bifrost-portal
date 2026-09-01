export const CREW_PERMISSIONS = [
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
] as const;

export const CREW_SLUG_CAPTAIN = 'captain';
export const CREW_SLUG_OFFICER = 'officer';
export const CREW_SLUG_CREW = 'crew';
export const CREW_SLUG_GUEST = 'guest';

export const DEFAULT_CREW_ROLES = [
  {
    slug: CREW_SLUG_CAPTAIN,
    name: 'Captain',
    description: 'Full CMS control — users, roles, publish, live edit.',
    permissions: [...CREW_PERMISSIONS],
    system: true,
  },
  {
    slug: CREW_SLUG_OFFICER,
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
    slug: CREW_SLUG_CREW,
    name: 'Crew',
    description: 'Draft and edit; cannot publish or manage users.',
    permissions: ['page:read', 'page:create', 'page:edit', 'media:read', 'media:upload'],
    system: true,
  },
  {
    slug: CREW_SLUG_GUEST,
    name: 'Guest',
    description: 'Read-only published content.',
    permissions: ['page:read', 'media:read'],
    system: true,
  },
] as const;

export const CREW_SLUG_NON_ALNUM = /[^a-z0-9]+/g;
export const CREW_SLUG_EDGES = /^-+|-+$/g;
export const CREW_SLUG_DASH = '-';
export const PATH_CREATE_USER = 'create-user';
export const PATH_UPDATE_USER_ROLE = 'update-user-role';
export const PATH_CREATE_ROLE = 'create-role';
export const PATH_UPDATE_ROLE = 'update-role';
export const PATH_DELETE_ROLE = 'delete-role';
