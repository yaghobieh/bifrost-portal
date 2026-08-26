import { useEffect, useState, type FC } from 'react';
import { Button, Flex, Modal, Snackbar, Typography } from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useI18n } from '@i18n/index';
import { ROUTES } from '@const/index';
import { EMPTY_STRING } from '@const/strings.const';
import {
  EMPTY_WHATS_NEW,
  fetchVersionInfo,
  fetchWhatsNew,
  requestUpdateCms,
  TARGET_CMS_VERSION,
} from '@sdk/modules/version';
import type { CmsUpdateResult, WhatsNewCopy } from '@sdk/modules/version';
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
  isBehindHub,
  loadDismissedVersion,
  previewNotes,
  saveDismissedVersion,
  versionFromInfo,
} from './CmsUpdateBanner.utils';

export const CmsUpdateBanner: FC<CmsUpdateBannerProps> = (props) => {
  const { token } = props;
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const [running, setRunning] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [whatsNew, setWhatsNew] = useState<WhatsNewCopy>(EMPTY_WHATS_NEW);
  const [result, setResult] = useState<CmsUpdateResult | null>(null);
  const [behind, setBehind] = useState(false);

  useEffect(() => {
    void fetchVersionInfo().then((info) => {
      const current = versionFromInfo(info.portal, info.version);
      setBehind(isBehindHub(current) || current === EMPTY_STRING);
    });
  }, []);

  const dismissed = loadDismissedVersion() === TARGET_CMS_VERSION;
  const isOpen = behind && !hidden && !dismissed;
  const notes = previewNotes(result?.notes, whatsNew, t.cmsShell.updateChangelog);

  const onDismiss = () => {
    saveDismissedVersion(TARGET_CMS_VERSION);
    setHidden(true);
  };

  const onHow = () => {
    navigate(ROUTES.CHANGELOG);
  };

  const onClosePreview = () => {
    setPreviewOpen(false);
  };

  const onUpdate = async () => {
    setRunning(true);
    const nextWhatsNew = await fetchWhatsNew();
    setWhatsNew(nextWhatsNew);
    const next = await requestUpdateCms(token);
    setRunning(false);
    if (!next) {
      setResult(null);
      setPreviewOpen(true);
      return;
    }
    setResult(next);
    setPreviewOpen(true);
  };

  return (
    <>
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
      <Modal
        isOpen={previewOpen}
        onClose={onClosePreview}
        title={t.cmsShell.updatePreviewTitle.replace('{version}', TARGET_CMS_VERSION)}
        size="md"
      >
        <Flex direction="column" gap={3}>
          {whatsNew.title ? (
            <Typography variant="h4" className="mb-0">
              {whatsNew.title}
            </Typography>
          ) : null}
          <Typography variant="body2" className="mb-0">
            {notes}
          </Typography>
          {result ? (
            <Typography variant="caption" color="muted" className="mb-0">
              {result.updated
                ? t.cmsShell.updatePreviewApplied
                : t.cmsShell.updatePreviewCurrent}
              {` ${result.from} → ${result.to}`}
            </Typography>
          ) : null}
          {result && result.packages.length ? (
            <Flex direction="column" gap={1}>
              <Typography variant="overline" color="muted" className="mb-0">
                {t.cmsShell.updatePreviewPackages}
              </Typography>
              {result.packages.map((pkg) => (
                <Typography key={pkg} variant="caption" className="mb-0">
                  {pkg}
                </Typography>
              ))}
            </Flex>
          ) : null}
          <Flex gap={2}>
            <Button size="sm" variant="primary" onClick={onHow}>
              {t.cmsShell.updateHow}
            </Button>
            <Button size="sm" variant="outline" onClick={onClosePreview}>
              {t.cmsShell.updateDismiss}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
