export type DeveloperRowId =
  | 'product'
  | 'version'
  | 'portal'
  | 'node'
  | 'platform'
  | 'env'
  | 'uptime'
  | 'docker'
  | 'build';

export type DeveloperRow = {
  id: DeveloperRowId;
  label: string;
  value: string;
};

export type DeveloperRowLabels = Record<DeveloperRowId, string>;

export type DeveloperAuditRow = {
  id: string;
  action: string;
  resource: string;
  detail: string;
  userId: string;
  ipAddress: string;
  createdAt: string;
};

