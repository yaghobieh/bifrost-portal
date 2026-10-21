import type { ChangeEvent } from 'react';
import type { ContentItem, ContentStatus } from '@sdk/modules/content';
import type { Messages } from '@i18n/types';

export type BlogSavePayloadInput = {
  base: Record<string, unknown>;
  excerpt: string;
  bodyHtml: string;
  seoTitle: string;
  seoDescription: string;
  category: string;
  tags: string;
  author: string;
  scheduleAt: string;
  cover: string;
  createdBy: string;
  updatedBy: string;
};

export type BlogSelectOption = {
  value: string;
  label: string;
};

export type UseBlogEditResult = {
  t: Messages;
  loading: boolean;
  saving: boolean;
  item: ContentItem | undefined;
  title: string;
  excerpt: string;
  bodyHtml: string;
  seoTitle: string;
  seoDescription: string;
  status: ContentStatus;
  slug: string;
  category: string;
  tags: string;
  author: string;
  scheduleAt: string;
  cover: string;
  saveOk: boolean;
  routePrefix: string;
  categoryOptions: BlogSelectOption[];
  seoTitleCount: string;
  seoDescCount: string;
  statusOrder: readonly ContentStatus[];
  onBack: () => void;
  onSave: () => Promise<void>;
  onTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExcerptChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSeoTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSeoDescriptionChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTagsChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAuthorChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onScheduleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCoverChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBodyChange: (next: string) => void;
  onStatus: (value: ContentStatus) => void;
  onCategoryChange: (value: unknown) => void;
};
