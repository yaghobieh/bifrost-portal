import { neon } from '@neondatabase/serverless';
import {
  COLLECTION_INCIDENTS,
  COLLECTION_PAGES,
  CLOUDINARY_IMAGE_UPLOAD_PATH,
  CLOUDINARY_RES_HOST,
  EMPTY_STRING,
  ENV_CLOUDINARY_CLOUD_NAME,
  HEALTH_DEGRADED,
  HEALTH_DOWN,
  HEALTH_OK,
  HTTP_STATUS_OK,
  METHOD_HEAD,
  NUMBER_ZERO,
  PACKAGE_VERSION,
  PAGE_KIND_INCIDENT,
  PAYLOAD_INCIDENT_DATE_KEY,
  PAYLOAD_INCIDENT_DURATION_KEY,
  PAYLOAD_INCIDENT_RESOLVED_KEY,
  PRODUCT_BIFROST,
  SPRINT_VERSION,
  STATUS_PROBE_TIMEOUT_MS,
  STATUS_SERVICE_API,
  STATUS_SERVICE_AUTH,
  STATUS_SERVICE_DATABASE,
  STATUS_SERVICE_MEDIA,
} from './cmsAuth.const';
import type { CmsAdminContentItem, CmsAdminContentRow, CmsAuthResult } from './cmsAuth.types';
import { firstRow } from './cmsAuth.utils';
import {
  CMS_CONTENT_STATUS_PUBLISHED,
  CMS_DOCS_LOCALE,
} from './cmsDocs.const';

type StatusServiceProbe = {
  id: string;
  ok: boolean;
  latencyMs: number;
  configured: boolean;
};

type StatusIncident = {
  id: string;
  title: string;
  date: string;
  durationMin: number;
  resolved: boolean;
};

type TimedProbeResult = {
  ok: boolean;
  latencyMs: number;
};

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

const timedProbe = async (run: () => Promise<boolean>): Promise<TimedProbeResult> => {
  const started = Date.now();
  try {
    const ok = await run();
    return { ok, latencyMs: Date.now() - started };
  } catch {
    return { ok: false, latencyMs: Date.now() - started };
  }
};

const pingDatabase = async (databaseUrl: string): Promise<boolean> => {
  const sql = neon(databaseUrl);
  const rows = await sql`SELECT 1 AS ok`;
  return Array.isArray(rows) && rows.length > NUMBER_ZERO;
};

const pingUsers = async (databaseUrl: string): Promise<boolean> => {
  const sql = neon(databaseUrl);
  const rows = await sql`SELECT id FROM users LIMIT 1`;
  return Array.isArray(rows);
};

const cloudNameFromEnv = (): string => {
  const raw = process.env[ENV_CLOUDINARY_CLOUD_NAME];
  if (typeof raw !== 'string') {
    return EMPTY_STRING;
  }
  return raw.trim();
};

const probeMedia = async (): Promise<StatusServiceProbe> => {
  const cloudName = cloudNameFromEnv();
  if (!cloudName) {
    return {
      id: STATUS_SERVICE_MEDIA,
      ok: false,
      latencyMs: NUMBER_ZERO,
      configured: false,
    };
  }
  const started = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, STATUS_PROBE_TIMEOUT_MS);
    const response = await fetch(
      `${CLOUDINARY_RES_HOST}${cloudName}${CLOUDINARY_IMAGE_UPLOAD_PATH}`,
      { method: METHOD_HEAD, signal: controller.signal },
    );
    clearTimeout(timer);
    return {
      id: STATUS_SERVICE_MEDIA,
      ok: Boolean(response),
      latencyMs: Date.now() - started,
      configured: true,
    };
  } catch {
    return {
      id: STATUS_SERVICE_MEDIA,
      ok: false,
      latencyMs: Date.now() - started,
      configured: true,
    };
  }
};

const readDuration = (payload: Record<string, unknown>): number => {
  const raw = payload[PAYLOAD_INCIDENT_DURATION_KEY];
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }
  return NUMBER_ZERO;
};

const readResolved = (payload: Record<string, unknown>): boolean => {
  const raw = payload[PAYLOAD_INCIDENT_RESOLVED_KEY];
  if (typeof raw === 'boolean') {
    return raw;
  }
  return true;
};

const readIncidentDate = (item: CmsAdminContentItem): string => {
  const raw = item.payload[PAYLOAD_INCIDENT_DATE_KEY];
  if (typeof raw === 'string' && raw) {
    return raw;
  }
  return item.updatedAt;
};

const mapIncident = (item: CmsAdminContentItem): StatusIncident => ({
  id: item.id,
  title: item.title || item.slug,
  date: readIncidentDate(item),
  durationMin: readDuration(item.payload),
  resolved: readResolved(item.payload),
});

const listIncidents = async (databaseUrl: string): Promise<StatusIncident[]> => {
  const sql = neon(databaseUrl);
  const rows = (await sql`
    SELECT id, collection, slug, locale, title, payload, status, created_at, updated_at
    FROM cms_content
    WHERE status = ${CMS_CONTENT_STATUS_PUBLISHED}
      AND locale = ${CMS_DOCS_LOCALE}
      AND (
        collection = ${COLLECTION_INCIDENTS}
        OR (
          collection = ${COLLECTION_PAGES}
          AND payload->>'kind' = ${PAGE_KIND_INCIDENT}
        )
      )
    ORDER BY updated_at DESC
  `) as CmsAdminContentRow[];
  return rows.map(mapItem).map(mapIncident);
};

const overallStatus = (params: {
  database: TimedProbeResult;
  auth: TimedProbeResult;
  media: StatusServiceProbe;
}): string => {
  const { database, auth, media } = params;
  if (!database.ok) {
    return HEALTH_DOWN;
  }
  if (!auth.ok) {
    return HEALTH_DEGRADED;
  }
  if (media.configured && !media.ok) {
    return HEALTH_DEGRADED;
  }
  return HEALTH_OK;
};

export const statusPayload = async (databaseUrl: string): Promise<CmsAuthResult> => {
  if (!databaseUrl) {
    return {
      status: HTTP_STATUS_OK,
      body: {
        status: HEALTH_DOWN,
        service: PRODUCT_BIFROST,
        db: false,
        version: PACKAGE_VERSION,
        portal: PACKAGE_VERSION,
        sprint: SPRINT_VERSION,
        uptimeSec: NUMBER_ZERO,
        services: [],
        incidents: [],
      },
    };
  }
  const started = Date.now();
  const [database, auth, media, incidents] = await Promise.all([
    timedProbe(() => pingDatabase(databaseUrl)),
    timedProbe(() => pingUsers(databaseUrl)),
    probeMedia(),
    listIncidents(databaseUrl).catch(() => [] as StatusIncident[]),
  ]);
  const api: StatusServiceProbe = {
    id: STATUS_SERVICE_API,
    ok: true,
    latencyMs: Date.now() - started,
    configured: true,
  };
  return {
    status: HTTP_STATUS_OK,
    body: {
      status: overallStatus({ database, auth, media }),
      service: PRODUCT_BIFROST,
      db: database.ok,
      version: PACKAGE_VERSION,
      portal: PACKAGE_VERSION,
      sprint: SPRINT_VERSION,
      uptimeSec: NUMBER_ZERO,
      services: [
        api,
        {
          id: STATUS_SERVICE_DATABASE,
          ok: database.ok,
          latencyMs: database.latencyMs,
          configured: true,
        },
        {
          id: STATUS_SERVICE_AUTH,
          ok: auth.ok,
          latencyMs: auth.latencyMs,
          configured: true,
        },
        media,
      ],
      incidents,
    },
  };
};
