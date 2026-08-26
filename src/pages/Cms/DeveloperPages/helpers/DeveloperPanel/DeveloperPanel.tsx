import { useEffect, useState, type FC } from 'react';
import { Card, Divider, Flex, Grid, Spinner, Typography } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { useI18n } from '@i18n/index';
import { NUMBER_ONE } from '@const/index';
import { authNucleus } from '@sdk/index';
import { fetchAuditLogs } from '@sdk/modules/audit';
import {
  bindWindowVersion,
  EMPTY_VERSION_INFO,
  fetchVersionInfo,
} from '@sdk/modules/version';
import type { VersionInfo } from '@sdk/modules/version';
import { CmsGridTable, CMS_CARD_PADDING } from '../../../CmsShell';
import {
  DEVELOPER_BUILD_ROW_IDS,
  DEVELOPER_EMPTY,
  DEVELOPER_LAYOUT_COLS,
  DEVELOPER_LAYOUT_GAP,
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
      <Card padding={CMS_CARD_PADDING}>
        <Typography variant="h4" className="mb-1">
          {t.cmsDeveloper.title}
        </Typography>
        <Typography variant="body2" color="secondary" className="mb-4">
          {t.cmsDeveloper.subtitle}
        </Typography>
        <Grid cols={DEVELOPER_LAYOUT_COLS} gap={DEVELOPER_LAYOUT_GAP}>
          <Flex direction="column" gap={0}>
            <Typography variant="overline" color="muted" className="mb-2">
              {t.cmsDeveloper.runtimeGroup}
            </Typography>
            {runtimeRows.map((row, index) => (
              <Flex key={row.id} direction="column" gap={0}>
                <Flex justify="between" align="center" gap={3}>
                  <Typography variant="body2" color="secondary" className="mb-0">
                    {row.label}
                  </Typography>
                  <Typography variant="body2" className="mb-0">
                    {row.value || DEVELOPER_EMPTY}
                  </Typography>
                </Flex>
                {index < runtimeRows.length - NUMBER_ONE && <Divider />}
              </Flex>
            ))}
          </Flex>
          <Flex direction="column" gap={0}>
            <Typography variant="overline" color="muted" className="mb-2">
              {t.cmsDeveloper.buildGroup}
            </Typography>
            {buildRows.map((row, index) => (
              <Flex key={row.id} direction="column" gap={0}>
                <Flex justify="between" align="center" gap={3}>
                  <Typography variant="body2" color="secondary" className="mb-0">
                    {row.label}
                  </Typography>
                  <Typography variant="body2" className="mb-0">
                    {row.value || DEVELOPER_EMPTY}
                  </Typography>
                </Flex>
                {index < buildRows.length - NUMBER_ONE && <Divider />}
              </Flex>
            ))}
          </Flex>
        </Grid>
      </Card>
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
            { id: 'createdAt', accessor: 'createdAt', header: t.cmsDeveloper.auditAt, sortable: true },
            { id: 'userId', accessor: 'userId', header: t.cmsDeveloper.auditUser },
            { id: 'ipAddress', accessor: 'ipAddress', header: t.cmsDeveloper.auditIp },
          ]}
        />
      </Card>
    </Flex>
  );
};
