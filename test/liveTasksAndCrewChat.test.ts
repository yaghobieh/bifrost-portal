if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeChatRooms,
  sameMembers,
  presencePingBody,
  parseLiveSocketPayload,
  resolveChatRoom,
  resolvePresenceUsers,
} from '../src/pages/Cms/CmsShell/CmsLive.utils';
import {
  CMS_LIVE_TYPE_TASKS_UPDATE,
  CMS_LIVE_TYPE_CHAT_ROOM,
  CMS_LIVE_TYPE_CHAT_MESSAGE,
  CMS_LIVE_TYPE_PRESENCE,
} from '../src/pages/Cms/CmsShell/CmsLive.const';
import type { CmsChatRoom } from '../src/pages/Cms/CmsShell/CmsLive.types';
import { TASK_STATUS } from '../src/pages/Cms/TasksPages/TasksPages.const';

test('CMS-107: Live Task Board + Crew Chat Rooms', async (t) => {
  await t.test('sameMembers should correctly compare member lists regardless of order', () => {
    assert.equal(sameMembers(['u1', 'u2'], ['u2', 'u1']), true);
    assert.equal(sameMembers(['u1'], ['u1', 'u2']), false);
    assert.equal(sameMembers(['u1', 'u2'], ['u1', 'u3']), false);
  });

  await t.test('presencePingBody should format presence payload correctly', () => {
    const json = presencePingBody({
      name: 'John Developer',
      avatar: 'https://example.com/avatar.png',
      availability: 'busy',
    });
    const parsed = JSON.parse(json);
    assert.equal(parsed.name, 'John Developer');
    assert.equal(parsed.avatar, 'https://example.com/avatar.png');
    assert.equal(parsed.availability, 'busy');
  });

  await t.test('mergeChatRooms should merge rooms and deduplicate chat messages', () => {
    const existing: CmsChatRoom[] = [
      {
        id: 'room-1',
        userIds: ['user-a', 'user-b'],
        tag: 'support',
        messages: [
          {
            id: 'msg-1',
            userId: 'user-a',
            name: 'User A',
            body: 'Hello team',
            at: '2026-10-24T08:00:00Z',
          },
        ],
      },
    ];

    const incoming: CmsChatRoom[] = [
      {
        id: 'room-1',
        userIds: ['user-a', 'user-b', 'user-c'],
        tag: 'support',
        messages: [
          {
            id: 'msg-1',
            userId: 'user-a',
            name: 'User A',
            body: 'Hello team',
            at: '2026-10-24T08:00:00Z',
          },
          {
            id: 'msg-2',
            userId: 'user-b',
            name: 'User B',
            body: 'Hi User A!',
            at: '2026-10-24T08:01:00Z',
          },
        ],
      },
      {
        id: 'room-2',
        userIds: ['user-a', 'user-d'],
        tag: '',
        messages: [],
      },
    ];

    const merged = mergeChatRooms(existing, incoming);
    assert.equal(merged.length, 2);

    const room1 = merged.find((r) => r.id === 'room-1');
    assert.ok(room1);
    assert.deepEqual(room1.userIds, ['user-a', 'user-b', 'user-c']);
    assert.equal(room1.messages.length, 2);
    assert.equal(room1.messages[1].id, 'msg-2');
  });

  await t.test('parseLiveSocketPayload should parse task updates and chat events', () => {
    const tasksUpdateJson = JSON.stringify({
      type: CMS_LIVE_TYPE_TASKS_UPDATE,
      tasks: [
        {
          id: 'task-100',
          title: 'Implement live task broadcast',
          status: TASK_STATUS.DONE,
        },
      ],
      board: {
        statuses: [{ id: TASK_STATUS.DONE, label: 'Done' }],
      },
    });

    const parsedTask = parseLiveSocketPayload(tasksUpdateJson);
    assert.ok(parsedTask);
    assert.equal(parsedTask.type, CMS_LIVE_TYPE_TASKS_UPDATE);
    assert.equal((parsedTask.tasks as any[])[0].title, 'Implement live task broadcast');

    const chatMsgJson = JSON.stringify({
      type: CMS_LIVE_TYPE_CHAT_MESSAGE,
      roomId: 'room-1',
      room: {
        id: 'room-1',
        userIds: ['u1', 'u2'],
        tag: 'dev',
        messages: [],
      },
    });

    const parsedChat = parseLiveSocketPayload(chatMsgJson);
    assert.ok(parsedChat);
    assert.equal(parsedChat.type, CMS_LIVE_TYPE_CHAT_MESSAGE);
  });

  await t.test('resolvePresenceUsers should sanitize presence roster from live socket', () => {
    const raw = [
      { id: 'u1', name: 'Alice', availability: 'online' },
      { id: 'u2', name: 'Bob', availability: 'away' },
      null,
      'invalid',
    ];

    const resolved = resolvePresenceUsers(raw);
    assert.equal(resolved.length, 2);
    assert.equal(resolved[0].name, 'Alice');
    assert.equal(resolved[1].name, 'Bob');
  });
});
