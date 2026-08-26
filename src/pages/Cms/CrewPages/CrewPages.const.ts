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
  'task:create',
  'task:edit',
  'task:status',
  'task:fields',
  'chat:open',
  'chat:room',
  'issue:create',
] as const;

export type CrewPermission = (typeof CREW_PERMISSIONS)[number];

export type CrewPermissionGroupId =
  | 'page'
  | 'media'
  | 'userRole'
  | 'extension'
  | 'task'
  | 'issue';

export const CREW_PERMISSION_GROUPS: readonly {
  id: CrewPermissionGroupId;
  permissions: readonly CrewPermission[];
}[] = [
  {
    id: 'page',
    permissions: [
      'page:read',
      'page:create',
      'page:edit',
      'page:delete',
      'page:publish',
      'page:live-edit',
    ],
  },
  {
    id: 'media',
    permissions: ['media:read', 'media:upload'],
  },
  {
    id: 'userRole',
    permissions: ['user:read', 'user:create', 'role:read', 'role:create'],
  },
  {
    id: 'extension',
    permissions: [
      'extension:read',
      'extension:install',
      'settings:read',
      'settings:edit',
    ],
  },
  {
    id: 'task',
    permissions: [
      'task:create',
      'task:edit',
      'task:status',
      'task:fields',
      'chat:open',
      'chat:room',
    ],
  },
  {
    id: 'issue',
    permissions: ['issue:create'],
  },
] as const;

export const CREW_PAGE_TABS = {
  USERS: 'users',
  DEVELOPER: 'developer',
} as const;

export const CREW_LAYOUT_COLS = 2 as const;
export const CREW_LAYOUT_GAP = 4 as const;

export type CrewRole = {
  id: string;
  name: string;
  description: string;
  permissions: CrewPermission[];
  system: boolean;
};

export type CrewUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  roleIds: string[];
  active: boolean;
};

export const DEFAULT_CREW_ROLES: CrewRole[] = [
  {
    id: 'captain',
    name: 'Captain',
    description: 'Full CMS control — users, roles, publish, live edit.',
    permissions: [...CREW_PERMISSIONS],
    system: true,
  },
  {
    id: 'officer',
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
      'task:create',
      'task:edit',
      'task:status',
      'task:fields',
      'chat:open',
      'chat:room',
      'issue:create',
    ],
    system: true,
  },
  {
    id: 'crew',
    name: 'Crew',
    description: 'Draft and edit; cannot publish or manage users.',
    permissions: [
      'page:read',
      'page:create',
      'page:edit',
      'media:read',
      'media:upload',
      'task:create',
      'task:edit',
      'chat:open',
      'issue:create',
    ],
    system: true,
  },
  {
    id: 'guest',
    name: 'Guest',
    description: 'Read-only published content.',
    permissions: ['page:read', 'media:read'],
    system: true,
  },
];

export const DEFAULT_CREW_USERS: CrewUser[] = [
  {
    id: 'u-captain',
    name: 'John Yaghobieh',
    email: 'captain@bifrost.local',
    username: 'yaghobieh',
    roleIds: ['captain'],
    active: true,
  },
];
