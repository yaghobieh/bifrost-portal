export type CrewPermission = string;

export type CrewRoleJson = {
  id: string;
  name: string;
  description: string;
  permissions: CrewPermission[];
  system: boolean;
  slug?: string;
};

export type CrewUserJson = {
  id: string;
  name: string;
  email: string;
  username: string;
  roleIds: string[];
  active: boolean;
};

export type CrewRoleRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  permissions: CrewPermission[] | string;
  system: boolean;
};

export type CrewUserRow = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role_ids: string[] | null;
};
