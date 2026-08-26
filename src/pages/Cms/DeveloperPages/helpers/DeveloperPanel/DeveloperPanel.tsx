import { useEffect, useState, type FC } from 'react';
import { Card, Flex, Spinner, Typography } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { useI18n } from '@i18n/index';
import { authNucleus } from '@sdk/index';
import { fetchAuditLogs } from '@sdk/modules/audit';
import {
  bindWindowVersion,
  EMPTY_VERSION_INFO,
  fetchVersionInfo,
} from '@sdk/modules/version';
import type { VersionInfo } from '@sdk/modules/version';
import { CmsGridTable } from '../../../CmsShell';
import {
  DEVELOPER_BUILD_ROW_IDS,
  DEVELOPER_EMPTY,
  DEVELOPER_RUNTIME_ROW_IDS,
} from '../../DeveloperPages.const';
import type { DeveloperAuditRow, DeveloperRowId, DeveloperRowLabels } from '../../DeveloperPages.types';
import { buildDeveloperRows, mapAuditRows, splitUptime } from '../../DeveloperPages.utils';

export const DeveloperPanel: FC = () => {
  const { t } = useI18n();
  const { token } = useNucleus(authNucleus);
  const [info, setInfo] = useState<VersionInfo>(EMPTY_VERSION_INFO);
  const [loading, setLoading] = useState(true);
  const [auditRows, setAuditRows] = useState<DeveloperAuditRow[]>([]);
  const [auditLoading, setAuditLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void fetchVersionInfo().then((next) => {
      bindWindowVersion(next);
      setInfo(next);
      setLoading(false);
    });
  }, []);

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

  const uptimeParts = splitUptime(info.uptimeSec);
  const uptimeText = t.cmsDeveloper.uptimeValue
    .replace('{hours}', String(uptimeParts.hours))
    .replace('{minutes}', String(uptimeParts.minutes));
  const labels: DeveloperRowLabels = {
    product: t.cmsDeveloper.product,
    version: t.cmsDeveloper.version,
    portal: t.cmsDeveloper.portal,
    node: t.cmsDeveloper.node,
    platform: t.cmsDeveloper.platform,
    env: t.cmsDeveloper.env,
    uptime: t.cmsDeveloper.uptime,
    docker: t.cmsDeveloper.docker,
    build: t.cmsDeveloper.build,
  };
  const rows = buildDeveloperRows({
    info,
    labels,
    emptyLabel: t.cmsDeveloper.unavailable,
    uptimeText,
  });
  const runtimeRows = rows.filter((row) =>
    (DEVELOPER_RUNTIME_ROW_IDS as readonly DeveloperRowId[]).includes(row.id),
  );
  const buildRows = rows.filter((row) =>
    (DEVELOPER_BUILD_ROW_IDS as readonly DeveloperRowId[]).includes(row.id),
  );

  return (
    <Flex direction="column" gap={4}>
      {loading && (
        <Flex align="center" gap={2}>
          <Spinner size="sm" />
          <Typography variant="body2" className="mb-0">
            {t.cmsDeveloper.loading}
          </Typography>
        </Flex>
      )}
      <Card>
        <Typography variant="h4" className="mb-1">
          {t.cmsDeveloper.title}
        </Typography>
        <Typography variant="body2" color="secondary" className="mb-4">
          {t.cmsDeveloper.subtitle}
        </Typography>
        <Flex gap={6} align="start">
          <Flex direction="column" gap={0} className="flex-1">
            <Typography variant="caption" className="mb-2">
              {t.cmsDeveloper.runtimeGroup}
            </Typography>
            {runtimeRows.map((row) => (
              <Flex key={row.id} justify="between" align="center" gap={3}>
                <Typography variant="body2" color="secondary" className="mb-0">
                  {row.label}
                </Typography>
                <Typography variant="body2" className="mb-0">
                  {row.value || DEVELOPER_EMPTY}
                </Typography>
              </Flex>
            ))}
          </Flex>
          <Flex direction="column" gap={0} className="flex-1">
            <Typography variant="caption" className="mb-2">
              {t.cmsDeveloper.buildGroup}
            </Typography>
            {buildRows.map((row) => (
              <Flex key={row.id} justify="between" align="center" gap={3}>
                <Typography variant="body2" color="secondary" className="mb-0">
                  {row.label}
                </Typography>
                <Typography variant="body2" className="mb-0">
                  {row.value || DEVELOPER_EMPTY}
                </Typography>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Card>
      <Card>
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
            { id: 'createdAt', accessor: 'createdAt', header: t.cmsDeveloper.auditAt, sortable: true },
            { id: 'userId', accessor: 'userId', header: t.cmsDeveloper.auditUser },
            { id: 'ipAddress', accessor: 'ipAddress', header: t.cmsDeveloper.auditIp },
          ]}
        />
      </Card>
    </Flex>
  );
};
