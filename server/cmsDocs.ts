import { neon } from '@neondatabase/serverless';
import {
  CMS_CONTENT_STATUS_PUBLISHED,
  CMS_PAGES_COLLECTION,
  CMS_DOCS_LOCALE,
} from './cmsDocs.const';

export type CmsContentRow = {
  collection: string;
  slug: string;
  title: string;
  status: string;
  updatedAt: string;
  payload: Record<string, unknown>;
};

export type CmsDocsRow = CmsContentRow;

type SqlDocsRow = {
  slug: string;
  title: string;
  status: string;
  updated_at: string | Date;
  payload: Record<string, unknown> | string;
};

const toIso = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : value;

const parsePayload = (value: Record<string, unknown> | string): Record<string, unknown> => {
  if (typeof value === 'string') {
    return JSON.parse(value) as Record<string, unknown>;
  }
  return value ?? {};
};

const mapRow = (row: SqlDocsRow, collection: string): CmsContentRow => ({
  collection,
  slug: row.slug,
  title: row.title,
  status: row.status,
  updatedAt: toIso(row.updated_at),
  payload: parsePayload(row.payload),
});

export const listPublishedContent = async (
  databaseUrl: string,
  collection: string,
): Promise<CmsContentRow[]> => {
  const sql = neon(databaseUrl);
  const rows = (await sql`
    SELECT slug, title, status, updated_at, payload
    FROM cms_content
    WHERE collection = ${collection}
      AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
      AND locale = ${CMS_DOCS_LOCALE}
    ORDER BY slug ASC
  `) as SqlDocsRow[];
  return rows.map((row) => mapRow(row, collection));
};

export const getPublishedContent = async (
  databaseUrl: string,
  collection: string,
  slug: string,
): Promise<CmsContentRow | null> => {
  const sql = neon(databaseUrl);
  const rows = (await sql`
    SELECT slug, title, status, updated_at, payload
    FROM cms_content
    WHERE collection = ${collection}
      AND slug = ${slug}
      AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
      AND locale = ${CMS_DOCS_LOCALE}
    LIMIT 1
  `) as SqlDocsRow[];
  const row = rows[0];
  return row ? mapRow(row, collection) : null;
};

export const listPublishedDocs = (databaseUrl: string): Promise<CmsContentRow[]> =>
  listPublishedContent(databaseUrl, CMS_PAGES_COLLECTION);

export const getPublishedDoc = (databaseUrl: string, slug: string): Promise<CmsContentRow | null> =>
  getPublishedContent(databaseUrl, CMS_PAGES_COLLECTION, slug);

export const getPublishedPage = getPublishedDoc;
