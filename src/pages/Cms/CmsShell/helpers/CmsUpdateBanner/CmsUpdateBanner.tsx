import { useState, type FC } from 'react';
import { Button, Flex, Snackbar } from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useI18n } from '@i18n/index';
import { ROUTES } from '@const/index';
import { requestUpdateCms, TARGET_CMS_VERSION } from '@sdk/modules/version';
import {
  CMS_UPDATE_BANNER_ID,
  CMS_UPDATE_SNACKBAR_ANCHOR,
  CMS_UPDATE_SNACKBAR_CLOSE_ON_OUTSIDE,
  CMS_UPDATE_SNACKBAR_OFFSET_Y,
  CMS_UPDATE_SNACKBAR_SEVERITY,
  CMS_UPDATE_SNACKBAR_STICKY,
} from './CmsUpdateBanner.const';
import type { CmsUpdateBannerProps } from './CmsUpdateBanner.types';
import {
  loadDismissedVersion,
  saveDismissedVersion,
} from './CmsUpdateBanner.utils';

export const CmsUpdateBanner: FC<CmsUpdateBannerProps> = (props) => {
  const { token } = props;
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const [running, setRunning] = useState(false);
  const [hidden, setHidden] = useState(false);

  const dismissed = loadDismissedVersion() === TARGET_CMS_VERSION;
  const isOpen = !hidden && !dismissed;

  const onDismiss = () => {
    saveDismissedVersion(TARGET_CMS_VERSION);
    setHidden(true);
  };

  const onHow = () => {
    navigate(ROUTES.CMS_SETTINGS);
  };

  const onUpdate = async () => {
    setRunning(true);
    const next = await requestUpdateCms(token);
    setRunning(false);
    if (next?.updated) {
      onDismiss();
    }
  };

  return (
    <Snackbar
      id={CMS_UPDATE_BANNER_ID}
      open={isOpen}
      severity={CMS_UPDATE_SNACKBAR_SEVERITY}
      message={t.cmsShell.updateHello.replace('{version}', TARGET_CMS_VERSION)}
      description={t.cmsShell.updateChangelog}
      autoHideDuration={CMS_UPDATE_SNACKBAR_STICKY}
      closeOnClickOutside={CMS_UPDATE_SNACKBAR_CLOSE_ON_OUTSIDE}
      showCloseButton
      anchorOrigin={CMS_UPDATE_SNACKBAR_ANCHOR}
      offsetY={CMS_UPDATE_SNACKBAR_OFFSET_Y}
      onClose={onDismiss}
      action={
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
          <Button size="sm" variant="ghost" onClick={onHow}>
            {t.cmsShell.updateHow}
          </Button>
        </Flex>
      }
    />
  );
};
