import { useEffect, useState, type FC, type KeyboardEvent } from 'react';
import {
  Avatar,
  Badge,
  BearIcons,
  Button,
  Chip,
  Flex,
  Input,
  Modal,
  MultiSelect,
  Select,
  Typography,
} from '@forgedevstack/bear';
import { InkEditor } from '@forgedevstack/ink';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING } from '@const/index';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import { TASK_EDITOR_MIN_HEIGHT_PX, TASK_ISSUE_MODAL_ID } from '../TasksPages.const';
import { createTaskId, userDisplayName, userInitials } from '../TasksPages.utils';
import type { TaskComment, TaskCreateDraft, TaskLinkedItem, TaskSubtask } from '../TasksPages.types';
import type { TaskIssueModalProps } from './TaskIssueModal.types';

const toDraft = (task: TaskIssueModalProps['task']): TaskCreateDraft => ({
  title: task?.title ?? EMPTY_STRING,
  subtitle: task?.subtitle ?? EMPTY_STRING,
  description: task?.description ?? EMPTY_STRING,
  acceptanceCriteria: task?.acceptanceCriteria ?? EMPTY_STRING,
  subtasks: task?.subtasks ?? [],
  linkedItems: task?.linkedItems ?? [],
  comments: task?.comments ?? [],
  reporter: task?.reporter ?? EMPTY_STRING,
  tags: task?.tags ?? [],
  agentIds: task?.agentIds ?? [],
  status: task?.status ?? EMPTY_STRING,
  fieldValues: task?.fieldValues ?? {},
});

