import { neon } from '@neondatabase/serverless';
import {
  COLLECTION_BLOG,
  COLLECTION_DOCS,
  COLLECTION_PAGES,
  DEFAULT_LOCALE,
  EMPTY_STRING,
  ERROR_COLLECTION_SLUG,
  ERROR_ID_REQUIRED,
  ERROR_INTERNAL,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
  METHOD_POST,
  PAYLOAD_BODY_KEY,
  PAYLOAD_LEAD_KEY,
  QUERY_ID,
  QUERY_SLUG,
  STATUS_PUBLISHED,
} from './cmsAuth.const';
import type { CmsAdminContentItem, CmsAdminContentRow, CmsAuthResult } from './cmsAuth.types';
import { isAuthResult, requireUser } from './cmsAuth';
import { firstRow, readUnknownObject } from './cmsAuth.utils';
import {
  CMS_CONTENT_STATUS_PUBLISHED,
  CMS_DOCS_LOCALE,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from './cmsDocs.const';

const toIso = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : value;

const parsePayload = (value: Record<string, unknown> | string): Record<string, unknown> => {
  if (typeof value === 'string') {
    return JSON.parse(value) as Record<string, unknown>;
  }
  return value ?? {};
};

const mapItem = (row: CmsAdminContentRow): CmsAdminContentItem => ({
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

const listRows = async (params: {
  databaseUrl: string;
  collection?: string;
}): Promise<CmsAdminContentRow[]> => {
  const { databaseUrl, collection } = params;
  const sql = neon(databaseUrl);
  if (collection) {
    const rows = await sql`
      SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
      FROM cms_content
      WHERE collection = ${collection}
      ORDER BY updated_at DESC
    `;
    return rows as CmsAdminContentRow[];
  }
  const rows = await sql`
    SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
    FROM cms_content
    ORDER BY collection ASC, updated_at DESC
  `;
  return rows as CmsAdminContentRow[];
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
  if (last && last !== 'get-content') {
    collection = last;
  }
  try {
    const rows = await listRows({ databaseUrl, collection });
    if (collection) {
      return { status: HTTP_STATUS_OK, body: { collection, items: rows.map(mapItem) } };
    }
    return { status: HTTP_STATUS_OK, body: { items: rows.map(mapItem) } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

const publishedBySlug = async (params: {
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
      return mapItem(row);
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
    const item = await publishedBySlug({ databaseUrl, slug });
    if (!item) {
      return { status: HTTP_STATUS_OK, body: { items: [] } };
    }
    const lead = payloadText(item.payload, PAYLOAD_LEAD_KEY);
    const body = payloadText(item.payload, PAYLOAD_BODY_KEY);
    return {
      status: HTTP_STATUS_OK,
      body: {
        items: [
          {
            title: item.title,
            body,
            meta: { lead },
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
    return { status: HTTP_STATUS_OK, body: { items: rows.map(mapItem) } };
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
  const slug = fromQuery || (parts[parts.length - 1] ?? EMPTY_STRING).trim();
  if (!slug) {
    return { status: HTTP_STATUS_OK, body: { item: null } };
  }
  try {
    const item = await publishedBySlug({ databaseUrl, slug });
    if (!item || item.collection !== COLLECTION_BLOG) {
      return { status: HTTP_STATUS_OK, body: { item: null } };
    }
    return { status: HTTP_STATUS_OK, body: { item } };
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
        ${payloadJson}::jsonb,
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
    return { status: HTTP_STATUS_CREATED, body: { item: mapItem(row) } };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};

export const deleteAdminContent = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const { databaseUrl, request } = params;
  const loaded = await requireUser(params);
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const url = new URL(request.url);
  const id = (url.searchParams.get(QUERY_ID) ?? EMPTY_STRING).trim();
  if (!id) {
    return { status: HTTP_STATUS_BAD_REQUEST, body: { error: ERROR_ID_REQUIRED } };
  }
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`
      DELETE FROM cms_content
      WHERE id = ${id}
      RETURNING id
    `) as { id: string }[];
    const row = firstRow<{ id: string }>(rows);
    if (!row) {
      return { status: HTTP_STATUS_OK, body: { ok: false, id } };
    }
    return { status: HTTP_STATUS_OK, body: { ok: true, id } };
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
