import type { CmsConnections } from '../../SettingsPages.types';

export type SettingsConnectionsPanelProps = {
  connections: CmsConnections;
  onChange: (next: CmsConnections) => void;
  onSave?: () => void;
  token?: string;
};
