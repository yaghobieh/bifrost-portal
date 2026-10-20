import type { CmsSite } from '@data/sites.types';

export type SettingsSitesPanelProps = {
  token?: string;
  onSiteActivated?: (site: CmsSite) => void;
};
