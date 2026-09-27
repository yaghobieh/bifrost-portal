import { INK_API_URL } from '@const/billing.const';
import {
  NUMBER_SIXTY,
  NUMBER_THREE_THOUSAND_SIX_HUNDRED,
  NUMBER_ZERO,
} from '@const/numbers.const';
import { EMPTY_STRING, MIDDLE_DOT } from '@const/strings.const';
import { TARGET_CMS_SPRINT, TARGET_CMS_VERSION } from '@sdk/modules/version';
import { formatBlogDate } from '@pages/BlogIndex/BlogIndex.utils';
import {
  STATUS_BAR_DEG,
  STATUS_BAR_DOWN,
  STATUS_BAR_OK,
  STATUS_DEGRADED,
  STATUS_DOWN,
  STATUS_MS_UNIT,
  STATUS_OK,
  STATUS_PILL_DEG,
  STATUS_PILL_DOWN,
  STATUS_PILL_OK,
  STATUS_PREVIEW_UPTIME_SEC,
  STATUS_SERVICE_API,
  STATUS_SERVICE_AUTH,
  STATUS_SERVICE_DATABASE,
  STATUS_SERVICE_MEDIA,
  STATUS_STATUS_PATH,
} from './Status.const';
import type {
  StatusHealthState,
  StatusIncidentProbe,
  StatusIncidentRow,
  StatusPageData,
  StatusServiceProbe,
  StatusServiceRow,
  StatusUptimeKind,
} from './Status.types';

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

const readNumber = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return NUMBER_ZERO;
  }
  return value;
};

const readBoolean = (value: unknown): boolean => Boolean(value);

const healthFromStatus = (value: string): StatusHealthState => {
  if (value === STATUS_OK) {
    return STATUS_OK;
  }
  if (value === STATUS_DEGRADED) {
    return STATUS_DEGRADED;
  }
  return STATUS_DOWN;
};

const readServiceProbe = (value: unknown): StatusServiceProbe | null => {
  if (!isRecord(value)) {
    return null;
  }
  const id = readString(value.id);
  if (!id) {
    return null;
  }
  return {
    id,
    ok: readBoolean(value.ok),
    latencyMs: readNumber(value.latencyMs),
    configured: value.configured !== false,
  };
};

const readIncidentProbe = (value: unknown): StatusIncidentProbe | null => {
  if (!isRecord(value)) {
    return null;
  }
  const id = readString(value.id);
  const title = readString(value.title);
  if (!id || !title) {
    return null;
  }
  return {
    id,
    title,
    date: readString(value.date),
    durationMin: readNumber(value.durationMin),
    resolved: value.resolved !== false,
  };
};

const payloadToPage = (value: unknown): StatusPageData => {
  if (!isRecord(value)) {
    return emptyStatusPage();
  }
  const servicesRaw = value.services;
  const incidentsRaw = value.incidents;
  const services = Array.isArray(servicesRaw)
    ? servicesRaw.map(readServiceProbe).filter((row): row is StatusServiceProbe => Boolean(row))
    : [];
  const incidents = Array.isArray(incidentsRaw)
    ? incidentsRaw.map(readIncidentProbe).filter((row): row is StatusIncidentProbe => Boolean(row))
    : [];
  const installed = readString(value.portal) || readString(value.version);
  return {
    health: healthFromStatus(readString(value.status)),
    db: readBoolean(value.db),
    version: readString(value.version),
    portal: readString(value.portal),
    updateAvailable: Boolean(installed) && installed !== TARGET_CMS_VERSION && installed !== TARGET_CMS_SPRINT,
    uptimeSec: readNumber(value.uptimeSec),
    services,
    incidents,
  };
};

export const emptyStatusPage = (): StatusPageData => ({
  health: STATUS_DOWN,
  db: false,
  version: EMPTY_STRING,
  portal: EMPTY_STRING,
  updateAvailable: false,
  uptimeSec: NUMBER_ZERO,
  services: [],
  incidents: [],
});

