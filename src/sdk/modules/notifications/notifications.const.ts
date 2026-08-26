import type { ApiErrorCode } from '@sdk/http';

export const CMS_NOTIFICATIONS_PATH = '/api/cms/get-notifications';
export const CMS_NOTIFICATION_READ_PATH = '/api/cms/mark-notification-read';
export const CMS_TASK_NOTIFY_PATH = '/api/cms/tasks/notify';

export const NOTIFICATION_LOAD_ERROR: { code: ApiErrorCode; message: string } = {
  code: 'notifications',
  message: 'Could not load notifications.',
};

export const NOTIFICATION_NOTIFY_ERROR: { code: ApiErrorCode; message: string } = {
  code: 'notifications',
  message: 'Could not notify agents.',
};

export const NOTIFICATION_UPDATE_ERROR: { code: ApiErrorCode; message: string } = {
  code: 'notifications',
  message: 'Could not update notification.',
};

export const NOTIFICATION_READ_BODY = { read: true } as const;
