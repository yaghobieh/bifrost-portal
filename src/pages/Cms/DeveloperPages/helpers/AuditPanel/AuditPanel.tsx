import { useEffect, useState, type FC } from 'react';
import { Card, Flex, Spinner, Typography } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { useI18n } from '@i18n/index';
import { authNucleus } from '@sdk/index';
import { fetchAuditLogs } from '@sdk/modules/audit';
import { CmsGridTable, CMS_CARD_PADDING } from '../../../CmsShell';
import type { DeveloperAuditRow } from '../../DeveloperPages.types';
import { mapAuditRows } from '../../DeveloperPages.utils';

export const AuditPanel: FC = () => {
  const { t } = useI18n();
  const { token } = useNucleus(authNucleus);
  const [auditRows, setAuditRows] = useState<DeveloperAuditRow[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setAuditRows([]);
      setAuditLoading(false);
      return;
    }
    setAuditLoading(true);
    void fetchAuditLogs(token).then((items) => {
      setAuditRows(mapAuditRows(items, t.cmsDeveloper.unavailable));
      setAuditLoading(false);
    });
  }, [token, t.cmsDeveloper.unavailable]);

  return (
    <Card padding={CMS_CARD_PADDING}>
      <Typography variant="h4" className="mb-1">
        {t.cmsDeveloper.auditTitle}
      </Typography>
      <Typography variant="body2" color="secondary" className="mb-3">
        {t.cmsDeveloper.auditBody}
      </Typography>
      {auditLoading && (
        <Flex align="center" gap={2}>
          <Spinner size="sm" />
          <Typography variant="body2" className="mb-0">
            {t.cmsDeveloper.auditLoading}
          </Typography>
        </Flex>
      )}
      <CmsGridTable
        data={auditRows}
        loading={auditLoading}
        emptyContent={
          <Typography variant="body2" color="secondary" className="mb-0">
            {t.cmsDeveloper.auditEmpty}
          </Typography>
        }
        columns={[
          { id: 'action', accessor: 'action', header: t.cmsDeveloper.auditAction, sortable: true },
          { id: 'resource', accessor: 'resource', header: t.cmsDeveloper.auditResource, sortable: true },
          { id: 'detail', accessor: 'detail', header: t.cmsDeveloper.auditDetail },
          { id: 'createdAt', accessor: 'createdAt', header: t.cmsDeveloper.auditAt, sortable: true },
          { id: 'userId', accessor: 'userId', header: t.cmsDeveloper.auditUser },
          { id: 'ipAddress', accessor: 'ipAddress', header: t.cmsDeveloper.auditIp },
        ]}
      />
    </Card>
  );
};