export const fetchStatusPage = async (): Promise<StatusPageData> => {
  try {
    const response = await fetch(`${INK_API_URL}${STATUS_STATUS_PATH}`);
    if (!response.ok) {
      return emptyStatusPage();
    }
    const json: unknown = await response.json();
    return payloadToPage(json);
  } catch {
    return emptyStatusPage();
  }
};

export const previewStatusPage = (): StatusPageData => ({
  health: STATUS_OK,
  db: true,
  version: TARGET_CMS_SPRINT,
  portal: TARGET_CMS_SPRINT,
  updateAvailable: false,
  uptimeSec: STATUS_PREVIEW_UPTIME_SEC,
  services: [],
  incidents: [],
});

export const formatUptime = (seconds: number, template: string, liveLabel: string): string => {
  if (seconds <= NUMBER_ZERO) {
    return liveLabel;
  }
  const hours = Math.floor(seconds / NUMBER_THREE_THOUSAND_SIX_HUNDRED);
  const mins = Math.floor((seconds % NUMBER_THREE_THOUSAND_SIX_HUNDRED) / NUMBER_SIXTY);
  return template.replace('{hours}', String(hours)).replace('{mins}', String(mins));
};

export const serviceName = (translate: (key: string) => string, id: string): string => {
  if (id === STATUS_SERVICE_API) {
    return translate('status.svcApi');
  }
  if (id === STATUS_SERVICE_MEDIA) {
    return translate('status.svcMedia');
  }
  if (id === STATUS_SERVICE_DATABASE) {
    return translate('status.svcDatabase');
  }
  if (id === STATUS_SERVICE_AUTH) {
    return translate('status.svcAuth');
  }
  return id;
};

export const servicePillKind = (probe: StatusServiceProbe): StatusUptimeKind => {
  if (!probe.configured) {
    return STATUS_PILL_DEG;
  }
  if (probe.ok) {
    return STATUS_PILL_OK;
  }
  return STATUS_PILL_DOWN;
};

export const serviceLabel = (translate: (key: string) => string, probe: StatusServiceProbe): string => {
  if (!probe.configured) {
    return translate('status.svcNotConfigured');
  }
  if (probe.ok) {
    return translate('status.healthOk');
  }
  return translate('status.svcDegraded');
};

export const serviceRows = (
  translate: (key: string) => string,
  probes: StatusServiceProbe[],
): StatusServiceRow[] =>
  probes.map((probe) => ({
    id: probe.id,
    name: serviceName(translate, probe.id),
    latency: probe.configured ? `${probe.latencyMs}${STATUS_MS_UNIT}` : EMPTY_STRING,
    ok: probe.ok,
    configured: probe.configured,
    label: serviceLabel(translate, probe),
    pillKind: servicePillKind(probe),
  }));

export const uptimeBarKinds = (probes: StatusServiceProbe[]): StatusUptimeKind[] =>
  probes.map((probe) => {
    if (!probe.configured) {
      return STATUS_BAR_DEG;
    }
    if (probe.ok) {
      return STATUS_BAR_OK;
    }
    return STATUS_BAR_DOWN;
  });

export const incidentRows = (
  translate: (key: string) => string,
  incidents: StatusIncidentProbe[],
): StatusIncidentRow[] =>
  incidents.map((incident) => {
    const dateLabel = formatBlogDate(incident.date, false);
    if (incident.durationMin <= NUMBER_ZERO) {
      return {
        id: incident.id,
        title: incident.title,
        date: dateLabel,
        resolved: incident.resolved,
      };
    }
    return {
      id: incident.id,
      title: incident.title,
      date: `${dateLabel}${MIDDLE_DOT}${translate('status.incidentDuration').replace('{count}', String(incident.durationMin))}`,
      resolved: incident.resolved,
    };
  });

export const versionDisplay = (data: StatusPageData): string => {
  if (data.portal) {
    return data.portal;
  }
  if (data.version) {
    return data.version;
  }
  return TARGET_CMS_SPRINT;
};

export const healthValue = (translate: (key: string) => string, health: StatusHealthState): string => {
  if (health === STATUS_OK) {
    return translate('status.healthOk');
  }
  return translate('status.healthDown');
};
