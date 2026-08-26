import { useEffect, useState, type FC } from 'react';
import { Button, Flex, Typography } from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING, ROUTES } from '@const/index';
import {
  fetchVersionInfo,
  requestUpdateCms,
  TARGET_CMS_VERSION,
} from '@sdk/modules/version';
import { CMS_UPDATE_BANNER_ID } from './CmsUpdateBanner.const';
import type { CmsUpdateBannerProps } from './CmsUpdateBanner.types';
import {
  loadDismissedVersion,
  saveDismissedVersion,
  versionFromInfo,
} from './CmsUpdateBanner.utils';

export const CmsUpdateBanner: FC<CmsUpdateBannerProps> = (props) => {
  const { token } = props;
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const [current, setCurrent] = useState(EMPTY_STRING);
  const [running, setRunning] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    void fetchVersionInfo().then((info) => {
      setCurrent(versionFromInfo(info.portal, info.version));
    });
  }, []);

  const dismissed = loadDismissedVersion() === TARGET_CMS_VERSION;
  if (hidden || dismissed) {
    return null;
  }

  const onUpdate = async () => {
    setRunning(true);
    const next = await requestUpdateCms(token);
    setRunning(false);
    if (next?.updated) {
      setCurrent(next.to);
      saveDismissedVersion(TARGET_CMS_VERSION);
      setHidden(true);
    }
  };

  return (
    <div id={CMS_UPDATE_BANNER_ID} className="bifrost-cms-update-banner" role="status">
      <Flex align="center" justify="between" wrap="wrap" gap={2} className="bifrost-cms-update-banner__inner">
        <Flex direction="column" gap={1}>
          <Typography variant="body2" className="mb-0">
            {t.cmsShell.updateHello.replace('{version}', TARGET_CMS_VERSION)}
          </Typography>
          <Typography variant="caption" color="muted" className="mb-0">
            {t.cmsShell.updateChangelog}
          </Typography>
        </Flex>
        <Flex align="center" gap={2}>
          <Button
            size="sm"
            variant="primary"
            disabled={running}
            onClick={() => {
              void onUpdate();
            }}
          >
            {running ? t.cmsShell.updateRunning : t.cmsShell.updateNow}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTES.CMS_SETTINGS)}
          >
            {t.cmsShell.updateHow}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              saveDismissedVersion(TARGET_CMS_VERSION);
              setHidden(true);
            }}
          >
            {t.cmsShell.updateDismiss}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};
