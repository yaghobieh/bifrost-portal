import type { FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { NetworkManagerDashboard } from './NetworkManagerDashboard';

export const SitesPages: FC = () => {
  const { t } = useI18n();

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.SITES}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <CmsPageHeader
          title={t.settings.tabMultiSite}
          subtitle="Multi-site network orchestration, scoped pages and URLs, independent plugins, and user permissions"
          actionTitle={t.settings.tabMultiSite}
          actionBody="Supervise and administer all portals and sites across your Bifrost network"
        />

        <NetworkManagerDashboard />
      </Flex>
    </CmsShell>
  );
};
