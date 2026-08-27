import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import {
  BEARER_PREFIX,
  COLON,
  CONTENT_TYPE_JSON,
  CORS_ALLOW_HEADERS,
  CORS_ALLOW_METHODS,
  DOT,
  EMPTY_STRING,
  ENV_DATABASE_URL,
  ENV_JWT_SECRET,
  HASH_ALG,
  HEADER_AUTHORIZATION,
  HEADER_CONTENT_TYPE,
  HEADER_ORIGIN,
  HMAC_ALG,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_OK,
  JWT_ALG,
  JWT_HEADER_ALG_KEY,
  JWT_HEADER_TYP_KEY,
  JWT_SECRET_CHANGE_ME,
  JWT_SECRET_DEV_FALLBACK,
  JWT_TYP,
  PLAN_FREE,
} from './cmsApi.const';
import type {
  CmsApiRequest,
  CmsApiResponse,
  CmsJsonBody,
  CmsJwtPayload,
  CmsPublicUser,
  CmsUserRow,
} from './cmsApi.types';

export const str = (value: unknown): string => {
  if (typeof value !== 'string') {
    return EMPTY_STRING;
  }
  return value.trim();
};

export const applyCors = (req: CmsApiRequest, res: CmsApiResponse): void => {
  const origin = req.headers[HEADER_ORIGIN];
  if (typeof origin === 'string' && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', HEADER_ORIGIN);
  }
  res.setHeader('Access-Control-Allow-Headers', CORS_ALLOW_HEADERS);
  res.setHeader('Access-Control-Allow-Methods', CORS_ALLOW_METHODS);
};

export const sendJson = (
  res: CmsApiResponse,
  status: number,
  body: unknown,
): void => {
  res.statusCode = status;
  res.setHeader(HEADER_CONTENT_TYPE, CONTENT_TYPE_JSON);
  res.end(JSON.stringify(body));
};

export const sendNoContent = (res: CmsApiResponse): void => {
  res.statusCode = HTTP_STATUS_NO_CONTENT;
  res.end();
};

export const sendError = (
  res: CmsApiResponse,
  status: number,
  message: string,
): void => {
  sendJson(res, status, { error: message });
};

export const requestPath = (req: CmsApiRequest): string => {
  const raw = req.url || EMPTY_STRING;
  const q = raw.indexOf('?');
  if (q < 0) {
    return raw;
  }
  return raw.slice(0, q);
};

export const requestMethod = (req: CmsApiRequest): string =>
  (req.method || EMPTY_STRING).toUpperCase();

const parseJsonObject = (raw: string): CmsJsonBody => {
  if (!raw) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as CmsJsonBody;
  } catch {
    return {};
  }
};

export const readJsonBody = async (req: CmsApiRequest): Promise<CmsJsonBody> => {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body as CmsJsonBody;
  }
  if (typeof req.body === 'string') {
    return parseJsonObject(req.body);
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return parseJsonObject(Buffer.concat(chunks).toString('utf8'));
};

export const jwtSecrets = (): string[] => {
  const fromEnv = str(process.env[ENV_JWT_SECRET]);
  const list = [fromEnv, JWT_SECRET_CHANGE_ME, JWT_SECRET_DEV_FALLBACK];
  const unique: string[] = [];
  for (const secret of list) {
    if (!secret) {
      continue;
    }
    if (unique.includes(secret)) {
      continue;
    }
    unique.push(secret);
  }
  return unique;
};

export const hashPassword = (params: { password: string; secret: string }): string => {
  const { password, secret } = params;
  return createHash(HASH_ALG).update(`${secret}${COLON}${password}`).digest('hex');
};

export const safeEqual = (left: string, right: string): boolean => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
};

const encodeJwtPart = (value: unknown): string =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

export const signJwt = (params: {
  payload: CmsJwtPayload;
  secret: string;
  expiresInSec: number;
}): string => {
  const { payload, secret, expiresInSec } = params;
  const now = Math.floor(Date.now() / 1000);
  const header = encodeJwtPart({
    [JWT_HEADER_ALG_KEY]: JWT_ALG,
    [JWT_HEADER_TYP_KEY]: JWT_TYP,
  });
  const body = encodeJwtPart({
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  });
  const data = `${header}${DOT}${body}`;
  const sig = createHmac(HMAC_ALG, secret).update(data).digest('base64url');
  return `${data}${DOT}${sig}`;
};

export const verifyJwt = (params: {
  token: string;
  secrets: string[];
}): CmsJwtPayload | null => {
  const { token, secrets } = params;
  const parts = token.split(DOT);
  if (parts.length !== 3) {
    return null;
  }
  const [header, body, signature] = parts;
  if (!header || !body || !signature) {
    return null;
  }
  const data = `${header}${DOT}${body}`;
  for (const secret of secrets) {
    const expected = createHmac(HMAC_ALG, secret).update(data).digest('base64url');
    if (!safeEqual(signature, expected)) {
      continue;
    }
    try {
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as CmsJwtPayload;
      const exp = payload.exp;
      if (typeof exp === 'number' && exp * 1000 < Date.now()) {
        return null;
      }
      if (!payload.email || !payload.userId) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
  return null;
};

export const bearerToken = (req: CmsApiRequest): string => {
  const header = req.headers[HEADER_AUTHORIZATION];
  if (typeof header !== 'string') {
    return EMPTY_STRING;
  }
  if (!header.startsWith(BEARER_PREFIX)) {
    return EMPTY_STRING;
  }
  return header.slice(BEARER_PREFIX.length).trim();
};

export const toPublicUser = (row: CmsUserRow): CmsPublicUser => ({
  id: row.id,
  email: row.email,
  name: row.name,
  username: row.username,
  role: row.role,
  plan: row.plan || PLAN_FREE,
  premium: row.plan !== PLAN_FREE && Boolean(row.plan),
});

export const getSql = () => {
  const url = str(process.env[ENV_DATABASE_URL]);
  if (!url) {
    return null;
  }
  return neon(url);
};

export const firstRow = <T>(rows: unknown): T | null => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }
  return rows[0] as T;
};

export const sendOk = (res: CmsApiResponse, body: unknown): void => {
  sendJson(res, HTTP_STATUS_OK, body);
};
