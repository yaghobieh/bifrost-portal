import { ABORT_ERROR_NAME } from '@const/strings.const';
import { mapSitePage } from '@data/pages.mapper';
import type { AskAiFromItemParams, AskAiPageModel } from './AskAi.types';

export const isAbortError = (error: unknown): boolean => {
  if (!(error instanceof DOMException)) {
    return false;
  }
  return error.name === ABORT_ERROR_NAME;
};

export const askAiPageFromItem = (params: AskAiFromItemParams): AskAiPageModel | null => {
  const { item } = params;
  if (!item) {
    return null;
  }
  const page = mapSitePage(item.slug, item.title, item.payload);
  return {
    title: page.title,
    lead: page.lead,
    body: page.body,
    note: page.note,
  };
};
