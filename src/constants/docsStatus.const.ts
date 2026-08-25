export const DOCS_STATUS_IDLE = 'idle';
export const DOCS_STATUS_LOADING = 'loading';
export const DOCS_STATUS_READY = 'ready';
export const DOCS_STATUS_ERROR = 'error';

export type DocsStatus =
  | typeof DOCS_STATUS_IDLE
  | typeof DOCS_STATUS_LOADING
  | typeof DOCS_STATUS_READY
  | typeof DOCS_STATUS_ERROR;
