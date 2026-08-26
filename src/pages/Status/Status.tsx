import { useEffect, useState, type FC } from 'react';
import { Card, Flex, Typography } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { PortalNav } from '@components/PortalNav';
import { TARGET_CMS_VERSION } from '@sdk/modules/version';
import { STATUS_OK } from './Status.const';
import type { StatusPageData } from './Status.types';
import { emptyStatusPage, fetchStatusPage } from './Status.utils';

export const StatusPage: FC = () => {
  const { t } = useLingo();
  const [data, setData] = useState<StatusPageData>(emptyStatusPage());

  useEffect(() => {
    void fetchStatusPage().then(setData);
  }, []);

  const healthOk = data.health === STATUS_OK;
  const versionLabel = data.portal || data.version || TARGET_CMS_VERSION;

  return (
    <div className="Bl">
      <PortalNav showProductLink={false} />
      <Flex direction="column" gap={4} className="Bl-status">
        <Typography variant="h1">{t('status.title')}</Typography>
        <Typography variant="body1">{t('status.lead')}</Typography>
        <Flex gap={3} wrap="wrap">
          <Card padding="md" className="Bl-status__card">
            <Typography variant="overline">{t('status.health')}</Typography>
            <Typography variant="h3">
              {healthOk ? t('status.healthOk') : t('status.healthDown')}
            </Typography>
            <Typography variant="caption">
              {data.db ? t('status.dbOk') : t('status.dbDown')}
            </Typography>
          </Card>
          <Card padding="md" className="Bl-status__card">
            <Typography variant="overline">{t('status.service')}</Typography>
            <Typography variant="h3">{data.service || t('brand')}</Typography>
            <Typography variant="caption">{t('status.serviceHint')}</Typography>
          </Card>
          <Card padding="md" className="Bl-status__card">
            <Typography variant="overline">{t('status.version')}</Typography>
            <Typography variant="h3">{versionLabel}</Typography>
            <Typography variant="caption">
              {data.updateAvailable
                ? t('status.updateAvailable').replace('{version}', TARGET_CMS_VERSION)
                : t('status.updateCurrent')}
            </Typography>
          </Card>
        </Flex>
      </Flex>
    </div>
  );
};
