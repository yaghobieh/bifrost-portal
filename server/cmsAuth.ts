import { neon } from '@neondatabase/serverless';
import {
  ERROR_DATABASE_UNAVAILABLE,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
  CMS_CONTENT_STATUS_PUBLISHED,
  CMS_DOCS_LOCALE,
} from './cmsDocs.const';
import {
  EMPTY_STRING,
  ERROR_EMAIL_NAME_PASSWORD,
  ERROR_EMAIL_TAKEN,
  ERROR_INTERNAL,
  ERROR_INVALID_CREDENTIALS,
  ERROR_INVALID_SETTINGS_KEY,
  ERROR_NOT_FOUND,
  ERROR_SETTINGS_VALUE_REQUIRED,
  ERROR_UNAUTHORIZED,
  ERROR_USERNAME_PASSWORD,
  HEALTH_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_UNAUTHORIZED,
  INK_PACKAGE_VERSION,
  JWT_SECRET_DEV_FALLBACK,
  METHOD_GET,
  METHOD_PUT,
  NUMBER_ZERO,
  NUMBER_ONE,
  PACKAGE_VERSION,
  PLAN_FREE,
  PRODUCT_BIFROST,
  PROVIDER_PASSWORD,
  QUERY_KEY,
  QUERY_SLUG,
  ROLE_USER,
  SERVICE_NAME,
  SETTINGS_BODY_VALUE,
  SETTINGS_KV_KEYS,
  SETTINGS_KV_SITE,
  DEFAULT_BLOG_PATH,
  PAYLOAD_VIEWS_KEY,
  SPRINT_VERSION,
  WEEK_DAY_COUNT,
  COLLECTION_BLOG,
  COLLECTION_DOCS,
  COLLECTION_PAGES,
  DEFAULT_LOCALE,
  ERROR_COLLECTION_SLUG,
  HTTP_STATUS_CREATED,
  METHOD_POST,
  PATH_SEGMENT_GET_CONTENT,
  PATH_SEGMENT_POSTS,
  PAYLOAD_BODY_KEY,
  PAYLOAD_LEAD_KEY,
  STATUS_PUBLISHED,
} from './cmsAuth.const';
import type {
  CmsAdminContentItem,
  CmsAdminContentRow,
  CmsAuthResult,
  CmsJwtPayload,
  CmsKvRow,
  CmsUserRow,
} from './cmsAuth.types';
import {
  bearerToken,
  firstRow,
  hashPassword,
  jwtSecrets,
  readJsonBody,
  readUnknownObject,
  safeEqual,
  signJwt,
  str,
  toPublicUser,
  verifyJwt,
} from './cmsAuth.utils';

const findUserByIdentity = async (
  databaseUrl: string,
  identity: string,
): Promise<CmsUserRow | null> => {
  const sql = neon(databaseUrl);
  try {
    const rows = await sql`
      SELECT u.id, u.email, u.name, u.username, u.password_hash, u.role, u.provider, u.provider_id, u.created_at,
             COALESCE(p.plan, ${PLAN_FREE}) AS plan
      FROM users u
      LEFT JOIN plans p ON p.user_id = u.id
      WHERE u.email = ${identity} OR u.username = ${identity}
      LIMIT 1
    `;
    return firstRow<CmsUserRow>(rows);
  } catch {
    const rows = await sql`
      SELECT u.id, u.email, u.name, u.username, u.password_hash, u.role, u.provider, u.provider_id, u.created_at,
             ${PLAN_FREE} AS plan
      FROM users u
      WHERE u.email = ${identity} OR u.username = ${identity}
      LIMIT 1
    `;
    return firstRow<CmsUserRow>(rows);
  }
};

const matchPassword = async (params: {
  hash: string;
  password: string;
}): Promise<string | null> => {
  const { hash, password } = params;
  const secrets = jwtSecrets();
  for (const secret of secrets) {
    const candidate = await hashPassword({ password, secret });
    if (safeEqual(hash, candidate)) {
      return secret;
    }
  }
  return null;
};

const unavailable = (): CmsAuthResult => ({
  status: HTTP_STATUS_SERVICE_UNAVAILABLE,
  body: { error: ERROR_DATABASE_UNAVAILABLE },
});

