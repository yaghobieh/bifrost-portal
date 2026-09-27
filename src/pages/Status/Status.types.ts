export type StatusHealthState = 'ok' | 'degraded' | 'down';

export type StatusServiceProbe = {
  id: string;
  ok: boolean;
  latencyMs: number;
  configured: boolean;
};

export type StatusIncidentProbe = {
  id: string;
  title: string;
  date: string;
  durationMin: number;
  resolved: boolean;
};

export type StatusPageData = {
  health: StatusHealthState;
  db: boolean;
  version: string;
  portal: string;
  updateAvailable: boolean;
  uptimeSec: number;
  services: StatusServiceProbe[];
  incidents: StatusIncidentProbe[];
};

export type StatusPageProps = {
  embedded?: boolean;
  preview?: boolean;
};

export type StatusUptimeKind = 'ok' | 'down' | 'deg';

export type StatusServiceRow = {
  id: string;
  name: string;
  latency: string;
  ok: boolean;
  configured: boolean;
  label: string;
  pillKind: StatusUptimeKind;
};

export type StatusIncidentRow = {
  id: string;
  title: string;
  date: string;
  resolved: boolean;
};

export type StatusOverviewProps = {
  healthOk: boolean;
  healthLabel: string;
  healthValue: string;
  healthSub: string;
  serviceLabel: string;
  serviceValue: string;
  serviceHint: string;
  versionLabel: string;
  versionValue: string;
  updateBadge: string;
  showUpdate: boolean;
};

export type StatusUptimeProps = {
  title: string;
  percent: string;
  ago: string;
  today: string;
  bars: StatusUptimeKind[];
};

export type StatusServicesProps = {
  title: string;
  rows: StatusServiceRow[];
};

export type StatusIncidentsProps = {
  title: string;
  resolved: string;
  open: string;
  empty: string;
  rows: StatusIncidentRow[];
};

export type StatusSubscribeProps = {
  title: string;
  lead: string;
  placeholder: string;
  action: string;
  done: string;
};
