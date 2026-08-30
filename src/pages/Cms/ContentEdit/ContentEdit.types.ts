import type { ContentStatus } from '@sdk/modules/content';
import type { CONTENT_EDIT_KIND } from './ContentEdit.const';

export type BearWidgetDef = {
  id: string;
  label: string;
  bearComponent: string;
  html: string;
};

export type ContentEditKind =
  (typeof CONTENT_EDIT_KIND)[keyof typeof CONTENT_EDIT_KIND];

export type ContentRevision = {
  id: string;
  title: string;
  bodyHtml: string;
  status: ContentStatus;
  savedAt: string;
};

export type PreviewResizeParams = {
  startX: number;
  startWidth: number;
  minWidth: number;
  onWidth: (width: number) => void;
};

export type ContentEditTarget = {
  kind: ContentEditKind;
  id: string;
  title: string;
  slug: string;
  status: ContentStatus | string;
  bodyHtml: string;
  collection?: string;
  locale?: string;
  payload?: Record<string, unknown>;
  mediaUrl?: string | null;
};
