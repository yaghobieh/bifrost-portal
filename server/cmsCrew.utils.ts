import { EMPTY_STRING } from './cmsAuth.const';
import {
  CREW_SLUG_DASH,
  CREW_SLUG_EDGES,
  CREW_SLUG_NON_ALNUM,
} from './cmsCrew.const';
import type {
  CrewPermission,
  CrewRoleJson,
  CrewRoleRow,
  CrewUserJson,
  CrewUserRow,
} from './cmsCrew.types';

export const slugFromName = (name: string): string =>
  name.trim().toLowerCase().replace(CREW_SLUG_NON_ALNUM, CREW_SLUG_DASH).replace(CREW_SLUG_EDGES, EMPTY_STRING);

export const parsePermissions = (value: unknown): CrewPermission[] => {
  if (typeof value === 'string') {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === 'string');
  }
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
};

export const mapCrewRole = (row: CrewRoleRow): CrewRoleJson => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  description: row.description,
  permissions: parsePermissions(row.permissions),
  system: row.system,
});

export const mapCrewUser = (row: CrewUserRow): CrewUserJson => {
  const roleIds = Array.isArray(row.role_ids) ? row.role_ids.filter(Boolean) : [];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    username: row.username ?? EMPTY_STRING,
    roleIds,
    active: true,
  };
};
