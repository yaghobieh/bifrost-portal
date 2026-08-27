import {
  EMPTY_STRING,
  ERROR_DATABASE,
  ERROR_EMAIL_NAME_PASSWORD,
  ERROR_EMAIL_TAKEN,
  ERROR_INVALID_CREDENTIALS,
  ERROR_NOT_FOUND,
  ERROR_UNAUTHORIZED,
  ERROR_USERNAME_PASSWORD,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_UNAVAILABLE,
  JWT_EXPIRES_IN_SEC,
  JWT_SECRET_DEV_FALLBACK,
  PLAN_FREE,
  PROVIDER_PASSWORD,
  ROLE_USER,
  WEEK_DAY_COUNT,
} from './cmsApi.const';
import type {
  CmsApiRequest,
  CmsApiResponse,
  CmsJwtPayload,
  CmsUserRow,
} from './cmsApi.types';
import {
  bearerToken,
  firstRow,
  getSql,
  hashPassword,
  jwtSecrets,
  readJsonBody,
  safeEqual,
  sendError,
  sendOk,
  signJwt,
  str,
  toPublicUser,
  verifyJwt,
} from './cmsApi.utils';

const findUserByIdentity = async (identity: string): Promise<CmsUserRow | null> => {
  const sql = getSql();
  if (!sql) {
    return null;
  }
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

const matchPassword = (params: { hash: string; password: string }): string | null => {
  const { hash, password } = params;
  const secrets = jwtSecrets();
  for (const secret of secrets) {
    const candidate = hashPassword({ password, secret });
    if (safeEqual(hash, candidate)) {
      return secret;
    }
  }
  return null;
};

const requireUser = async (
  req: CmsApiRequest,
  res: CmsApiResponse,
): Promise<CmsUserRow | null> => {
  const token = bearerToken(req);
  const payload = verifyJwt({ token, secrets: jwtSecrets() });
  if (!payload?.email) {
    sendError(res, HTTP_STATUS_UNAUTHORIZED, ERROR_UNAUTHORIZED);
    return null;
  }
  const sql = getSql();
  if (!sql) {
    sendError(res, HTTP_STATUS_UNAVAILABLE, ERROR_DATABASE);
    return null;
  }
  const user = await findUserByIdentity(payload.email);
  if (!user) {
    sendError(res, HTTP_STATUS_NOT_FOUND, ERROR_NOT_FOUND);
    return null;
  }
  return user;
};

export const handleLogin = async (req: CmsApiRequest, res: CmsApiResponse): Promise<void> => {
  const sql = getSql();
  if (!sql) {
    sendError(res, HTTP_STATUS_UNAVAILABLE, ERROR_DATABASE);
    return;
  }
  const body = await readJsonBody(req);
  const identity = str(body.username) || str(body.email);
  const password = str(body.password);
  if (!identity || !password) {
    sendError(res, HTTP_STATUS_BAD_REQUEST, ERROR_USERNAME_PASSWORD);
    return;
  }
  const user = await findUserByIdentity(identity);
  if (!user?.password_hash) {
    sendError(res, HTTP_STATUS_UNAUTHORIZED, ERROR_INVALID_CREDENTIALS);
    return;
  }
  const secret = matchPassword({ hash: user.password_hash, password });
  if (!secret) {
    sendError(res, HTTP_STATUS_UNAUTHORIZED, ERROR_INVALID_CREDENTIALS);
    return;
  }
  const payload: CmsJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const token = signJwt({ payload, secret, expiresInSec: JWT_EXPIRES_IN_SEC });
  sendOk(res, { user: toPublicUser(user), token });
};

export const handleRegister = async (req: CmsApiRequest, res: CmsApiResponse): Promise<void> => {
  const sql = getSql();
  if (!sql) {
    sendError(res, HTTP_STATUS_UNAVAILABLE, ERROR_DATABASE);
    return;
  }
  const body = await readJsonBody(req);
  const email = str(body.email);
  const name = str(body.name);
  const password = str(body.password);
  const username = str(body.username) || null;
  if (!email || !name || !password) {
    sendError(res, HTTP_STATUS_BAD_REQUEST, ERROR_EMAIL_NAME_PASSWORD);
    return;
  }
  const existing = await findUserByIdentity(email);
  if (existing) {
    sendError(res, HTTP_STATUS_CONFLICT, ERROR_EMAIL_TAKEN);
    return;
  }
  const secrets = jwtSecrets();
  const secret = secrets[0] || JWT_SECRET_DEV_FALLBACK;
  const passwordHash = hashPassword({ password, secret });
  const rows = await sql`
    INSERT INTO users (email, name, username, password_hash, provider, role)
    VALUES (${email}, ${name}, ${username}, ${passwordHash}, ${PROVIDER_PASSWORD}, ${ROLE_USER})
    RETURNING id, email, name, username, password_hash, role, provider, provider_id, created_at
  `;
  const created = firstRow<Omit<CmsUserRow, 'plan'>>(rows);
  if (!created) {
    sendError(res, HTTP_STATUS_UNAVAILABLE, ERROR_DATABASE);
    return;
  }
  const user: CmsUserRow = { ...created, plan: PLAN_FREE };
  const payload: CmsJwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const token = signJwt({ payload, secret, expiresInSec: JWT_EXPIRES_IN_SEC });
  sendOk(res, { user: toPublicUser(user), token });
};

export const handleMe = async (req: CmsApiRequest, res: CmsApiResponse): Promise<void> => {
  const user = await requireUser(req, res);
  if (!user) {
    return;
  }
  sendOk(res, { user: toPublicUser(user) });
};

export const handleDashboard = async (req: CmsApiRequest, res: CmsApiResponse): Promise<void> => {
  const user = await requireUser(req, res);
  if (!user) {
    return;
  }
  const weekly = Array.from({ length: WEEK_DAY_COUNT }, () => 0);
  sendOk(res, {
    user: toPublicUser(user),
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
  });
};

export const handleEmptyItems = async (
  req: CmsApiRequest,
  res: CmsApiResponse,
): Promise<void> => {
  const user = await requireUser(req, res);
  if (!user) {
    return;
  }
  sendOk(res, { items: [] });
};

export const handleEmptyPages = async (
  req: CmsApiRequest,
  res: CmsApiResponse,
): Promise<void> => {
  const user = await requireUser(req, res);
  if (!user) {
    return;
  }
  sendOk(res, { pages: [] });
};

export const handleEmptyNotifications = async (
  req: CmsApiRequest,
  res: CmsApiResponse,
): Promise<void> => {
  const user = await requireUser(req, res);
  if (!user) {
    return;
  }
  sendOk(res, { items: [], unread: 0, redis: false });
};

export const handleOauthStart = async (
  _req: CmsApiRequest,
  res: CmsApiResponse,
): Promise<void> => {
  sendOk(res, { url: EMPTY_STRING, state: EMPTY_STRING, stub: true });
};
