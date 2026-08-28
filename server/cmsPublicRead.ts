import { neon } from '@neondatabase/serverless';
import {
  API_BLOG_POSTS_PATH,
  COLLECTION_BLOG,
  COLLECTION_DOCS,
  COLLECTION_PAGES,
  EMPTY_STRING,
  ERROR_INTERNAL,
  HTTP_STATUS_OK,
  PATH_SEGMENT_POSTS,
  PAYLOAD_BODY_KEY,
  PAYLOAD_LEAD_KEY,
  QUERY_SLUG,
  SLASH_SIGN,
} from './cmsAuth.const';
import type { CmsAdminContentItem, CmsAdminContentRow, CmsAuthResult } from './cmsAuth.types';
import { firstRow } from './cmsAuth.utils';
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
  const last = parts[parts.length - 1] ?? EMPTY_STRING;
  const slug = fromQuery || last;
  if (!slug || slug === PATH_SEGMENT_POSTS) {
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

export const isBlogListPath = (pathname: string, slugQuery: string): boolean => {
  if (slugQuery) {
    return false;
  }
  const trimmed = pathname.endsWith(SLASH_SIGN) ? pathname.slice(0, -1) : pathname;
  return trimmed === API_BLOG_POSTS_PATH;
};
