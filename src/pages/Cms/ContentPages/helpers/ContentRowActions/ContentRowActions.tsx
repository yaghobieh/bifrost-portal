import { useState, type FC, type MouseEvent } from 'react';
import { AlertDialog, BearIcons, Dropdown } from '@forgedevstack/bear';
import { CMS_ICON_SIZE, NUMBER_TWO_HUNDRED } from '@const/numbers.const';
import { CONTENT_STATUS_DRAFT } from '@pages/Cms/ContentPages/ContentPages.const';
import {
  CONTENT_ACTIONS_CLASS,
  CONTENT_ICON_BTN_CLASS,
  CONTENT_LINK_CLASS,
  CONTENT_MENU_KEY_DELETE,
  CONTENT_MENU_KEY_DRAFT,
  CONTENT_MENU_KEY_DUPLICATE,
  CONTENT_MENU_KEY_EDIT,
  CONTENT_MENU_KEY_HOMEPAGE,
  CONTENT_MENU_KEY_PUBLISH,
  CONTENT_MENU_KEY_STAGE,
  CONTENT_MENU_PLACEMENT,
} from './ContentRowActions.const';
import type { ContentRowActionsProps } from './ContentRowActions.types';

export const ContentRowActions: FC<ContentRowActionsProps> = (props) => {
  const {
    id,
    status,
    catalog,
    openLabel,
    moreLabel,
    editLabel,
    stageLabel,
    duplicateLabel,
    homepageLabel,
    draftLabel,
    publishLabel,
    deleteLabel,
    deleteTitle,
    deleteBody,
    deleteConfirm,
    deleteCancel,
    deleting,
    onOpen,
    onStage,
    onDuplicate,
    onHomepage,
    onDraft,
    onPublish,
    onDelete,
    onShare,
    shareLabel,
  } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const stopOpen = (event: MouseEvent) => {
    event.stopPropagation();
    onOpen(id);
  };
  const onAskDelete = () => {
    setConfirmOpen(true);
  };
  const onCloseConfirm = () => {
    if (deleting) {
      return;
    }
    setConfirmOpen(false);
  };
  const onConfirmDelete = () => {
    onDelete(id);
    setConfirmOpen(false);
  };
  const isDraft = status === CONTENT_STATUS_DRAFT;
  let statusKey = CONTENT_MENU_KEY_DRAFT;
  let statusLabel = draftLabel;
  let statusClick = () => onDraft(id);
  if (isDraft) {
    statusKey = CONTENT_MENU_KEY_PUBLISH;
    statusLabel = publishLabel;
    statusClick = () => onPublish(id);
  }
  const menuItems = [
    {
      key: CONTENT_MENU_KEY_EDIT,
      label: editLabel,
      onClick: () => onOpen(id),
    },
    ...(onShare
      ? [
          {
            key: 'share-cross-site',
            label: shareLabel || 'Share across sites',
            onClick: () => onShare(id),
          },
        ]
      : []),
    {
      key: CONTENT_MENU_KEY_STAGE,
      label: stageLabel,
      onClick: () => onStage(id),
    },
    {
      key: CONTENT_MENU_KEY_DUPLICATE,
      label: duplicateLabel,
      onClick: () => onDuplicate(id),
    },
    {
      key: CONTENT_MENU_KEY_HOMEPAGE,
      label: homepageLabel,
      onClick: () => onHomepage(id),
    },
    {
      key: statusKey,
      label: statusLabel,
      onClick: statusClick,
    },
  ];
  if (!catalog) {
    menuItems.push({
      key: CONTENT_MENU_KEY_DELETE,
      label: deleteLabel,
      onClick: onAskDelete,
    });
  }
  return (
    <div className={CONTENT_ACTIONS_CLASS}>
      <button
        type="button"
        className="px-2 py-1 text-xs font-semibold text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded flex items-center gap-1 transition-colors"
        onClick={stopOpen}
        title={editLabel}
      >
        <BearIcons.EditIcon size={12} className="text-gray-500 shrink-0" />
        <span>{editLabel || openLabel}</span>
      </button>

      {Boolean(onShare) && (
        <button
          type="button"
          className="p-1 text-gray-500 hover:text-[#1e3a8a] hover:bg-blue-50 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onShare?.(id);
          }}
          title={shareLabel || 'Share across sites'}
          aria-label={shareLabel || 'Share'}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
          </svg>
        </button>
      )}

      {!catalog && (
        <button
          type="button"
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onAskDelete();
          }}
          title={deleteLabel}
          aria-label={deleteLabel}
        >
          <BearIcons.DeleteIcon size={13} />
        </button>
      )}

      <Dropdown
        placement={CONTENT_MENU_PLACEMENT}
        minWidth={NUMBER_TWO_HUNDRED}
        trigger={
          <button type="button" className={CONTENT_ICON_BTN_CLASS} aria-label={moreLabel}>
            <BearIcons.MoreHorizIcon size={CMS_ICON_SIZE} />
          </button>
        }
        items={menuItems}
      />
      <AlertDialog
        isOpen={confirmOpen}
        onClose={onCloseConfirm}
        onConfirm={onConfirmDelete}
        title={deleteTitle}
        description={deleteBody}
        confirmText={deleteConfirm}
        cancelText={deleteCancel}
        confirmVariant="danger"
        loading={deleting}
      />
    </div>
  );
};
