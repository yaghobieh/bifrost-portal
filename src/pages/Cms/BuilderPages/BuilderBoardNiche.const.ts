import type { Messages } from '@i18n/types';

export const INIT_FALLBACK = (tasks: Messages['cmsTasks']) => ({
  todo: tasks.todo,
  inProgress: tasks.inProgress,
  decline: tasks.decline,
  inReview: tasks.inReview,
  done: tasks.done,
});
