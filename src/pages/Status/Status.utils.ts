import { INK_API_URL } from '@const/billing.const';
import { EMPTY_STRING } from '@const/strings.const';
import { TARGET_CMS_VERSION } from '@sdk/modules/version';
import { STATUS_DOWN, STATUS_HEALTH_PATH, STATUS_OK, STATUS_VERSION_PATH } from './Status.const';
import type { StatusHealthState, StatusPageData } from './Status.types';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (!value) {
    return false;
  }
  return typeof value === 'object' && !Array.isArray(value);
};

const readString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return EMPTY_STRING;
  }
  return value;
};

const healthFromPayload = (value: unknown): { health: StatusHealthState; db: boolean; service: string } => {
  if (!isRecord(value)) {
    return { health: STATUS_DOWN, db: false, service: EMPTY_STRING };
  }
  const status = readString(value.status);
  const db = Boolean(value.db);
  const service = readString(value.service);
  if (status === STATUS_OK && db) {
    return { health: STATUS_OK, db: true, service };
  }
  if (status === STATUS_OK) {
    return { health: STATUS_OK, db: false, service };
  }
  return { health: STATUS_DOWN, db, service };
};

const versionFromPayload = (value: unknown): { version: string; portal: string } => {
  if (!isRecord(value)) {
    return { version: EMPTY_STRING, portal: EMPTY_STRING };
  }
  return {
    version: readString(value.version),
    portal: readString(value.portal),
  };
};

export const emptyStatusPage = (): StatusPageData => ({
  health: STATUS_DOWN,
  db: false,
  service: EMPTY_STRING,
  version: EMPTY_STRING,
  portal: EMPTY_STRING,
  updateAvailable: false,
});

export const fetchStatusPage = async (): Promise<StatusPageData> => {
  try {
    const [healthRes, versionRes] = await Promise.all([
      fetch(`${INK_API_URL}${STATUS_HEALTH_PATH}`),
      fetch(`${INK_API_URL}${STATUS_VERSION_PATH}`),
    ]);
    const healthJson: unknown = healthRes.ok ? await healthRes.json() : null;
    const versionJson: unknown = versionRes.ok ? await versionRes.json() : null;
    const health = healthFromPayload(healthJson);
    const version = versionFromPayload(versionJson);
    const installed = version.portal || version.version;
    return {
      health: health.health,
      db: health.db,
      service: health.service,
      version: version.version,
      portal: version.portal,
      updateAvailable: Boolean(installed) && installed !== TARGET_CMS_VERSION,
    };
  } catch {
    return emptyStatusPage();
  }
};
