import type { ContentKind } from './ContentPages.const';
import type { Messages } from '@i18n/types';
import type { ColumnDefinition } from '@forgedevstack/grid-table';

export type ContentSelection =
  | { kind: 'page'; id: string }
  | { kind: 'item'; id: string }
  | null;

export type ContentTableRow = {
  id: string;
  kind: ContentKind;
  title: string;
  slug: string;
  collection: string;
  template: string;
  templateKind: string;
  fields: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  updated: string;
  updatedAt: string;
  catalog: boolean;
  [key: string]: unknown;
};

export type UseContentPagesResult = {
  t: Messages;
  saving: boolean;
  activeToken: string | null;
  error: unknown;
  loading: boolean;
  rows: ContentTableRow[];
  columns: ColumnDefinition<ContentTableRow>[];
  onNewPage: () => void;
  onOpenRow: (id: string) => void;
};

