import { useState, type FC } from 'react';
import { Button, Flex, Input, Select, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import type { CmsCatalog, CmsCatalogFormat } from '@pages/Cms/SettingsPages/SettingsPages.types';
import { loadCmsCatalog, saveCmsCatalog } from '@pages/Cms/SettingsPages/SettingsPages.utils';
import {
  SETTINGS_CATALOG_DEFAULT_JS,
  SETTINGS_CATALOG_DEFAULT_JSON,
  SETTINGS_CATALOG_FORMAT,
  SETTINGS_CATALOG_INPUT_IDS,
  SETTINGS_CATALOG_TEXTAREA_ROWS,
} from './SettingsCatalogPanel.const';
import type { SettingsCatalogPanelProps } from './SettingsCatalogPanel.types';
import { SettingsSection } from '../SettingsSection';

const sourceForFormat = (format: CmsCatalogFormat): string => {
  if (format === SETTINGS_CATALOG_FORMAT.JS) {
    return SETTINGS_CATALOG_DEFAULT_JS;
  }
  return SETTINGS_CATALOG_DEFAULT_JSON;
};

const isDefaultSource = (source: string): boolean =>
  source === SETTINGS_CATALOG_DEFAULT_JSON || source === SETTINGS_CATALOG_DEFAULT_JS;

export const SettingsCatalogPanel: FC<SettingsCatalogPanelProps> = () => {
  const { t } = useI18n();
  const [catalog, setCatalog] = useState<CmsCatalog>(() => loadCmsCatalog());
  const [saved, setSaved] = useState(false);
  const formatOptions = [
    { value: SETTINGS_CATALOG_FORMAT.JSON, label: t.settings.catalogFormatJson },
    { value: SETTINGS_CATALOG_FORMAT.JS, label: t.settings.catalogFormatJs },
  ];

  const onFormatChange = (value: string) => {
    const format =
      value === SETTINGS_CATALOG_FORMAT.JS
        ? SETTINGS_CATALOG_FORMAT.JS
        : SETTINGS_CATALOG_FORMAT.JSON;
    setCatalog((current) => ({
      format,
      source: isDefaultSource(current.source) ? sourceForFormat(format) : current.source,
    }));
    setSaved(false);
  };

  const onSave = () => {
    saveCmsCatalog(catalog);
    setSaved(true);
  };

  return (
    <div className="bifrost-cms-settings-box">
      <Flex direction="column" gap={3} className="bifrost-cms-settings__fields">
        <SettingsSection
          title={t.settings.catalogTitle}
          description={t.settings.catalogHint}
        >
          <Select
            id={SETTINGS_CATALOG_INPUT_IDS.FORMAT}
            label={t.settings.catalogFormat}
            options={formatOptions}
            value={catalog.format}
            onChange={onFormatChange}
            fullWidth
          />
          <Input
            id={SETTINGS_CATALOG_INPUT_IDS.SOURCE}
            label={t.settings.catalogSource}
            value={catalog.source}
            multiline
            rows={SETTINGS_CATALOG_TEXTAREA_ROWS}
            fullWidth
            onChange={(event) => {
              setCatalog((current) => ({ ...current, source: event.target.value }));
              setSaved(false);
            }}
          />
        </SettingsSection>
        <div className="bifrost-cms-settings-save">
          <Button size="sm" variant="bifrost" onClick={onSave}>
            {t.settings.catalogSave}
          </Button>
          {saved && (
            <Typography variant="caption" className="bifrost-cms-save-ok mb-0">
              {t.settings.saved}
            </Typography>
          )}
        </div>
      </Flex>
    </div>
  );
};
