export type StatusHealthState = 'ok' | 'down';

export type StatusPageData = {
  health: StatusHealthState;
  db: boolean;
  service: string;
  version: string;
  portal: string;
  updateAvailable: boolean;
};

export type StatusPageProps = Record<string, never>;
