export type ContentRowActionsProps = {
  id: string;
  openLabel: string;
  moreLabel: string;
  stageLabel: string;
  deleteLabel: string;
  deleteTitle: string;
  deleteBody: string;
  deleteConfirm: string;
  deleteCancel: string;
  deleting: boolean;
  onOpen: (id: string) => void;
  onStage: (id: string) => void;
  onDelete: (id: string) => void;
};
