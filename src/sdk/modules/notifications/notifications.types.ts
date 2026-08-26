export type CmsNotificationSeverity = 'success' | 'info' | 'warning' | 'error';

export type CmsNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
  severity: CmsNotificationSeverity;
  readAt: string | null;
  createdAt: string;
};

export type CmsNotificationsResult = {
  items: CmsNotification[];
  unread: number;
  redis: boolean;
};

export type CmsNotificationRange = {
  from?: string;
  to?: string;
};

export type CmsTaskNotifyInput = {
  title: string;
  body: string;
  agentIds: string[];
};

export type CmsNotificationReadBody = {
  read: boolean;
};
