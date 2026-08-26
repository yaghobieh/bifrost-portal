import { INK_API_URL } from '@const/billing.const';
import { HTTP_METHOD_PATCH, HTTP_METHOD_POST } from '@const/http.const';
import { CONTENT_TYPE_JSON, HEADER_CONTENT_TYPE } from '@const/strings.const';
import { EMPTY_STRING } from '@const/generals.const';
import { authHeaders } from '../auth/auth.api';
import { useApi } from '@sdk/http';
import {
  CMS_NOTIFICATION_READ_PATH,
  CMS_NOTIFICATIONS_PATH,
  CMS_TASK_NOTIFY_PATH,
  NOTIFICATION_LOAD_ERROR,
  NOTIFICATION_NOTIFY_ERROR,
  NOTIFICATION_READ_BODY,
  NOTIFICATION_UPDATE_ERROR,
} from './notifications.const';
import type {
  CmsNotificationRange,
  CmsNotificationsResult,
  CmsTaskNotifyInput,
} from './notifications.types';

export const fetchNotifications = async (
  token: string,
  range?: CmsNotificationRange,
): Promise<CmsNotificationsResult | null> => {
  if (!token) {
    return null;
  }
  const params = new URLSearchParams();
  if (range?.from) {
    params.set('from', range.from);
  }
  if (range?.to) {
    params.set('to', range.to);
  }
  const query = params.toString();
  const suffix = query ? `?${query}` : EMPTY_STRING;
  const response = await useApi(
    `${INK_API_URL}${CMS_NOTIFICATIONS_PATH}${suffix}`,
    { headers: authHeaders(token) },
    NOTIFICATION_LOAD_ERROR,
  );
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as CmsNotificationsResult;
};

export const notifyTaskAgentsRequest = async (
  token: string,
  input: CmsTaskNotifyInput,
): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const response = await useApi(
    `${INK_API_URL}${CMS_TASK_NOTIFY_PATH}`,
    {
      method: HTTP_METHOD_POST,
      headers: { ...authHeaders(token), [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON },
      body: JSON.stringify(input),
    },
    NOTIFICATION_NOTIFY_ERROR,
  );
  return response.ok;
};

export const markNotificationReadRequest = async (
  token: string,
  id: string,
): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const response = await useApi(
    `${INK_API_URL}${CMS_NOTIFICATION_READ_PATH}/${id}`,
    {
      method: HTTP_METHOD_PATCH,
      headers: { ...authHeaders(token), [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON },
      body: JSON.stringify(NOTIFICATION_READ_BODY),
    },
    NOTIFICATION_UPDATE_ERROR,
  );
  return response.ok;
};
