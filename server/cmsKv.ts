import { neon } from '@neondatabase/serverless';
import {
  EMPTY_STRING,
  ERROR_INTERNAL,
  ERROR_INVALID_SETTINGS_KEY,
  ERROR_SETTINGS_VALUE_REQUIRED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  METHOD_GET,
  METHOD_PUT,
  QUERY_KEY,
  SETTINGS_BODY_VALUE,
  SETTINGS_KV_KEYS,
} from './cmsAuth.const';
import type { CmsAuthResult, CmsKvRow } from './cmsAuth.types';
import { isAuthResult, requireUser } from './cmsAuth';
import { firstRow, readUnknownObject } from './cmsAuth.utils';
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from './cmsDocs.const';

const isSettingsKey = (value: string): boolean => {
  for (const key of SETTINGS_KV_KEYS) {
    if (key === value) {
      return true;
    }
  }
  return false;
};

const keyFromUrl = (request: Request): string => {
  const url = new URL(request.url);
  const fromQuery = (url.searchParams.get(QUERY_KEY) ?? EMPTY_STRING).trim();
  if (fromQuery) {
    return fromQuery;
  }
  const parts = url.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? EMPTY_STRING;
  return last.trim();
};

const ensureKvTable = async (databaseUrl: string): Promise<void> => {
  const sql = neon(databaseUrl);
  await sql`
    CREATE TABLE IF NOT EXISTS cms_kv (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT 'null'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
};

const readValue = async (databaseUrl: string, key: string): Promise<unknown> => {
  await ensureKvTable(databaseUrl);
  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT key, value
    FROM cms_kv
    WHERE key = ${key}
    LIMIT 1
  `;
  const row = firstRow<CmsKvRow>(rows);
  if (!row) {
    return null;
  }
  return row.value;
};

const writeValue = async (params: {
  databaseUrl: string;
  key: string;
  value: unknown;
}): Promise<unknown> => {
  const { databaseUrl, key, value } = params;
  await ensureKvTable(databaseUrl);
  const sql = neon(databaseUrl);
  const json = JSON.stringify(value);
  const rows = await sql`
    INSERT INTO cms_kv (key, value, updated_at)
    VALUES (${key}, ${json}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = NOW()
    RETURNING key, value
  `;
  const row = firstRow<CmsKvRow>(rows);
  if (!row) {
    return value;
  }
  return row.value;
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
  const key = keyFromUrl(request);
  if (!isSettingsKey(key)) {
    return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_INVALID_SETTINGS_KEY } };
  }
  if (request.method === METHOD_GET) {
    try {
      const value = await readValue(databaseUrl, key);
      return { status: HTTP_STATUS_OK, body: { key, value } };
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
      const value = await writeValue({ databaseUrl, key, value: body[SETTINGS_BODY_VALUE] });
      return { status: HTTP_STATUS_OK, body: { key, value } };
    } catch {
      return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
    }
  }
  return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_INVALID_SETTINGS_KEY } };
};
