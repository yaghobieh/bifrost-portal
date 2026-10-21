import type { FC } from 'react';
import { Card, Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { SettingsSitesPanel } from '../SettingsPages/helpers/SettingsSitesPanel';

export const SitesPages: FC = () => {
  const { t } = useI18n();

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.SITES}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <CmsPageHeader
          title={t.settings.tabMultiSite}
          subtitle="Manage multi-site network, domains, and localized portals"
          actionTitle={t.settings.tabMultiSite}
          actionBody="Create and configure multiple portals and sites in your Bifrost network"
        />

        <Card variant="elevated" padding="md">
          <div className="bifrost-cms-settings-box">
            <SettingsSitesPanel />
          </div>
        </Card>
      </Flex>
    </CmsShell>
  );
};
