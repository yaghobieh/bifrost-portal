import { NUMBER_ZERO } from '@const/numbers.const';
import { HASH_PREFIX } from '@const/strings.const';
import { DOC_SHELL_KEY_ESCAPE, DOC_SHELL_KEY_SEARCH } from './DocShell.const';
import type { DocShellTocItem } from './DocShell.types';

export const isDocShellSearchHotkey = (event: globalThis.KeyboardEvent): boolean =>
  (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === DOC_SHELL_KEY_SEARCH;

export const isDocShellEscape = (event: globalThis.KeyboardEvent): boolean =>
  event.key === DOC_SHELL_KEY_ESCAPE;

export const bindWindowKeydown = (
  onKey: (event: globalThis.KeyboardEvent) => void,
  eventName: keyof WindowEventMap,
): (() => void) => {
  const listener = (event: Event) => {
    onKey(event as globalThis.KeyboardEvent);
  };
  window.addEventListener(eventName, listener);
  return () => window.removeEventListener(eventName, listener);
};

export const hasTocItems = (toc: DocShellTocItem[] | undefined): toc is DocShellTocItem[] =>
  Boolean(toc && toc.length > NUMBER_ZERO);

export const tocItemClass = (item: DocShellTocItem, activeToc?: string): string => {
  if (item.id === activeToc) {
    return 'Bp-toc__item is-active';
  }
  if (item.sub) {
    return 'Bp-toc__item is-sub';
  }
  return 'Bp-toc__item';
};

export const tocItemHash = (id: string): string => `${HASH_PREFIX}${id}`;

export const docShellTabClass = (active: boolean): string => {
  if (active) {
    return 'Bp-nav__link is-active';
  }
  return 'Bp-nav__link';
};
