import { useEffect, useState, type FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { PortalNav } from '@components/PortalNav';
import { PUBLIC_NAV_IDS } from '@const/routes.const';
import { TARGET_CMS_SPRINT } from '@sdk/modules/version';
import { STATUS_OK } from './Status.const';
import type { StatusPageData, StatusPageProps } from './Status.types';
import {
  emptyStatusPage,
  fetchStatusPage,
  formatUptime,
  healthValue,
  incidentRows,
  previewStatusPage,
  serviceRows,
  uptimeBarKinds,
  versionDisplay,
} from './Status.utils';
import { StatusOverview } from './helpers/StatusOverview';
import { StatusUptime } from './helpers/StatusUptime';
import { StatusServices } from './helpers/StatusServices';
import { StatusIncidents } from './helpers/StatusIncidents';
import { StatusSubscribe } from './helpers/StatusSubscribe';

export const StatusView: FC<StatusPageProps> = (props) => {
  const { embedded, preview } = props;
  const { t } = useLingo();
  const [data, setData] = useState<StatusPageData>(preview ? previewStatusPage() : emptyStatusPage());

  useEffect(() => {
    if (preview) {
      return;
    }
    void fetchStatusPage().then(setData);
  }, [preview]);

  const healthOk = data.health === STATUS_OK;
  const versionLabel = versionDisplay(data) || TARGET_CMS_SPRINT;
  const showUpdate = preview || data.updateAvailable;
  const serviceList = serviceRows(t, data.services);

  const main = (
    <>
      <PortalNav showProductLink={false} activeId={PUBLIC_NAV_IDS.STATUS} />
      <main className="Bl-status">
        <header className="Bl-status__header">
          <h1 className="Bl-status__title">{t('status.title')}</h1>
          <p className="Bl-status__lead">{t('status.lead')}</p>
        </header>
        <StatusOverview
          healthOk={healthOk}
          healthLabel={t('status.health')}
          healthValue={healthValue(t, data.health)}
          healthSub={data.db ? t('status.dbOk') : t('status.dbDown')}
          serviceLabel={t('status.service')}
          serviceValue={t('status.product')}
          serviceHint={t('status.serviceHint')}
          versionLabel={t('status.version')}
          versionValue={versionLabel}
          updateBadge={t('status.updateBadge').replace('{version}', TARGET_CMS_SPRINT)}
          showUpdate={showUpdate}
        />
        <StatusUptime
          title={t('status.uptimeTitle')}
          percent={formatUptime(data.uptimeSec, t('status.uptimeHoursMins'), t('status.uptimeLive'))}
          ago={t('status.uptimeAgo')}
          today={t('status.uptimeToday')}
          bars={uptimeBarKinds(data.services)}
        />
        <StatusServices title={t('status.services')} rows={serviceList} />
        <StatusIncidents
          title={t('status.incidents')}
          resolved={t('status.incResolved')}
          open={t('status.incOpen')}
          empty={t('status.incEmpty')}
          rows={incidentRows(t, data.incidents)}
        />
        <StatusSubscribe
          title={t('status.subscribeTitle')}
          lead={t('status.subscribeLead')}
          placeholder={t('status.subscribePlaceholder')}
          action={t('status.subscribeAction')}
          done={t('status.subscribed')}
        />
      </main>
    </>
  );

  if (embedded) {
    return main;
  }
  return <div className="Bl">{main}</div>;
};

export const StatusPage: FC = () => <StatusView />;
