export type SettingsKvKey = 'site' | 'plugins' | 'external-plugins' | 'translations';

export type SettingsValueResponse = {
  key: SettingsKvKey;
  value: unknown;
};