export const loginWithPassword = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  if (!databaseUrl) {
    return unavailable();
  }
  const body = await readJsonBody(request);
  const identity = str(body.username) || str(body.email);
  const password = str(body.password);
  if (!identity || !password) {
    return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_USERNAME_PASSWORD } };
  }
  const user = await findUserByIdentity(databaseUrl, identity);
  if (!user?.password_hash) {
    return { status: HTTP_STATUS_UNAUTHORIZED, body: { error: ERROR_INVALID_CREDENTIALS } };
  }
  const secret = await matchPassword({ hash: user.password_hash, password });
  if (!secret) {
    return { status: HTTP_STATUS_UNAUTHORIZED, body: { error: ERROR_INVALID_CREDENTIALS } };
  }
  const payload: CmsJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const token = await signJwt({ payload, secret });
  return { status: HTTP_STATUS_OK, body: { user: toPublicUser(user), token } };
};

export const registerWithPassword = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  if (!databaseUrl) {
    return unavailable();
  }
  const body = await readJsonBody(request);
  const email = str(body.email);
  const name = str(body.name);
  const password = str(body.password);
  const username = str(body.username) || null;
  if (!email || !name || !password) {
    return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_EMAIL_NAME_PASSWORD } };
  }
  const existing = await findUserByIdentity(databaseUrl, email);
  if (existing) {
    return { status: HTTP_STATUS_CONFLICT, body: { error: ERROR_EMAIL_TAKEN } };
  }
  const secrets = jwtSecrets();
  const secret = secrets[0] || JWT_SECRET_DEV_FALLBACK;
  const passwordHash = await hashPassword({ password, secret });
  const sql = neon(databaseUrl);
  const rows = await sql`
    INSERT INTO users (email, name, username, password_hash, provider, role)
    VALUES (${email}, ${name}, ${username}, ${passwordHash}, ${PROVIDER_PASSWORD}, ${ROLE_USER})
    RETURNING id, email, name, username, password_hash, role, provider, provider_id, created_at
  `;
  const created = firstRow<Omit<CmsUserRow, 'plan'>>(rows);
  if (!created) {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
  const user: CmsUserRow = { ...created, plan: PLAN_FREE };
  const payload: CmsJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const token = await signJwt({ payload, secret });
  return { status: HTTP_STATUS_OK, body: { user: toPublicUser(user), token } };
};

export const requireUser = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<{ user: CmsUserRow } | CmsAuthResult> => {
  const { databaseUrl, request } = params;
  if (!databaseUrl) {
    return unavailable();
  }
  const token = bearerToken(request);
  const payload = await verifyJwt({ token, secrets: jwtSecrets() });
  if (!payload?.email) {
    return { status: HTTP_STATUS_UNAUTHORIZED, body: { error: ERROR_UNAUTHORIZED } };
  }
  const user = await findUserByIdentity(databaseUrl, payload.email);
  if (!user) {
    return { status: HTTP_STATUS_NOT_FOUND, body: { error: ERROR_NOT_FOUND } };
  }
  return { user };
};

export const isAuthResult = (value: { user: CmsUserRow } | CmsAuthResult): value is CmsAuthResult =>
  'status' in value;

export const currentUser = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  return { status: HTTP_STATUS_OK, body: { user: toPublicUser(loaded.user) } };
};

export const dashboardForUser = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const weekly = Array.from({ length: WEEK_DAY_COUNT }, () => 0);
  return {
    status: HTTP_STATUS_OK,
    body: {
      user: toPublicUser(loaded.user),
      usage: {
        tokensUsed: 0,
        tokensLimit: 1,
        periodStart: EMPTY_STRING,
        periodEnd: EMPTY_STRING,
      },
      pages: { total: 0, published: 0, draft: 0 },
      analytics: {
        documents: 0,
        published: 0,
        drafts: 0,
        templates: 0,
        media: 0,
        tables: 0,
        crew: 0,
        unreadNotifications: 0,
        tokensUsed: 0,
        tokensLimit: 1,
        documentsDelta: 0,
        publishedDelta: 0,
        draftsDelta: 0,
        pageViews: 0,
        pageViewsDelta: 0,
        totalRevenue: 0,
        revenueDelta: 0,
        bounceRate: 0,
        bounceDelta: 0,
        subscribers: 0,
        subscribersDelta: 0,
        usageRate: 0,
        salesOverview: 0,
        weekly,
        distribution: [],
        integrations: [],
      },
      host: {
        apiBase: EMPTY_STRING,
        cmsPublicUrl: EMPTY_STRING,
      },
    },
  };
};

