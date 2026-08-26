import { INK_API_URL } from '@const/billing.const';
import { NUMBER_FIFTY } from '@const/numbers.const';
import { useApi } from '@sdk/http';
import { authHeaders } from '../auth/auth.api';
import {
  AUDIT_QUERY_LIMIT,
  AUDIT_QUERY_SCOPE,
  AUDIT_SCOPE_ALL,
  CMS_AUDIT_LOGS_PATH,
} from './audit.const';
import type { AuditLogListResponse, AuditLogRecord } from './audit.types';

export const fetchAuditLogs = async (token: string): Promise<AuditLogRecord[]> => {
  if (!token) {
    return [];
  }
  const params = new URLSearchParams({
    [AUDIT_QUERY_SCOPE]: AUDIT_SCOPE_ALL,
    [AUDIT_QUERY_LIMIT]: String(NUMBER_FIFTY),
  });
  const response = await useApi(
    `${INK_API_URL}${CMS_AUDIT_LOGS_PATH}?${params.toString()}`,
    { headers: authHeaders(token) },
    { silent: true, onError: () => undefined },
  );
  if (!response.ok) {
    return [];
  }
  try {
    const data = (await response.json()) as AuditLogListResponse;
    if (!data || !Array.isArray(data.items)) {
      return [];
    }
    return data.items;
  } catch {
    return [];
  }
};

