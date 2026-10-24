if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTask,
  createTaskId,
  collectTags,
} from '../src/pages/Cms/TasksPages/TasksPages.utils';
import { TASK_STATUS } from '../src/pages/Cms/TasksPages/TasksPages.const';
import type { TaskCreateDraft } from '../src/pages/Cms/TasksPages/TasksPages.types';

test('Task Issue Modal and Work Item Extensions (CMS-106)', async (t) => {
  await t.test('createTaskId should generate prefixed IDs', () => {
    const subtaskId = createTaskId('sub');
    const commentId = createTaskId('comment');
    const linkId = createTaskId('link');

    assert.ok(subtaskId.startsWith('sub-'));
    assert.ok(commentId.startsWith('comment-'));
    assert.ok(linkId.startsWith('link-'));
  });

  await t.test('createTask should preserve acceptance criteria, subtasks, links, comments, and reporter', () => {
    const draft: TaskCreateDraft = {
      title: 'Redesign navigation drawer',
      subtitle: 'UX enhancement',
      description: 'Implement two-column issue drawer',
      acceptanceCriteria: 'Must include 65/35 grid layout',
      subtasks: [
        { id: 'sub-1', title: 'Implement CSS grid', completed: true },
        { id: 'sub-2', title: 'Add comments stream', completed: false },
      ],
      linkedItems: [
        { id: 'link-1', title: 'CMS-226 Template Catalog', type: 'relates_to' },
      ],
      comments: [
        {
          id: 'com-1',
          userId: 'user-admin',
          userName: 'Admin User',
          body: 'Please make sure agents are notified via in-app notifications',
          createdAt: new Date().toISOString(),
        },
      ],
      reporter: 'admin@bifrost.dev',
      tags: ['ui', 'core'],
      agentIds: ['agent-1'],
      status: TASK_STATUS.IN_PROGRESS,
      fieldValues: { priority: 'high' },
    };

    const task = createTask(draft);

    assert.equal(task.title, 'Redesign navigation drawer');
    assert.equal(task.subtitle, 'UX enhancement');
    assert.equal(task.acceptanceCriteria, 'Must include 65/35 grid layout');
    assert.equal(task.subtasks.length, 2);
    assert.equal(task.subtasks[0].completed, true);
    assert.equal(task.subtasks[1].completed, false);
    assert.equal(task.linkedItems.length, 1);
    assert.equal(task.linkedItems[0].title, 'CMS-226 Template Catalog');
    assert.equal(task.comments.length, 1);
    assert.equal(task.comments[0].userName, 'Admin User');
    assert.equal(task.reporter, 'admin@bifrost.dev');
    assert.ok(task.createdAt);
  });

  await t.test('subtask completion progress calculations', () => {
    const subtasks = [
      { id: '1', title: 'Task 1', completed: true },
      { id: '2', title: 'Task 2', completed: false },
      { id: '3', title: 'Task 3', completed: true },
    ];
    const completedCount = subtasks.filter((s) => s.completed).length;
    const progressPercent = Math.round((completedCount / subtasks.length) * 100);

    assert.equal(completedCount, 2);
    assert.equal(progressPercent, 67);
  });

  await t.test('collectTags should merge task tags without duplicates', () => {
    const tasks = [
      {
        id: 't-1',
        title: 'Task 1',
        subtitle: '',
        description: '',
        tags: ['frontend', 'design'],
        agentIds: [],
        status: TASK_STATUS.TODO,
        fieldValues: {},
        movedAt: '',
      },
      {
        id: 't-2',
        title: 'Task 2',
        subtitle: '',
        description: '',
        tags: ['backend', 'frontend'],
        agentIds: [],
        status: TASK_STATUS.DONE,
        fieldValues: {},
        movedAt: '',
      },
    ];

    const tags = collectTags(tasks, ['general']);
    assert.deepEqual(tags.sort(), ['backend', 'design', 'frontend', 'general'].sort());
  });

  await t.test('status clearing supports unassigned status', () => {
    const emptyStatus = '';
    const task = createTask({
      title: 'Unassigned task',
      subtitle: '',
      description: '',
      tags: [],
      agentIds: [],
      status: emptyStatus,
      fieldValues: {},
    });

    assert.equal(task.status, '');
  });
});
