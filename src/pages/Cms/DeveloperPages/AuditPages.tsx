import type { FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { AuditPanel } from './helpers/AuditPanel';

export const AuditPages: FC = () => {
  const { t } = useI18n();
  return (
    <CmsShell activeNavId={CMS_NAV_IDS.AUDIT}>
      <Flex direction="column" gap={4}>
        <CmsPageHeader
          title={t.cmsDeveloper.auditTitle}
          subtitle={t.cmsDeveloper.auditBody}
          actionTitle={t.cmsDeveloper.auditTitle}
          actionBody={t.cmsDeveloper.auditBody}
        />
        <AuditPanel />
      </Flex>
    </CmsShell>
  );
};
