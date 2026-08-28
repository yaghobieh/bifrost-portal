import { neon } from '@neondatabase/serverless';
import {
  EMPTY_STRING,
  ERROR_CANNOT_DELETE,
  ERROR_CREW_USER_FIELDS,
  ERROR_EMAIL_TAKEN,
  ERROR_ID_AND_ROLE,
  ERROR_ID_REQUIRED,
  ERROR_INTERNAL,
  ERROR_NAME_PERMISSIONS,
  ERROR_NOT_FOUND,
  ERROR_ROLE_EXISTS,
  ERROR_ROLE_NOT_FOUND,
  ERROR_SLUG_REQUIRED,
  ERROR_SYSTEM_ROLE,
  ERROR_USER_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  JWT_SECRET_DEV_FALLBACK,
  METHOD_DELETE,
  METHOD_GET,
  METHOD_PATCH,
  METHOD_POST,
  PATH_SEGMENT_REST,
  PLAN_FREE,
  PROVIDER_PASSWORD,
  QUERY_ID,
  QUERY_REST,
  REST_CREATE,
  REST_DELETE,
  REST_ROLE,
  REST_UPDATE,
  ROLE_ADMIN,
  ROLE_USER,
} from './cmsAuth.const';
import type { CmsAuthResult } from './cmsAuth.types';
import { isAuthResult, requireUser } from './cmsAuth';
import { firstRow, hashPassword, jwtSecrets, readUnknownObject, str } from './cmsAuth.utils';
import {
  CREW_SLUG_CAPTAIN,
  DEFAULT_CREW_ROLES,
  PATH_CREATE_ROLE,
  PATH_CREATE_USER,
  PATH_DELETE_ROLE,
  PATH_UPDATE_ROLE,
  PATH_UPDATE_USER_ROLE,
} from './cmsCrew.const';
import type { CrewRoleRow, CrewUserRow } from './cmsCrew.types';
import { mapCrewRole, mapCrewUser, parsePermissions, slugFromName } from './cmsCrew.utils';

type SqlClient = ReturnType<typeof neon>;

const pathHas = (pathname: string, segment: string): boolean => pathname.includes(`/${segment}`);

const restFrom = (request: Request): { rest: string; id: string; pathname: string } => {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? EMPTY_STRING;
  const rest = (url.searchParams.get(QUERY_REST) ?? EMPTY_STRING).trim();
  const fromQuery = (url.searchParams.get(QUERY_ID) ?? EMPTY_STRING).trim();
  const id = fromQuery || (last !== PATH_SEGMENT_REST && last !== 'users' && last !== 'roles' ? last : EMPTY_STRING);
  return { rest, id, pathname: url.pathname };
};

const ensureCrewTables = async (sql: SqlClient): Promise<void> => {
  await sql`
    CREATE TABLE IF NOT EXISTS cms_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
      system BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_user_roles (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role_id UUID NOT NULL REFERENCES cms_roles(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, role_id)
    )
  `;
  for (const role of DEFAULT_CREW_ROLES) {
    const permissionsJson = JSON.stringify(role.permissions);
    await sql`
      INSERT INTO cms_roles (slug, name, description, permissions, system)
      VALUES (${role.slug}, ${role.name}, ${role.description}, ${permissionsJson}::jsonb, ${role.system})
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        permissions = EXCLUDED.permissions,
        system = EXCLUDED.system,
        updated_at = NOW()
    `;
  }
};

const listRoles = async (sql: SqlClient) => {
  const rows = (await sql`
    SELECT id, slug, name, description, permissions, system
    FROM cms_roles
    ORDER BY system DESC, name ASC
  `) as CrewRoleRow[];
  return rows.map(mapCrewRole);
};

const findRoleById = async (sql: SqlClient, roleId: string) => {
  const rows = (await sql`
    SELECT id, slug, name, description, permissions, system
    FROM cms_roles
    WHERE id = ${roleId}
    LIMIT 1
  `) as CrewRoleRow[];
  const row = firstRow<CrewRoleRow>(rows);
  return row ? mapCrewRole(row) : null;
};

const findRoleBySlug = async (sql: SqlClient, slug: string) => {
  const rows = (await sql`
    SELECT id, slug, name, description, permissions, system
    FROM cms_roles
    WHERE slug = ${slug}
    LIMIT 1
  `) as CrewRoleRow[];
  const row = firstRow<CrewRoleRow>(rows);
  return row ? mapCrewRole(row) : null;
};

