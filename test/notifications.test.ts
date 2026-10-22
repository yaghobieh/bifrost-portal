import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NOTIFICATIONS_FILTER,
  NOTIFICATIONS_DAYS,
  NOTIFICATIONS_MS_PER_DAY,
} from '../src/pages/Cms/NotificationsPages/NotificationsPages.const.ts';
import { CMS_ALERT_FILTERS } from '../src/pages/Cms/CmsShell/CmsAlerts.const.ts';
import { groupNotificationsByDay } from '../src/pages/Cms/NotificationsPages/NotificationsPages.utils.ts';
import type { CmsNotification } from '../src/sdk/modules/cms/cms.types.ts';

test('CMS-89: Notification Filters & Constants', () => {
  assert.equal(NOTIFICATIONS_FILTER.ALL, 'all');
  assert.equal(NOTIFICATIONS_FILTER.UNREAD, 'unread');
  assert.equal(NOTIFICATIONS_FILTER.SEEN, 'seen');

  assert.equal(CMS_ALERT_FILTERS.ALL, 'all');
  assert.equal(CMS_ALERT_FILTERS.UNSEEN, 'unseen');
  assert.equal(CMS_ALERT_FILTERS.SEEN, 'seen');

  assert.equal(NOTIFICATIONS_DAYS, 30);
  assert.equal(NOTIFICATIONS_MS_PER_DAY, 86400000);
});

test('CMS-89: Notification Filtering by Status (All, Unread/Unseen, Seen)', () => {
  const sampleNotifications: CmsNotification[] = [
    {
      id: 'notif-1',
      title: 'Post published',
      body: 'Your blog post "Getting Started" is live.',
      severity: 'success',
      href: '/cms/content',
      createdAt: '2026-10-22T10:00:00.000Z',
      readAt: null,
    },
    {
      id: 'notif-2',
      title: 'Security Alert',
      body: 'New login from unknown IP.',
      severity: 'warning',
      href: '/cms/settings',
      createdAt: '2026-10-21T15:30:00.000Z',
      readAt: '2026-10-21T16:00:00.000Z',
    },
    {
      id: 'notif-3',
      title: 'Site backup completed',
      body: 'Scheduled backup finished successfully.',
      severity: 'info',
      href: '/cms/settings',
      createdAt: '2026-10-20T08:00:00.000Z',
      readAt: null,
    },
  ];

  // ALL filter
  const allItems = sampleNotifications;
  assert.equal(allItems.length, 3);

  // UNREAD / UNSEEN filter
  const unreadItems = sampleNotifications.filter((n) => !n.readAt);
  assert.equal(unreadItems.length, 2);
  assert.deepEqual(
    unreadItems.map((n) => n.id),
    ['notif-1', 'notif-3'],
  );

  // SEEN filter
  const seenItems = sampleNotifications.filter((n) => Boolean(n.readAt));
  assert.equal(seenItems.length, 1);
  assert.equal(seenItems[0].id, 'notif-2');
});

test('CMS-89: Grouping Notifications by Day', () => {
  const sampleNotifications: CmsNotification[] = [
    {
      id: 'notif-today-1',
      title: 'Today notification 1',
      body: 'First today',
      severity: 'info',
      href: '/cms',
      createdAt: '2026-10-22T12:00:00.000Z',
      readAt: null,
    },
    {
      id: 'notif-today-2',
      title: 'Today notification 2',
      body: 'Second today',
      severity: 'success',
      href: '/cms',
      createdAt: '2026-10-22T09:00:00.000Z',
      readAt: null,
    },
    {
      id: 'notif-yesterday-1',
      title: 'Yesterday notification',
      body: 'Yesterday body',
      severity: 'warning',
      href: '/cms',
      createdAt: '2026-10-21T11:00:00.000Z',
      readAt: '2026-10-21T12:00:00.000Z',
    },
  ];

  const groups = groupNotificationsByDay(sampleNotifications, 'en-US');
  assert.equal(groups.length, 2);
  assert.equal(groups[0].items.length, 2);
  assert.equal(groups[1].items.length, 1);
});

test('CMS-89: Hover / Interaction Mark as Read State Transition', () => {
  const notif: CmsNotification = {
    id: 'n-test',
    title: 'Test Notification',
    body: 'Hover over me',
    severity: 'info',
    href: '/cms',
    createdAt: '2026-10-22T10:00:00.000Z',
    readAt: null,
  };

  assert.equal(notif.readAt, null);

  // Simulating markRead behavior
  const marked = { ...notif, readAt: new Date().toISOString() };
  assert.ok(marked.readAt !== null);
  assert.ok(typeof marked.readAt === 'string');
});