export const TaskIssueModal: FC<TaskIssueModalProps> = (props) => {
  const {
    isOpen,
    task,
    allTasks = [],
    currentUserId = EMPTY_STRING,
    currentUserName = 'Editor',
    onClose,
    onSave,
    users,
    board,
    onCreateTag,
    colorMode,
    canEdit,
  } = props;
  const { t } = useI18n();

  const [draft, setDraft] = useState<TaskCreateDraft>(() => toDraft(task));
  const [newSubtask, setNewSubtask] = useState(EMPTY_STRING);
  const [newLinkedTitle, setNewLinkedTitle] = useState(EMPTY_STRING);
  const [newLinkedUrl, setNewLinkedUrl] = useState(EMPTY_STRING);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [commentText, setCommentText] = useState(EMPTY_STRING);
  const [tagInput, setTagInput] = useState(EMPTY_STRING);

  useEffect(() => {
    setDraft(toDraft(task));
    setNewSubtask(EMPTY_STRING);
    setNewLinkedTitle(EMPTY_STRING);
    setNewLinkedUrl(EMPTY_STRING);
    setIsAddingLink(false);
    setCommentText(EMPTY_STRING);
    setTagInput(EMPTY_STRING);
  }, [task, isOpen]);

  // Autocomplete detection for @ mentions and ! tags in comment composer
  const atIndex = commentText.lastIndexOf('@');
  const exIndex = commentText.lastIndexOf('!');
  const showUserMentions =
    atIndex >= 0 && !commentText.slice(atIndex + 1).includes(' ');
  const userMentionQuery = showUserMentions
    ? commentText.slice(atIndex + 1).toLowerCase()
    : EMPTY_STRING;

  const showTagMentions =
    exIndex >= 0 && !commentText.slice(exIndex + 1).includes(' ');
  const tagMentionQuery = showTagMentions
    ? commentText.slice(exIndex + 1).toLowerCase()
    : EMPTY_STRING;

  const userSuggestions = showUserMentions
    ? users.filter((u) =>
        userDisplayName(u).toLowerCase().includes(userMentionQuery),
      )
    : [];

  const tagSuggestions = showTagMentions
    ? board.tags.filter((tVal) => tVal.toLowerCase().includes(tagMentionQuery))
    : [];

  const handleInsertUserMention = (name: string) => {
    const before = commentText.slice(0, atIndex);
    setCommentText(`${before}@${name} `);
  };

  const handleInsertTagMention = (tag: string) => {
    const before = commentText.slice(0, exIndex);
    setCommentText(`${before}!${tag} `);
  };

  // Subtask management
  const handleAddSubtask = () => {
    const text = newSubtask.trim();
    if (!text || !canEdit) return;
    const subtask: TaskSubtask = {
      id: createTaskId('sub'),
      title: text,
      completed: false,
    };
    setDraft((curr) => ({
      ...curr,
      subtasks: [...(curr.subtasks ?? []), subtask],
    }));
    setNewSubtask(EMPTY_STRING);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!canEdit) return;
    setDraft((curr) => ({
      ...curr,
      subtasks: (curr.subtasks ?? []).map((item) =>
        item.id === subtaskId ? { ...item, completed: !item.completed } : item,
      ),
    }));
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!canEdit) return;
    setDraft((curr) => ({
      ...curr,
      subtasks: (curr.subtasks ?? []).filter((item) => item.id !== subtaskId),
    }));
  };

  // Linked items management
  const handleAddLinkedItem = () => {
    const title = newLinkedTitle.trim();
    if (!title || !canEdit) return;
    const link: TaskLinkedItem = {
      id: createTaskId('link'),
      title,
      url: newLinkedUrl.trim() || undefined,
    };
    setDraft((curr) => ({
      ...curr,
      linkedItems: [...(curr.linkedItems ?? []), link],
    }));
    setNewLinkedTitle(EMPTY_STRING);
    setNewLinkedUrl(EMPTY_STRING);
    setIsAddingLink(false);
  };

  const handleDeleteLinkedItem = (linkId: string) => {
    if (!canEdit) return;
    setDraft((curr) => ({
      ...curr,
      linkedItems: (curr.linkedItems ?? []).filter((item) => item.id !== linkId),
    }));
  };

  // Comments management
  const handleSaveComment = () => {
    const body = commentText.trim();
    if (!body || !canEdit) return;
    const comment: TaskComment = {
      id: createTaskId('cmt'),
      userId: currentUserId || 'editor',
      userName: currentUserName || 'Editor',
      body,
      createdAt: new Date().toISOString(),
    };

    setDraft((curr) => ({
      ...curr,
      comments: [...(curr.comments ?? []), comment],
    }));
    setCommentText(EMPTY_STRING);
  };

  // Tag creation
  const handleCreateTag = () => {
    const next = tagInput.trim().toLowerCase();
    if (!next || !canEdit) return;
    onCreateTag(next);
    setDraft((curr) => ({
      ...curr,
      tags: curr.tags.includes(next) ? curr.tags : [...curr.tags, next],
    }));
    setTagInput(EMPTY_STRING);
  };

  const completedSubtasks = (draft.subtasks ?? []).filter((s) => s.completed).length;
  const totalSubtasks = draft.subtasks?.length ?? 0;

  const statusOptions = [
    { value: EMPTY_STRING, label: t.cmsTasks.noStatus },
    ...board.statuses.map((s) => ({ value: s.id, label: s.label })),
  ];

  const agentOptions = users.map((u) => ({
    value: u.id,
    label: userDisplayName(u),
  }));

  const tagOptions = board.tags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const reporterName =
    draft.reporter ||
    task?.reporter ||
    (users.length > 0 ? userDisplayName(users[0]) : currentUserName);

  return (
    <Modal
      id={TASK_ISSUE_MODAL_ID}
      isOpen={isOpen}
      onClose={onClose}
      title={task?.id ? `${task.id.toUpperCase()} - ${draft.title || t.cmsTasks.issueTitle}` : (draft.title || t.cmsTasks.issueTitle)}
      size="xl"
      className="bifrost-cms-task-modal"
      footer={
        <Flex justify="between" align="center" style={{ width: '100%' }}>
          <Typography variant="caption" className="bifrost-cms__muted mb-0">
            {task?.movedAt ? `${t.cmsTasks.updated}: ${new Date(task.movedAt).toLocaleDateString()}` : EMPTY_STRING}
          </Typography>
          <Flex justify="end" gap={2}>
            <Button variant="outline" onClick={onClose}>
              {t.cmsTasks.cancel}
            </Button>
            {canEdit ? (
              <Button
                variant="primary"
                disabled={!draft.title.trim() || !task}
                onClick={() => {
                  if (!task) return;
                  onSave(task.id, draft);
                  onClose();
                }}
              >
                {t.cmsTasks.saveIssue}
              </Button>
            ) : null}
          </Flex>
        </Flex>
      }
    >
      <div className="bifrost-cms-task-modal__layout">
        {/* Main Column (~65%) */}
        <div className="bifrost-cms-task-modal__main">
          {/* Title & Subtitle */}
          <Flex direction="column" gap={2}>
            <Input
              label={t.cmsTasks.taskTitle}
              value={draft.title}
              disabled={!canEdit}
              onChange={(e) => setDraft((curr) => ({ ...curr, title: e.target.value }))}
            />
            <Input
              label={t.cmsTasks.subtitleLabel}
              value={draft.subtitle}
              disabled={!canEdit}
              onChange={(e) => setDraft((curr) => ({ ...curr, subtitle: e.target.value }))}
            />
          </Flex>

          {/* Description */}
          <div>
            <div className="bifrost-cms-task-modal__section-title">
              {t.cmsTasks.description}
            </div>
            <InkEditor
              value={draft.description}
              onChange={(val) => setDraft((curr) => ({ ...curr, description: val }))}
              minHeight={TASK_EDITOR_MIN_HEIGHT_PX}
              colorMode={colorMode}
              features={{ blocks: true, slash: true }}
            />
          </div>

          {/* Acceptance Criteria */}
          <div>
            <div className="bifrost-cms-task-modal__section-title">
              {t.cmsTasks.acceptanceCriteria}
            </div>
            <InkEditor
              value={draft.acceptanceCriteria ?? EMPTY_STRING}
              onChange={(val) => setDraft((curr) => ({ ...curr, acceptanceCriteria: val }))}
              minHeight={120}
              colorMode={colorMode}
              features={{ blocks: true, slash: true }}
            />
          </div>

          {/* Subtasks */}
          <div>
            <Flex justify="between" align="center" className="mb-2">
              <span className="bifrost-cms-task-modal__section-title mb-0">
                {t.cmsTasks.subtasks}
              </span>
              {totalSubtasks > 0 ? (
                <Badge variant={completedSubtasks === totalSubtasks ? 'success' : 'neutral'}>
                  {completedSubtasks} / {totalSubtasks}
                </Badge>
              ) : null}
            </Flex>

            <Flex direction="column" gap={2}>
              {(draft.subtasks ?? []).map((subtask) => (
                <div key={subtask.id} className="bifrost-cms-task-subtask-item">
                  <Flex align="center" gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      disabled={!canEdit}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      style={{ cursor: canEdit ? 'pointer' : 'default' }}
                    />
                    <span
                      style={{
                        textDecoration: subtask.completed ? 'line-through' : 'none',
                        opacity: subtask.completed ? 0.6 : 1,
                        fontSize: '0.875rem',
                        wordBreak: 'break-word',
                      }}
                    >
                      {subtask.title}
                    </span>
                  </Flex>
                  {canEdit ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      aria-label="Delete subtask"
                    >
                      <BearIcons.Action.DeleteIcon size={14} />
                    </Button>
                  ) : null}
                </div>
              ))}

              {canEdit ? (
                <Flex gap={2} align="center">
                  <Input
                    placeholder={t.cmsTasks.subtaskPlaceholder}
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  <Button size="sm" variant="outline" onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                    <BearIcons.PlusIcon size={CMS_ICON_SIZE} />
                    {t.cmsTasks.addSubtask}
                  </Button>
                </Flex>
              ) : null}
            </Flex>
          </div>

          {/* Linked Work Items */}
          <div>
            <div className="bifrost-cms-task-modal__section-title">
              {t.cmsTasks.linkedItems}
            </div>
            <Flex direction="column" gap={2}>
              {(draft.linkedItems ?? []).map((link) => (
                <div key={link.id} className="bifrost-cms-task-link-item">
                  <Flex align="center" gap={2}>
                    <BearIcons.LinkIcon size={14} />
                    {link.url ? (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem' }}>
                        {link.title}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.875rem' }}>{link.title}</span>
                    )}
                  </Flex>
                  {canEdit ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteLinkedItem(link.id)}
                      aria-label="Delete linked item"
                    >
                      <BearIcons.Action.DeleteIcon size={14} />
                    </Button>
                  ) : null}
                </div>
              ))}

              {canEdit && isAddingLink ? (
                <Flex direction="column" gap={2} style={{ padding: '0.5rem', border: '1px dashed var(--bifrost-border-subtle, #cbd5e1)', borderRadius: '0.5rem' }}>
                  {allTasks.length > 0 ? (
                    <Select
                      label={t.cmsTasks.linkedItems}
                      options={[
                        { value: EMPTY_STRING, label: t.cmsTasks.pickEmpty },
                        ...allTasks
                          .filter((item) => item.id !== task?.id)
                          .map((item) => ({ value: item.title, label: `${item.title} (${item.id})` })),
                      ]}
                      value={newLinkedTitle}
                      onChange={(val) => setNewLinkedTitle(val)}
                    />
                  ) : null}
                  <Input
                    placeholder={t.cmsTasks.linkedItemPlaceholder}
                    value={newLinkedTitle}
                    onChange={(e) => setNewLinkedTitle(e.target.value)}
                  />
                  <Input
                    placeholder="URL (optional)"
                    value={newLinkedUrl}
                    onChange={(e) => setNewLinkedUrl(e.target.value)}
                  />
                  <Flex gap={2} justify="end">
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingLink(false)}>
                      {t.cmsTasks.cancel}
                    </Button>
                    <Button size="sm" variant="primary" disabled={!newLinkedTitle.trim()} onClick={handleAddLinkedItem}>
                      {t.cmsTasks.addLinkedItem}
                    </Button>
                  </Flex>
                </Flex>
              ) : canEdit ? (
                <Button size="sm" variant="outline" onClick={() => setIsAddingLink(true)}>
                  <BearIcons.PlusIcon size={CMS_ICON_SIZE} />
                  {t.cmsTasks.addLinkedItem}
                </Button>
              ) : null}
            </Flex>
          </div>

          {/* Activity & Comments */}
          <div>
            <div className="bifrost-cms-task-modal__section-title">
              {t.cmsTasks.comments}
            </div>

            {/* List of comments */}
            <Flex direction="column" gap={2} className="mb-3">
              {(draft.comments ?? []).map((comment) => (
                <div key={comment.id} className="bifrost-cms-task-comment">
                  <div className="bifrost-cms-task-comment__header">
                    <Flex align="center" gap={2}>
                      <Avatar
                        initials={comment.userName ? comment.userName.slice(0, 2).toUpperCase() : 'U'}
                        alt={comment.userName}
                        size="sm"
                      />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                        {comment.userName}
                      </span>
                    </Flex>
                    <Typography variant="caption" className="bifrost-cms__muted mb-0">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </div>
                  <div style={{ fontSize: '0.875rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {comment.body}
                  </div>
                </div>
              ))}
            </Flex>

            {/* Comment Composer */}
            {canEdit ? (
              <div style={{ position: 'relative' }}>
                {/* Mentions popup for @ or ! */}
                {userSuggestions.length > 0 ? (
                  <div className="bifrost-cms-task-mention-popup">
                    <Typography variant="caption" className="bifrost-cms__muted" style={{ padding: '0.25rem 0.5rem' }}>
                      {t.cmsTasks.agent}
                    </Typography>
                    {userSuggestions.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        className="bifrost-cms-task-mention-option"
                        onClick={() => handleInsertUserMention(userDisplayName(u))}
                      >
                        <Avatar initials={userInitials(u, 2)} alt={userDisplayName(u)} size="xs" />
                        <span>{userDisplayName(u)}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {tagSuggestions.length > 0 ? (
                  <div className="bifrost-cms-task-mention-popup">
                    <Typography variant="caption" className="bifrost-cms__muted" style={{ padding: '0.25rem 0.5rem' }}>
                      {t.cmsTasks.tags}
                    </Typography>
                    {tagSuggestions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="bifrost-cms-task-mention-option"
                        onClick={() => handleInsertTagMention(tag)}
                      >
                        <BearIcons.TagIcon size={12} />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <Flex direction="column" gap={2}>
                  <textarea
                    rows={3}
                    placeholder={t.cmsTasks.writeComment}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--bifrost-border-subtle, #cbd5e1)',
                      background: 'transparent',
                      color: 'inherit',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                  <Flex justify="between" align="center">
                    <Typography variant="caption" className="bifrost-cms__muted mb-0">
                      {t.cmsTasks.mentionHint}
                    </Typography>
                    <Flex gap={2}>
                      {commentText ? (
                        <Button size="sm" variant="ghost" onClick={() => setCommentText(EMPTY_STRING)}>
                          {t.cmsTasks.cancel}
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={!commentText.trim()}
                        onClick={handleSaveComment}
                      >
                        {t.cmsTasks.saveComment}
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </div>
            ) : null}
          </div>
        </div>

        {/* Details Sidebar (~35%) */}
        <div className="bifrost-cms-task-modal__details">
          <div className="bifrost-cms-task-modal__section-title">
            {t.cmsTasks.details}
          </div>

          {/* Status - allows selecting a status or clearing/removing it */}
          <div>
            <Typography variant="caption" className="mb-1">
              {t.cmsTasks.status}
            </Typography>
            <Select
              options={statusOptions}
              value={draft.status}
              disabled={!canEdit}
              onChange={(value) => setDraft((curr) => ({ ...curr, status: value }))}
            />
          </div>

          {/* Agents / Assignee - MultiSelect */}
          <div>
            <Typography variant="caption" className="mb-1">
              {t.cmsTasks.agent}
            </Typography>
            <MultiSelect
              options={agentOptions}
              value={draft.agentIds}
              disabled={!canEdit}
              placeholder={t.cmsTasks.agentPick}
              onChange={(vals) => setDraft((curr) => ({ ...curr, agentIds: vals }))}
            />
          </div>

          {/* Tags - MultiSelect + quick add */}
          <div>
            <Typography variant="caption" className="mb-1">
              {t.cmsTasks.tags}
            </Typography>
            <MultiSelect
              options={tagOptions}
              value={draft.tags}
              disabled={!canEdit}
              placeholder={t.cmsTasks.tags}
              onChange={(vals) => setDraft((curr) => ({ ...curr, tags: vals }))}
            />
            {canEdit ? (
              <Flex gap={2} align="center" className="mt-2">
                <Input
                  placeholder={t.cmsTasks.tagCreate}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateTag();
                    }
                  }}
                  style={{ flex: 1 }}
                />
                <Button size="sm" variant="outline" disabled={!tagInput.trim()} onClick={handleCreateTag}>
                  {t.cmsTasks.tagAdd}
                </Button>
              </Flex>
            ) : null}
          </div>

          {/* Custom Board Fields */}
          {board.fields.map((field) => (
            <div key={field.id}>
              <Typography variant="caption" className="mb-1">
                {field.label}
              </Typography>
              <Select
                value={draft.fieldValues[field.id] ?? EMPTY_STRING}
                disabled={!canEdit}
                onChange={(value) =>
                  setDraft((curr) => ({
                    ...curr,
                    fieldValues: { ...curr.fieldValues, [field.id]: String(value) },
                  }))
                }
                options={[
                  { value: EMPTY_STRING, label: t.cmsTasks.fieldNone },
                  ...field.options.map((opt) => ({ value: opt, label: opt })),
                ]}
              />
            </div>
          ))}

          {/* Reporter / Author */}
          <div>
            <Typography variant="caption" className="mb-1">
              {t.cmsTasks.reporter}
            </Typography>
            <Flex align="center" gap={2}>
              <Avatar initials={reporterName ? reporterName.slice(0, 2).toUpperCase() : 'U'} alt={reporterName} size="xs" />
              <span style={{ fontSize: '0.875rem' }}>{reporterName}</span>
            </Flex>
          </div>

          {/* Timestamps */}
          <Flex direction="column" gap={1} style={{ fontSize: '0.8125rem', color: 'var(--bifrost-text-muted, #64748b)' }}>
            <div>
              <strong>{t.cmsTasks.created}:</strong>{' '}
              {task?.createdAt ? new Date(task.createdAt).toLocaleString() : 'Just now'}
            </div>
            <div>
              <strong>{t.cmsTasks.updated}:</strong>{' '}
              {task?.movedAt ? new Date(task.movedAt).toLocaleString() : 'Just now'}
            </div>
          </Flex>
        </div>
      </div>
    </Modal>
  );
};
