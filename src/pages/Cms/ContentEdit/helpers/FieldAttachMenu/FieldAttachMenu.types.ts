import type { ReactNode } from 'react';

export type FieldAttachMenuProps = {
  fieldName: string;
  attachLabel: string;
  hideLabel: string;
  roleLabels: Record<string, string>;
  onAttach: (fieldName: string) => void;
  onHideRole: (fieldName: string, role: string) => void;
  children: ReactNode;
};
