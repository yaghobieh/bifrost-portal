import { INK_API_URL } from '@const/billing.const';
import { HTTP_METHOD_POST, HTTP_NOT_FOUND } from '@const/http.const';
import { EMPTY_STRING } from '@const/strings.const';
import { useApi } from '@sdk/http';
import { authHeaders } from '../auth/auth.api';
import { CMS_UPDATE_PATH } from './version.const';
import { resetVersionInfoCache } from './version.api';
import type { CmsUpdateResult } from './version.types';
import { isCmsUpdateResult, optimisticUpdateResult, type CmsUpdateCandidate } from './update.utils';

export const requestUpdateCms = async (token: string): Promise<CmsUpdateResult | null> => {
  const response = await useApi(
    `${INK_API_URL}${CMS_UPDATE_PATH}`,
    {
      method: HTTP_METHOD_POST,
      headers: authHeaders(token),
    },
    { silent: true, onError: () => undefined },
  );
  if (response.status === HTTP_NOT_FOUND) {
    return optimisticUpdateResult();
  }
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as CmsUpdateCandidate;
  if (!isCmsUpdateResult(data)) {
    return null;
  }
  resetVersionInfoCache();
  return {
    from: data.from,
    to: data.to,
    updated: data.updated,
    packages: Array.isArray(data.packages) ? data.packages : [],
    notes: typeof data.notes === 'string' ? data.notes : EMPTY_STRING,
  };
};
