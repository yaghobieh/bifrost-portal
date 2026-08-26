import { INK_API_URL } from '@const/billing.const';
import { CONTENT_TYPE_JSON, HEADER_CONTENT_TYPE, HTTP_METHOD_PUT } from '@const/index';
import { useApi } from '@sdk/http';
import { authHeaders } from '../auth/auth.api';
import { CMS_SETTINGS_PATH } from './settings.const';
import type { SettingsKvKey, SettingsValueResponse } from './settings.types';

export const fetchSettingsValue = async (
  token: string,
  key: SettingsKvKey,
): Promise<unknown> => {
  if (!token) {
    return null;
  }
  const response = await useApi(
    `${INK_API_URL}${CMS_SETTINGS_PATH}/${key}`,
    { headers: authHeaders(token) },
    { silent: true, onError: () => undefined },
  );
  if (!response.ok) {
    return null;
  }
  try {
    const data = (await response.json()) as SettingsValueResponse;
    return data.value ?? null;
  } catch {
    return null;
  }
};

export const putSettingsValue = async (
  token: string,
  key: SettingsKvKey,
  value: unknown,
): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const response = await useApi(
    `${INK_API_URL}${CMS_SETTINGS_PATH}/${key}`,
    {
      method: HTTP_METHOD_PUT,
      headers: {
        ...authHeaders(token),
        [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
      },
      body: JSON.stringify({ value }),
    },
    { silent: true, onError: () => undefined },
  );
  return response.ok;
};
