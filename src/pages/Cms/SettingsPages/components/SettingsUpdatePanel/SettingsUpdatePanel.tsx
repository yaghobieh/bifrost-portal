import { useEffect, useState, type FC } from 'react';
import { Button, Flex, Typography } from '@forgedevstack/bear';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING } from '@const/strings.const';
import { fetchVersionInfo, requestUpdateCms, TARGET_CMS_VERSION } from '@sdk/modules/version';
import type { CmsUpdateResult } from '@sdk/modules/version';
import { SettingsSection } from '../SettingsSection';
import { SETTINGS_ROLE_ADMIN } from './SettingsUpdatePanel.const';
import type { SettingsUpdatePanelProps } from './SettingsUpdatePanel.types';

const versionFromInfo = (portal: string, version: string): string => {
  if (portal) {
    return portal;
  }
  return version;
};

export const SettingsUpdatePanel: FC<SettingsUpdatePanelProps> = () => {
  const { t } = useI18n();
  const { token, user } = useAuth();
  const [currentVersion, setCurrentVersion] = useState(EMPTY_STRING);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CmsUpdateResult | null>(null);
  const [failed, setFailed] = useState(false);
  const isAdmin = user?.role === SETTINGS_ROLE_ADMIN;
  const alreadyOnTarget = currentVersion === TARGET_CMS_VERSION;
  const updateDisabled = alreadyOnTarget || !isAdmin || running;

  useEffect(() => {
    void fetchVersionInfo().then((info) => {
      setCurrentVersion(versionFromInfo(info.portal, info.version));
    });
  }, []);

  const onUpdate = async () => {
    setRunning(true);
    setFailed(false);
    const next = await requestUpdateCms(token || EMPTY_STRING);
    setRunning(false);
    if (!next) {
      setFailed(true);
      return;
    }
    setResult(next);
    if (next.updated) {
      setCurrentVersion(next.to);
    }
  };

  return (
    <div className="bifrost-cms-settings-box">
      <Flex direction="column" gap={3} className="bifrost-cms-settings__fields">
        <SettingsSection
          title={t.settings.updateTitle}
          description={t.settings.updateHint}
        >
          <Typography variant="body2" className="mb-0">
            {t.settings.updateCurrent} {currentVersion || t.settings.updateUnknown}
          </Typography>
          <Typography variant="body2" className="mb-0">
            {t.settings.updateTarget} {TARGET_CMS_VERSION}
          </Typography>
          <Button
            size="sm"
            variant="bifrost"
            disabled={updateDisabled}
            onClick={() => {
              void onUpdate();
            }}
          >
            {running ? t.settings.updateRunning : t.settings.updateButton}
          </Button>
          {!isAdmin && (
            <Typography variant="caption" className="bifrost-cms__muted mb-0">
              {t.settings.updateDisabledRole}
            </Typography>
          )}
          {isAdmin && alreadyOnTarget && (
            <Typography variant="caption" className="bifrost-cms__muted mb-0">
              {t.settings.updateAlreadyCurrent}
            </Typography>
          )}
          {failed && (
            <Typography variant="caption" className="bifrost-cms__muted mb-0">
              {t.settings.updateFailed}
            </Typography>
          )}
          {result && result.updated && (
            <Typography variant="caption" className="bifrost-cms-save-ok mb-0">
              {t.settings.updateSuccess}
            </Typography>
          )}
          {result && !result.updated && (
            <Typography variant="caption" className="bifrost-cms__muted mb-0">
              {t.settings.updateAlreadyCurrent}
            </Typography>
          )}
        </SettingsSection>
      </Flex>
    </div>
  );
};
