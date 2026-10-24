export type TaskStatusId = string;

export type TaskSubtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type TaskLinkedItem = {
  id: string;
  title: string;
  type?: string;
  url?: string;
};

export type TaskComment = {
  id: string;
  userId: string;
  userName: string;
  body: string;
  createdAt: string;
};

export type CmsTask = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  acceptanceCriteria?: string;
  subtasks?: TaskSubtask[];
  linkedItems?: TaskLinkedItem[];
  comments?: TaskComment[];
  reporter?: string;
  createdAt?: string;
  tags: string[];
  agentIds: string[];
  status: TaskStatusId;
  fieldValues: Record<string, string>;
  movedAt: string;
};

export type TaskStatusConfig = {
  id: string;
  label: string;
};

export type TaskFieldConfig = {
  id: string;
  label: string;
  options: string[];
};

export type TaskBoardConfig = {
  statuses: TaskStatusConfig[];
  fields: TaskFieldConfig[];
  tags: string[];
};

export type TaskCreateDraft = {
  title: string;
  subtitle: string;
  description: string;
  acceptanceCriteria?: string;
  subtasks?: TaskSubtask[];
  linkedItems?: TaskLinkedItem[];
  comments?: TaskComment[];
  reporter?: string;
  tags: string[];
  agentIds: string[];
  status: TaskStatusId;
  fieldValues: Record<string, string>;
};