export const emptyItems = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  return { status: HTTP_STATUS_OK, body: { items: [] } };
};

export const emptyPages = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  return { status: HTTP_STATUS_OK, body: { pages: [] } };
};

export const emptyNotifications = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  return { status: HTTP_STATUS_OK, body: { items: [], unread: 0, redis: false } };
};

export const healthPayload = (databaseUrl: string): CmsAuthResult => ({
  status: HTTP_STATUS_OK,
  body: {
    status: HEALTH_OK,
    service: SERVICE_NAME,
    db: Boolean(databaseUrl),
    version: PACKAGE_VERSION,
    sprint: SPRINT_VERSION,
  },
});

export const versionPayload = (): CmsAuthResult => ({
  status: HTTP_STATUS_OK,
  body: {
    product: PRODUCT_BIFROST,
    version: PACKAGE_VERSION,
    sprint: SPRINT_VERSION,
    ink: INK_PACKAGE_VERSION,
    portal: PACKAGE_VERSION,
    node: EMPTY_STRING,
    platform: EMPTY_STRING,
    arch: EMPTY_STRING,
    env: SERVICE_NAME,
    uptimeSec: NUMBER_ZERO,
    docker: {
      running: false,
      hostname: EMPTY_STRING,
      image: EMPTY_STRING,
      containerName: EMPTY_STRING,
    },
    build: {
      sha: EMPTY_STRING,
      time: EMPTY_STRING,
      number: EMPTY_STRING,
    },
    packages: {
      [SERVICE_NAME]: PACKAGE_VERSION,
    },
    notes: EMPTY_STRING,
  },
});

export const mediaConfigPayload = (): CmsAuthResult => ({
  status: HTTP_STATUS_OK,
  body: {
    cloudName: EMPTY_STRING,
    hasKey: false,
    hasSecret: false,
    configured: false,
  },
});

export const pluginCatalogPayload = (): CmsAuthResult => ({
  status: HTTP_STATUS_OK,
  body: {
    items: [],
  },
});

const isSettingsKey = (value: string): boolean => {
  for (const key of SETTINGS_KV_KEYS) {
    if (key === value) {
      return true;
    }
  }
  return false;
};

const settingsKeyFromUrl = (request: Request): string => {
  const url = new URL(request.url);
  const fromQuery = (url.searchParams.get(QUERY_KEY) ?? EMPTY_STRING).trim();
  if (fromQuery) {
    return fromQuery;
  }
  const parts = url.pathname.split('/').filter(Boolean);
  return (parts[parts.length - 1] ?? EMPTY_STRING).trim();
};

const parseKvValue = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
};

