import { NUMBER_ZERO, NUMBER_NINETEEN } from '@const/numbers.const';
import { ISO_DATE_SEP } from '@const/strings.const';
import type { AuditLogRecord } from '@sdk/modules/audit';
import type { VersionInfo } from '@sdk/modules/version';
import {
  DEVELOPER_BUILD_SEP,
  DEVELOPER_DOCKER_SEP,
  DEVELOPER_ROW_IDS,
  DEVELOPER_SECONDS_PER_HOUR,
  DEVELOPER_SECONDS_PER_MINUTE,
  DEVELOPER_SPACE,
} from './DeveloperPages.const';
import type { DeveloperAuditRow, DeveloperRow, DeveloperRowId, DeveloperRowLabels } from './DeveloperPages.types';

export const splitUptime = (uptimeSec: number): { hours: number; minutes: number } => {
  const safe = uptimeSec > NUMBER_ZERO ? uptimeSec : NUMBER_ZERO;
  const hours = Math.floor(safe / DEVELOPER_SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (safe % DEVELOPER_SECONDS_PER_HOUR) / DEVELOPER_SECONDS_PER_MINUTE,
  );
  return { hours, minutes };
};

export const displayValue = (value: string, emptyLabel: string): string => {
  if (!value) {
    return emptyLabel;
  }
  return value;
};

const dockerValue = (info: VersionInfo, emptyLabel: string): string => {
  if (!info.docker.running) {
    return emptyLabel;
  }
  const parts = [info.docker.hostname, info.docker.image, info.docker.containerName].filter(
    (part) => part,
  );
  if (parts.length === NUMBER_ZERO) {
    return emptyLabel;
  }
  return parts.join(DEVELOPER_DOCKER_SEP);
};

const buildValue = (info: VersionInfo, emptyLabel: string): string => {
  const parts = [info.build.sha, info.build.time, info.build.number].filter((part) => part);
  if (parts.length === NUMBER_ZERO) {
    return emptyLabel;
  }
  return parts.join(DEVELOPER_BUILD_SEP);
};

const platformValue = (info: VersionInfo, emptyLabel: string): string => {
  const parts = [info.platform, info.arch].filter((part) => part);
  if (parts.length === NUMBER_ZERO) {
    return emptyLabel;
  }
  return parts.join(DEVELOPER_SPACE);
};

export const buildDeveloperRows = (params: {
  info: VersionInfo;
  labels: DeveloperRowLabels;
  emptyLabel: string;
  uptimeText: string;
}): DeveloperRow[] => {
  const { info, labels, emptyLabel, uptimeText } = params;
  const values: Record<DeveloperRowId, string> = {
    product: displayValue(info.product, emptyLabel),
    version: displayValue(info.version, emptyLabel),
    portal: displayValue(info.portal, emptyLabel),
    node: displayValue(info.node, emptyLabel),
    platform: platformValue(info, emptyLabel),
    env: displayValue(info.env, emptyLabel),
    uptime: uptimeText,
    docker: dockerValue(info, emptyLabel),
    build: buildValue(info, emptyLabel),
  };
  return DEVELOPER_ROW_IDS.map((id) => ({
    id,
    label: labels[id],
    value: values[id],
  }));
};

export const formatAuditAt = (value: string): string =>
  value.slice(NUMBER_ZERO, NUMBER_NINETEEN).replace(ISO_DATE_SEP, DEVELOPER_SPACE);

export const mapAuditRows = (
  items: AuditLogRecord[],
  emptyLabel: string,
): DeveloperAuditRow[] =>
  items.map((item) => ({
    id: item.id,
    action: item.action,
    resource: item.resource || emptyLabel,
    userId: item.userId || emptyLabel,
    ipAddress: item.ipAddress || emptyLabel,
    createdAt: formatAuditAt(item.createdAt),
  }));
