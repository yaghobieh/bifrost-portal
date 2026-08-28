import { neon } from '@neondatabase/serverless';
import {
  ERROR_DATABASE_UNAVAILABLE,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from './cmsDocs.const';
import {
  EMPTY_STRING,
  ERROR_EMAIL_NAME_PASSWORD,
  ERROR_EMAIL_TAKEN,
  ERROR_INTERNAL,
  ERROR_INVALID_CREDENTIALS,
  ERROR_NOT_FOUND,
  ERROR_UNAUTHORIZED,
  ERROR_USERNAME_PASSWORD,
  HEALTH_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_UNAUTHORIZED,
  JWT_SECRET_DEV_FALLBACK,
  PACKAGE_VERSION,
  PLAN_FREE,
  PROVIDER_PASSWORD,
  ROLE_USER,
  SERVICE_NAME,
  SPRINT_VERSION,
  WEEK_DAY_COUNT,
} from './cmsAuth.const';
import type { CmsAuthResult, CmsJwtPayload, CmsUserRow } from './cmsAuth.types';
import {
  bearerToken,
  firstRow,
  hashPassword,
  jwtSecrets,
  readJsonBody,
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

const requireUser = async (params: {
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

const isAuthResult = (value: { user: CmsUserRow } | CmsAuthResult): value is CmsAuthResult =>
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
