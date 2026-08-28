import { BIFROST_API_URL, INK_API_URL } from '@const/billing.const';
import { CMS_CHANGELOG_SLUG, DEFAULT_API_BASE, EMPTY_STRING, PUBLIC_PAGES_PATH } from '@const/strings.const';
import { NUMBER_ZERO } from '@const/numbers.const';
import { useApi } from '@sdk/http';
import {
  BIFROST_PAGES_PATH,
  BIFROST_VERSION_PATH,
  CHANGELOG_SLUG_QUERY,
  CMS_VERSION_PATH,
  NOTES_JOIN,
  PAYLOAD_BODY_KEY,
  PAYLOAD_LEAD_KEY,
  TARGET_CMS_SPRINT,
  TARGET_CMS_VERSION,
} from './version.const';
import type { VersionInfo, WhatsNewCopy } from './version.types';

export const EMPTY_WHATS_NEW: WhatsNewCopy = {
  title: EMPTY_STRING,
  lead: EMPTY_STRING,
  body: EMPTY_STRING,
};

export const EMPTY_VERSION_INFO: VersionInfo = {
  product: EMPTY_STRING,
  version: EMPTY_STRING,
  sprint: EMPTY_STRING,
  ink: EMPTY_STRING,
  portal: EMPTY_STRING,
  node: EMPTY_STRING,
  platform: EMPTY_STRING,
  arch: EMPTY_STRING,
  env: EMPTY_STRING,
  uptimeSec: NUMBER_ZERO,
  docker: {
    running: false,
    hostname: EMPTY_STRING,
    image: EMPTY_STRING,
    containerName: EMPTY_STRING,
  },
  build: {
    sha: EMPTY_STRING,
    time: EMPTY_STRING,
    number: EMPTY_STRING,
  },
  packages: {},
  notes: EMPTY_STRING,
};

const isVersionInfo = (value: unknown): value is VersionInfo => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.version === 'string' && typeof record.ink === 'string';
};

const fetchFrom = async (url: string): Promise<VersionInfo | null> => {
  if (!url) {
    return null;
  }
  try {
    const response = await useApi(url, undefined, {
      silent: true,
      onError: () => undefined,
    });
    if (!response.ok) {
      return null;
    }
    const data: unknown = await response.json();
    return isVersionInfo(data) ? data : null;
  } catch {
    return null;
  }
};

const nestBase = (): string => BIFROST_API_URL || DEFAULT_API_BASE;

const notesFromCopy = (copy: WhatsNewCopy): string => {
  const parts = [copy.lead, copy.body].filter((part) => part.length > NUMBER_ZERO);
  if (parts.length > NUMBER_ZERO) {
    return parts.join(NOTES_JOIN);
  }
  return copy.title;
};

const whatsNewFromNest = async (): Promise<WhatsNewCopy | null> => {
  const base = nestBase();
  if (!base) {
    return null;
  }
  try {
    const params = new URLSearchParams({ [CHANGELOG_SLUG_QUERY]: CMS_CHANGELOG_SLUG });
    const response = await useApi(`${base}${BIFROST_PAGES_PATH}?${params.toString()}`, undefined, {
      silent: true,
      onError: () => undefined,
    });
    if (!response.ok) {
      return null;
    }
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') {
      return null;
    }
    const record = data as { items?: unknown };
    if (!Array.isArray(record.items) || record.items.length === NUMBER_ZERO) {
      return null;
    }
    const first = record.items[NUMBER_ZERO] as {
      title?: unknown;
      body?: unknown;
      meta?: unknown;
    };
    const title = typeof first.title === 'string' ? first.title : EMPTY_STRING;
    const body = typeof first.body === 'string' ? first.body : EMPTY_STRING;
    const meta = first.meta && typeof first.meta === 'object' ? (first.meta as Record<string, unknown>) : {};
    const lead = typeof meta[PAYLOAD_LEAD_KEY] === 'string' ? meta[PAYLOAD_LEAD_KEY] : EMPTY_STRING;
    if (!title && !body && !lead) {
      return null;
    }
    return { title, lead, body };
  } catch {
    return null;
  }
};

export const fetchWhatsNew = async (): Promise<WhatsNewCopy> => {
  const fromNest = await whatsNewFromNest();
  if (fromNest) {
    return fromNest;
  }
  try {
    const response = await useApi(
      `${INK_API_URL}${PUBLIC_PAGES_PATH}/${encodeURIComponent(CMS_CHANGELOG_SLUG)}`,
      undefined,
      { silent: true, onError: () => undefined },
    );
    if (!response.ok) {
      return EMPTY_WHATS_NEW;
    }
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') {
      return EMPTY_WHATS_NEW;
    }
    const record = data as { item?: { title?: unknown; payload?: unknown } };
    const item = record.item;
    if (!item) {
      return EMPTY_WHATS_NEW;
    }
    const title = typeof item.title === 'string' ? item.title : EMPTY_STRING;
    const payload = item.payload && typeof item.payload === 'object' ? (item.payload as Record<string, unknown>) : {};
    const lead = typeof payload[PAYLOAD_LEAD_KEY] === 'string' ? payload[PAYLOAD_LEAD_KEY] : EMPTY_STRING;
    const body = typeof payload[PAYLOAD_BODY_KEY] === 'string' ? payload[PAYLOAD_BODY_KEY] : EMPTY_STRING;
    return { title, lead, body };
  } catch {
    return EMPTY_WHATS_NEW;
  }
};

const withPackages = (info: VersionInfo): Record<string, string> => {
  if (info.packages && typeof info.packages === 'object') {
    return info.packages;
  }
  return {};
};

const mergeVersionInfo = (
  fromNest: VersionInfo | null,
  fromCms: VersionInfo | null,
  notes: string,
): VersionInfo => {
  const base = fromNest || fromCms || EMPTY_VERSION_INFO;
  const other = fromNest && fromCms ? fromCms : null;
  return {
    ...EMPTY_VERSION_INFO,
    ...other,
    ...base,
    portal: (fromCms?.portal || fromNest?.portal || EMPTY_STRING),
    packages: {
      ...withPackages(fromCms || EMPTY_VERSION_INFO),
      ...withPackages(fromNest || EMPTY_VERSION_INFO),
    },
    notes,
    version: base.version || TARGET_CMS_VERSION,
    sprint: base.sprint || other?.sprint || TARGET_CMS_SPRINT,
  };
};

let pending: Promise<VersionInfo> | null = null;

const loadVersionInfo = async (): Promise<VersionInfo> => {
  const fromNest = await fetchFrom(`${nestBase()}${BIFROST_VERSION_PATH}`);
  const fromCms = await fetchFrom(`${INK_API_URL}${CMS_VERSION_PATH}`);
  const whatsNew = await fetchWhatsNew();
  return mergeVersionInfo(fromNest, fromCms, notesFromCopy(whatsNew));
};

export const fetchVersionInfo = (): Promise<VersionInfo> => {
  if (!pending) {
    pending = loadVersionInfo();
  }
  return pending;
};

export const resetVersionInfoCache = (): void => {
  pending = null;
};