const listUsers = async (sql: SqlClient) => {
  try {
    const rows = (await sql`
      SELECT
        u.id,
        u.name,
        u.email,
        u.username,
        COALESCE(
          ARRAY_AGG(ur.role_id::text) FILTER (WHERE ur.role_id IS NOT NULL),
          ARRAY[]::text[]
        ) AS role_ids
      FROM users u
      LEFT JOIN cms_user_roles ur ON ur.user_id = u.id
      GROUP BY u.id, u.name, u.email, u.username
      ORDER BY u.created_at DESC
    `) as CrewUserRow[];
    return rows.map(mapCrewUser);
  } catch {
    const rows = (await sql`
      SELECT id, name, email, username
      FROM users
      ORDER BY created_at DESC
    `) as CrewUserRow[];
    return rows.map((row) => mapCrewUser({ ...row, role_ids: [] }));
  }
};

export const handleCrewUsers = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const sql = neon(params.databaseUrl);
  try {
    await ensureCrewTables(sql);
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
  const { rest, id, pathname } = restFrom(params.request);
  const method = params.request.method;
  const isCreate =
    method === METHOD_POST && (rest === REST_CREATE || pathHas(pathname, PATH_CREATE_USER) || rest === EMPTY_STRING);
  const isRolePatch =
    method === METHOD_PATCH && (rest === REST_ROLE || pathHas(pathname, PATH_UPDATE_USER_ROLE));
  if (method === METHOD_GET) {
    const users = await listUsers(sql);
    return { status: HTTP_STATUS_OK, body: { users } };
  }
  if (isCreate) {
    const body = await readUnknownObject(params.request);
    const email = str(body.email);
    const name = str(body.name);
    const username = str(body.username);
    const password = str(body.password);
    const roleId = str(body.roleId);
    if (!email || !name || !username || !password || !roleId) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_CREW_USER_FIELDS } };
    }
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (firstRow(existing)) {
      return { status: HTTP_STATUS_CONFLICT, body: { error: ERROR_EMAIL_TAKEN } };
    }
    const role = await findRoleById(sql, roleId);
    if (!role) {
      return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_ROLE_NOT_FOUND } };
    }
    const secrets = jwtSecrets();
    const secret = secrets[0] || JWT_SECRET_DEV_FALLBACK;
    const passwordHash = await hashPassword({ password, secret });
    const systemRole = role.slug === CREW_SLUG_CAPTAIN ? ROLE_ADMIN : ROLE_USER;
    const created = (await sql`
      INSERT INTO users (email, name, username, password_hash, provider, role)
      VALUES (${email}, ${name}, ${username}, ${passwordHash}, ${PROVIDER_PASSWORD}, ${systemRole})
      RETURNING id, name, email, username
    `) as CrewUserRow[];
    const user = firstRow<CrewUserRow>(created);
    if (!user) {
      return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
    }
    await sql`
      INSERT INTO cms_user_roles (user_id, role_id)
      VALUES (${user.id}, ${role.id})
      ON CONFLICT (user_id, role_id) DO NOTHING
    `;
    try {
      await sql`
        INSERT INTO plans (user_id, plan)
        VALUES (${user.id}, ${PLAN_FREE})
        ON CONFLICT (user_id) DO NOTHING
      `;
    } catch {
      return {
        status: HTTP_STATUS_CREATED,
        body: {
          user: mapCrewUser({ ...user, role_ids: [role.id] }),
        },
      };
    }
    return {
      status: HTTP_STATUS_CREATED,
      body: {
        user: mapCrewUser({ ...user, role_ids: [role.id] }),
      },
    };
  }
  if (isRolePatch) {
    const body = await readUnknownObject(params.request);
    const userId = id || str(body.id);
    const roleId = str(body.roleId);
    if (!userId || !roleId) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_ID_AND_ROLE } };
    }
    const targetRows = (await sql`
      SELECT id, name, email, username FROM users WHERE id = ${userId} LIMIT 1
    `) as CrewUserRow[];
    const target = firstRow<CrewUserRow>(targetRows);
    if (!target) {
      return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_USER_NOT_FOUND } };
    }
    const role = await findRoleById(sql, roleId);
    if (!role) {
      return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_ROLE_NOT_FOUND } };
    }
    await sql`DELETE FROM cms_user_roles WHERE user_id = ${userId}`;
    await sql`
      INSERT INTO cms_user_roles (user_id, role_id)
      VALUES (${userId}, ${role.id})
      ON CONFLICT (user_id, role_id) DO NOTHING
    `;
    return {
      status: HTTP_STATUS_OK,
      body: { user: mapCrewUser({ ...target, role_ids: [role.id] }) },
    };
  }
  return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_NOT_FOUND } };
};

