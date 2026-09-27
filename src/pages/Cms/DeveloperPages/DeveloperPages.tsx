import type { FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { DeveloperPanel } from './helpers/DeveloperPanel';

export const DeveloperPages: FC = () => {
  const { t } = useI18n();
  return (
    <CmsShell activeNavId={CMS_NAV_IDS.DEVELOPER}>
      <Flex direction="column" gap={4}>
        <CmsPageHeader
          title={t.cmsDeveloper.title}
          subtitle={t.cmsDeveloper.subtitle}
          actionTitle={t.cmsDeveloper.runtimeGroup}
          actionBody={t.cmsDeveloper.subtitle}
        />
        <DeveloperPanel />
      </Flex>
    </CmsShell>
  );
};
