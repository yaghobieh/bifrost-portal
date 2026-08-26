export type SettingsKvKey = 'site' | 'plugins' | 'external-plugins';

export type SettingsValueResponse = {
  key: SettingsKvKey;
  value: unknown;
};
