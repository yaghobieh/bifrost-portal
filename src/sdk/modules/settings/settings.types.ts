export type SettingsKvKey = 'site' | 'plugins' | 'external-plugins' | 'translations' | 'routes';

export type SettingsValueResponse = {
  key: SettingsKvKey;
  value: unknown;
};