export const handleCrewRoles = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const sql = neon(params.databaseUrl);
  try {
    await ensureCrewTables(sql);
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
  const { rest, id, pathname } = restFrom(params.request);
  const method = params.request.method;
  const isCreate =
    method === METHOD_POST && (rest === REST_CREATE || pathHas(pathname, PATH_CREATE_ROLE) || rest === EMPTY_STRING);
  const isUpdate = method === METHOD_PATCH && (rest === REST_UPDATE || pathHas(pathname, PATH_UPDATE_ROLE));
  const isDelete = method === METHOD_DELETE && (rest === REST_DELETE || pathHas(pathname, PATH_DELETE_ROLE));
  if (method === METHOD_GET) {
    const roles = await listRoles(sql);
    return { status: HTTP_STATUS_OK, body: { roles } };
  }
  if (isCreate) {
    const body = await readUnknownObject(params.request);
    const name = str(body.name);
    const description = str(body.description);
    const permissions = parsePermissions(body.permissions);
    if (!name || permissions.length === 0) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_NAME_PERMISSIONS } };
    }
    const slug = slugFromName(str(body.slug) || name);
    if (!slug) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_SLUG_REQUIRED } };
    }
    const existing = await findRoleBySlug(sql, slug);
    if (existing) {
      return { status: HTTP_STATUS_CONFLICT, body: { error: ERROR_ROLE_EXISTS } };
    }
    const permissionsJson = JSON.stringify(permissions);
    const rows = (await sql`
      INSERT INTO cms_roles (slug, name, description, permissions, system)
      VALUES (${slug}, ${name}, ${description}, ${permissionsJson}::jsonb, FALSE)
      RETURNING id, slug, name, description, permissions, system
    `) as CrewRoleRow[];
    const row = firstRow<CrewRoleRow>(rows);
    if (!row) {
      return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
    }
    return { status: HTTP_STATUS_CREATED, body: { role: mapCrewRole(row) } };
  }
  if (isUpdate) {
    const body = await readUnknownObject(params.request);
    const roleId = id || str(body.id);
    if (!roleId) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_ID_REQUIRED } };
    }
    const current = await findRoleById(sql, roleId);
    if (!current) {
      return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_NOT_FOUND } };
    }
    const name = body.name === undefined ? current.name : str(body.name);
    const description = body.description === undefined ? current.description : str(body.description);
    const permissions =
      body.permissions === undefined ? current.permissions : parsePermissions(body.permissions);
    if (body.permissions !== undefined && permissions.length === 0) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_NAME_PERMISSIONS } };
    }
    const permissionsJson = JSON.stringify(permissions);
    const rows = (await sql`
      UPDATE cms_roles
      SET name = ${name},
          description = ${description},
          permissions = ${permissionsJson}::jsonb,
          updated_at = NOW()
      WHERE id = ${roleId}
      RETURNING id, slug, name, description, permissions, system
    `) as CrewRoleRow[];
    const row = firstRow<CrewRoleRow>(rows);
    if (!row) {
      return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_NOT_FOUND } };
    }
    return { status: HTTP_STATUS_OK, body: { role: mapCrewRole(row) } };
  }
  if (isDelete) {
    const roleId = id;
    if (!roleId) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_ID_REQUIRED } };
    }
    const current = await findRoleById(sql, roleId);
    if (!current) {
      return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_NOT_FOUND } };
    }
    if (current.system) {
      return { status: HTTP_STATUS_FORBIDDEN, body: { error: ERROR_SYSTEM_ROLE } };
    }
    const rows = (await sql`
      DELETE FROM cms_roles WHERE id = ${roleId} AND system = FALSE RETURNING id
    `) as { id: string }[];
    if (!firstRow(rows)) {
      return { status: HTTP_STATUS_FORBIDDEN, body: { error: ERROR_CANNOT_DELETE } };
    }
    return { status: HTTP_STATUS_OK, body: { ok: true } };
  }
  return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_NOT_FOUND } };
};