const ensureKvTable = async (databaseUrl: string): Promise<void> => {
  const sql = neon(databaseUrl);
  await sql`
    CREATE TABLE IF NOT EXISTS cms_kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
};

const payloadViews = (payload: Record<string, unknown>): number => {
  const value = payload[PAYLOAD_VIEWS_KEY];
  if (typeof value === 'number' && Number.isFinite(value) && value >= NUMBER_ZERO) {
    return value;
  }
  return NUMBER_ZERO;
};

export const publicSiteChrome = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl } = params;
  try {
    await ensureKvTable(databaseUrl);
    const sql = neon(databaseUrl);
    const rows = await sql`
      SELECT key, value
      FROM cms_kv
      WHERE key = ${SETTINGS_KV_SITE}
      LIMIT 1
    `;
    const row = firstRow<CmsKvRow>(rows);
    const parsed = row ? parseKvValue(row.value) : null;
    let hiddenPublicNavIds: string[] = [];
    let blogPath = DEFAULT_BLOG_PATH;
    let showTopNav = true;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const record = parsed as Record<string, unknown>;
      if (Array.isArray(record.hiddenPublicNavIds)) {
        hiddenPublicNavIds = record.hiddenPublicNavIds.filter(
          (id): id is string => typeof id === 'string',
        );
      }
      if (typeof record.blogPath === 'string' && record.blogPath.trim()) {
        blogPath = record.blogPath.trim();
      }
      if (record.showTopNav === false) {
        showTopNav = false;
      }
    }
    return {
      status: HTTP_STATUS_OK,
      body: { hiddenPublicNavIds, blogPath, showTopNav },
    };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const handleSettings = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const key = settingsKeyFromUrl(request);
  if (!isSettingsKey(key)) {
    return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_INVALID_SETTINGS_KEY } };
  }
  const sql = neon(databaseUrl);
  if (request.method === METHOD_GET) {
    try {
      await ensureKvTable(databaseUrl);
      const rows = await sql`
        SELECT key, value
        FROM cms_kv
        WHERE key = ${key}
        LIMIT 1
      `;
      const row = firstRow<CmsKvRow>(rows);
      return { status: HTTP_STATUS_OK, body: { key, value: row ? parseKvValue(row.value) : null } };
    } catch {
      return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
    }
  }
  if (request.method === METHOD_PUT) {
    const body = await readUnknownObject(request);
    if (!(SETTINGS_BODY_VALUE in body)) {
      return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_SETTINGS_VALUE_REQUIRED } };
    }
    try {
      await ensureKvTable(databaseUrl);
      const json = JSON.stringify(body[SETTINGS_BODY_VALUE]);
      const rows = await sql`
        INSERT INTO cms_kv (key, value, updated_at)
        VALUES (${key}, ${json}, NOW())
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = NOW()
        RETURNING key, value
      `;
      const row = firstRow<CmsKvRow>(rows);
      const stored = row ? parseKvValue(row.value) : body[SETTINGS_BODY_VALUE];
      return { status: HTTP_STATUS_OK, body: { key, value: stored } };
    } catch {
      return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
    }
  }
  return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_INVALID_SETTINGS_KEY } };
};

const toIso = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : value;

const parsePayload = (value: Record<string, unknown> | string): Record<string, unknown> => {
  if (typeof value === 'string') {
    return JSON.parse(value) as Record<string, unknown>;
  }
  return value ?? {};
};

const mapContentItem = (row: CmsAdminContentRow): CmsAdminContentItem => ({
  id: row.id,
  collection: row.collection,
  slug: row.slug,
  locale: row.locale,
  title: row.title,
  payload: parsePayload(row.payload),
  status: row.status,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

const payloadText = (payload: Record<string, unknown>, key: string): string => {
  const value = payload[key];
  if (typeof value !== 'string') {
    return EMPTY_STRING;
  }
  return value;
};

const publishedContentBySlug = async (params: {
  databaseUrl: string;
  slug: string;
}): Promise<CmsAdminContentItem | null> => {
  const { databaseUrl, slug } = params;
  const sql = neon(databaseUrl);
  const collections = [COLLECTION_PAGES, COLLECTION_DOCS, COLLECTION_BLOG];
  for (const collection of collections) {
    const rows = (await sql`
      SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
      FROM cms_content
      WHERE collection = ${collection}
        AND slug = ${slug}
        AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
        AND locale = ${CMS_DOCS_LOCALE}
      LIMIT 1
    `) as CmsAdminContentRow[];
    const row = firstRow<CmsAdminContentRow>(rows);
    if (row) {
      return mapContentItem(row);
    }
  }
  return null;
};

export const pageBySlugQuery = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  const url = new URL(request.url);
  const slug = (url.searchParams.get(QUERY_SLUG) ?? EMPTY_STRING).trim();
  if (!slug) {
    return { status: HTTP_STATUS_OK, body: { items: [] } };
  }
  try {
    const item = await publishedContentBySlug({ databaseUrl, slug });
    if (!item) {
      return { status: HTTP_STATUS_OK, body: { items: [] } };
    }
    return {
      status: HTTP_STATUS_OK,
      body: {
        items: [
          {
            title: item.title,
            body: payloadText(item.payload, PAYLOAD_BODY_KEY),
            meta: { lead: payloadText(item.payload, PAYLOAD_LEAD_KEY) },
          },
        ],
      },
    };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const listPublishedBlog = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl } = params;
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`
      SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
      FROM cms_content
      WHERE collection = ${COLLECTION_BLOG}
        AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
        AND locale = ${CMS_DOCS_LOCALE}
      ORDER BY updated_at DESC
    `) as CmsAdminContentRow[];
    return { status: HTTP_STATUS_OK, body: { items: rows.map(mapContentItem) } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const publishedBlogBySlug = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  const url = new URL(request.url);
  const fromQuery = (url.searchParams.get(QUERY_SLUG) ?? EMPTY_STRING).trim();
  const parts = url.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? EMPTY_STRING;
  const slug = fromQuery || last;
  if (!slug || slug === PATH_SEGMENT_POSTS) {
    return { status: HTTP_STATUS_OK, body: { item: null } };
  }
  try {
    const item = await publishedContentBySlug({ databaseUrl, slug });
    if (!item || item.collection !== COLLECTION_BLOG) {
      return { status: HTTP_STATUS_OK, body: { item: null } };
    }
    const nextPayload = {
      ...item.payload,
      [PAYLOAD_VIEWS_KEY]: payloadViews(item.payload) + NUMBER_ONE,
    };
    const sql = neon(databaseUrl);
    await sql`
      UPDATE cms_content
      SET payload = ${JSON.stringify(nextPayload)}
      WHERE id = ${item.id}
    `;
    return { status: HTTP_STATUS_OK, body: { item: { ...item, payload: nextPayload } } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const listAdminContent = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? EMPTY_STRING;
  let collection: string | undefined;
  if (last && last !== PATH_SEGMENT_GET_CONTENT) {
    collection = last;
  }
  try {
    const sql = neon(databaseUrl);
    const rows = collection
      ? ((await sql`
          SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
          FROM cms_content
          WHERE collection = ${collection}
          ORDER BY updated_at DESC
        `) as CmsAdminContentRow[])
      : ((await sql`
          SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
          FROM cms_content
          ORDER BY collection ASC, updated_at DESC
        `) as CmsAdminContentRow[]);
    if (collection) {
      return { status: HTTP_STATUS_OK, body: { collection, items: rows.map(mapContentItem) } };
    }
    return { status: HTTP_STATUS_OK, body: { items: rows.map(mapContentItem) } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const upsertAdminContent = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl } = params;
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const body = await readUnknownObject(params.request);
  const collection = typeof body.collection === 'string' ? body.collection.trim() : EMPTY_STRING;
  const slug = typeof body.slug === 'string' ? body.slug.trim() : EMPTY_STRING;
  const locale = typeof body.locale === 'string' ? body.locale.trim() : DEFAULT_LOCALE;
  const title = typeof body.title === 'string' ? body.title.trim() : EMPTY_STRING;
  const status = typeof body.status === 'string' ? body.status.trim() : STATUS_PUBLISHED;
  let payload: Record<string, unknown> = {};
  if (body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)) {
    payload = body.payload as Record<string, unknown>;
  }
  if (!collection || !slug) {
    return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_COLLECTION_SLUG } };
  }
  try {
    const sql = neon(databaseUrl);
    const payloadJson = JSON.stringify(payload);
    const rows = (await sql`
      INSERT INTO cms_content (collection, slug, locale, title, payload, status)
      VALUES (
        ${collection},
        ${slug},
        ${locale},
        ${title},
        ${payloadJson},
        ${status}
      )
      ON CONFLICT (collection, slug, locale)
      DO UPDATE SET
        title = EXCLUDED.title,
        payload = EXCLUDED.payload,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING id, collection, slug, locale, title, payload, status, created_at, updated_at
    `) as CmsAdminContentRow[];
    const row = firstRow<CmsAdminContentRow>(rows);
    if (!row) {
      return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
    }
    return { status: HTTP_STATUS_CREATED, body: { item: mapContentItem(row) } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const handleAdminContent = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  if (params.request.method === METHOD_POST) {
    return upsertAdminContent(params);
  }
  return listAdminContent(params);
};
