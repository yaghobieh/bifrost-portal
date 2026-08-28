import {
  BASE64_PAD,
  BASE64_PLUS,
  BASE64_SLASH,
  BASE64_URL_PLUS,
  BASE64_URL_SLASH,
  BEARER_PREFIX,
  COLON,
  DOT,
  EMPTY_STRING,
  ENV_JWT_SECRET,
  HASH_SHA256,
  HEADER_AUTHORIZATION,
  HEX_PAD_LENGTH,
  HEX_RADIX,
  HMAC_NAME,
  JWT_ALG,
  JWT_EXPIRES_IN_SEC,
  JWT_PART_COUNT,
  JWT_SECRET_CHANGE_ME,
  JWT_SECRET_DEV_FALLBACK,
  JWT_TYP,
  PLAN_FREE,
} from './cmsAuth.const';
import type { CmsJsonBody, CmsJwtPayload, CmsPublicUser, CmsUserRow } from './cmsAuth.types';

export const str = (value: unknown): string => {
  if (typeof value !== 'string') {
    return EMPTY_STRING;
  }
  return value.trim();
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

const bytesToBinary = (bytes: Uint8Array): string => {
  let binary = EMPTY_STRING;
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return binary;
};

const toBase64Url = (bytes: Uint8Array): string => {
  const encoded = btoa(bytesToBinary(bytes));
  return encoded
    .replaceAll(BASE64_PLUS, BASE64_URL_PLUS)
    .replaceAll(BASE64_SLASH, BASE64_URL_SLASH)
    .replaceAll(BASE64_PAD, EMPTY_STRING);
};

const utf8ToBase64Url = (value: string): string =>
  toBase64Url(new TextEncoder().encode(value));

const base64UrlToBytes = (value: string): Uint8Array => {
  const padded = value
    .replaceAll(BASE64_URL_PLUS, BASE64_PLUS)
    .replaceAll(BASE64_URL_SLASH, BASE64_SLASH);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest(HASH_SHA256, new TextEncoder().encode(value));
  const bytes = new Uint8Array(digest);
  let hex = EMPTY_STRING;
  for (const byte of bytes) {
    hex += byte.toString(HEX_RADIX).padStart(HEX_PAD_LENGTH, '0');
  }
  return hex;
};

export const hashPassword = async (params: { password: string; secret: string }): Promise<string> => {
  const { password, secret } = params;
  return sha256Hex(`${secret}${COLON}${password}`);
};

export const safeEqual = (left: string, right: string): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
};

const hmacSha256Base64Url = async (params: { secret: string; data: string }): Promise<string> => {
  const { secret, data } = params;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: HMAC_NAME, hash: HASH_SHA256 },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(HMAC_NAME, key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
};

export const signJwt = async (params: { payload: CmsJwtPayload; secret: string }): Promise<string> => {
  const { payload, secret } = params;
  const now = Math.floor(Date.now() / 1000);
  const header = utf8ToBase64Url(JSON.stringify({ alg: JWT_ALG, typ: JWT_TYP }));
  const body = utf8ToBase64Url(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + JWT_EXPIRES_IN_SEC,
    }),
  );
  const data = `${header}${DOT}${body}`;
  const signature = await hmacSha256Base64Url({ secret, data });
  return `${data}${DOT}${signature}`;
};

export const verifyJwt = async (params: {
  token: string;
  secrets: string[];
}): Promise<CmsJwtPayload | null> => {
  const { token, secrets } = params;
  const parts = token.split(DOT);
  if (parts.length !== JWT_PART_COUNT) {
    return null;
  }
  const [header, body, signature] = parts;
  if (!header || !body || !signature) {
    return null;
  }
  const data = `${header}${DOT}${body}`;
  for (const secret of secrets) {
    const expected = await hmacSha256Base64Url({ secret, data });
    if (!safeEqual(signature, expected)) {
      continue;
    }
    try {
      const json = new TextDecoder().decode(base64UrlToBytes(body));
      const payload = JSON.parse(json) as CmsJwtPayload;
      if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
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

export const bearerToken = (request: Request): string => {
  const header = request.headers.get(HEADER_AUTHORIZATION);
  if (!header) {
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

export const firstRow = <T>(rows: unknown): T | null => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }
  return rows[0] as T;
};

export const readUnknownObject = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
};

export const readJsonBody = async (request: Request): Promise<CmsJsonBody> => {
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as CmsJsonBody;
  } catch {
    return {};
  }
};
