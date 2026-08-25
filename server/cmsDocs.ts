import { neon } from '@neondatabase/serverless';
import {
  CMS_CONTENT_STATUS_PUBLISHED,
  CMS_DOCS_COLLECTION,
  CMS_DOCS_LOCALE,
} from './cmsDocs.const';

export type CmsDocsRow = {
  slug: string;
  title: string;
  status: string;
  updatedAt: string;
  payload: Record<string, unknown>;
};

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

const mapRow = (row: SqlDocsRow): CmsDocsRow => ({
  slug: row.slug,
  title: row.title,
  status: row.status,
  updatedAt: toIso(row.updated_at),
  payload: parsePayload(row.payload),
});

export const listPublishedDocs = async (databaseUrl: string): Promise<CmsDocsRow[]> => {
  const sql = neon(databaseUrl);
  const rows = (await sql`
    SELECT slug, title, status, updated_at, payload
    FROM cms_content
    WHERE collection = ${CMS_DOCS_COLLECTION}
      AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
      AND locale = ${CMS_DOCS_LOCALE}
    ORDER BY slug ASC
  `) as SqlDocsRow[];
  return rows.map(mapRow);
};

export const getPublishedDoc = async (
  databaseUrl: string,
  slug: string,
): Promise<CmsDocsRow | null> => {
  const sql = neon(databaseUrl);
  const rows = (await sql`
    SELECT slug, title, status, updated_at, payload
    FROM cms_content
    WHERE collection = ${CMS_DOCS_COLLECTION}
      AND slug = ${slug}
      AND status = ${CMS_CONTENT_STATUS_PUBLISHED}
      AND locale = ${CMS_DOCS_LOCALE}
    LIMIT 1
  `) as SqlDocsRow[];
  const row = rows[0];
  return row ? mapRow(row) : null;
};
