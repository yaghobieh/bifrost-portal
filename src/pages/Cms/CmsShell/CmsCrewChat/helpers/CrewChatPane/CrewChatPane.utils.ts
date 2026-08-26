import { EMPTY_STRING } from '@const/index';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { CmsChatMessage } from '../../../CmsLive.types';

export const threadDistanceFromBottom = (thread: HTMLDivElement): number =>
  thread.scrollHeight - thread.scrollTop - thread.clientHeight;

export const isThreadStuck = (distance: number, stickPx: number): boolean => distance <= stickPx;

export const lastMessageId = (messages: CmsChatMessage[] | undefined): string => {
  if (!messages || messages.length === NUMBER_ZERO) {
    return EMPTY_STRING;
  }
  return messages[messages.length - 1].id;
};
