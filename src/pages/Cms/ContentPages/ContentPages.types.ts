import type { ContentKind } from './ContentPages.const';
import type { Messages } from '@i18n/types';
import type { PageStartCard, PageStartId } from './helpers/PageStart';
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
  startCards: PageStartCard[];
  columns: ColumnDefinition<ContentTableRow>[];
  newPageItems: Array<{
    key: string;
    label: string;
    onClick?: () => void;
    divider?: true;
  }>;
  onStartPage: (id: PageStartId) => void;
  onOpenRow: (id: string) => void;
};

