import { useState, type FC, type MouseEvent } from 'react';
import { AlertDialog, BearIcons, Dropdown } from '@forgedevstack/bear';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import { CONTENT_MORE_MENU_MIN_WIDTH, CONTENT_STATUS_DRAFT } from '@pages/Cms/ContentPages/ContentPages.const';
import {
  CONTENT_ACTIONS_CLASS,
  CONTENT_ICON_BTN_CLASS,
  CONTENT_LINK_CLASS,
  CONTENT_MENU_KEY_DELETE,
  CONTENT_MENU_KEY_DRAFT,
  CONTENT_MENU_KEY_DUPLICATE,
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
    openLabel,
    moreLabel,
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
  return (
    <div className={CONTENT_ACTIONS_CLASS}>
      <button type="button" className={CONTENT_LINK_CLASS} onClick={stopOpen}>
        {openLabel}
      </button>
      <Dropdown
        placement={CONTENT_MENU_PLACEMENT}
        minWidth={CONTENT_MORE_MENU_MIN_WIDTH}
        trigger={
          <button type="button" className={CONTENT_ICON_BTN_CLASS} aria-label={moreLabel}>
            <BearIcons.MoreHorizIcon size={CMS_ICON_SIZE} />
          </button>
        }
        items={[
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
          {
            key: CONTENT_MENU_KEY_DELETE,
            label: deleteLabel,
            onClick: onAskDelete,
          },
        ]}
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
