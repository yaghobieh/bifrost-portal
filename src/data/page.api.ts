import { ABORT_ERROR_NAME, PUBLIC_DOCS_PATH, PUBLIC_PAGES_PATH } from '@const/strings.const';
import { requestWithError } from '@sdk/http';
import { mapCmsDoc } from './docs.mapper';
import type { CmsDocItem, CmsDocsListResponse, DocPageModel } from './docs.types';
import type { CmsItemResponse, CmsPageItem } from './pages.types';

const inflightPages = new Map<string, Promise<CmsPageItem>>();

const fetchPublicPageRequest = async (slug: string): Promise<CmsPageItem> => {
  const response = await requestWithError(
    `${PUBLIC_PAGES_PATH}/${encodeURIComponent(slug)}`,
    undefined,
    { silent: true, code: 'pages' },
  );
  if (!response.ok) {
    throw new Error(slug);
  }
  const data = (await response.json()) as CmsItemResponse;
  const item = data.item;
  if (!item) {
    throw new Error(slug);
  }
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    payload: item.payload ?? {},
    status: item.status,
  };
};

const abortError = (): DOMException => new DOMException(ABORT_ERROR_NAME, ABORT_ERROR_NAME);

const withSignal = (pending: Promise<CmsPageItem>, signal: AbortSignal): Promise<CmsPageItem> => {
  if (signal.aborted) {
    return Promise.reject(abortError());
  }
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(abortError());
    signal.addEventListener('abort', onAbort, { once: true });
    pending.then(
      (item) => {
        signal.removeEventListener('abort', onAbort);
        resolve(item);
      },
      (error: unknown) => {
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
};

export const fetchPublicPage = (
  slug: string,
  signal?: AbortSignal,
): Promise<CmsPageItem> => {
  let pending = inflightPages.get(slug);
  if (!pending) {
    pending = fetchPublicPageRequest(slug).finally(() => {
      inflightPages.delete(slug);
    });
    inflightPages.set(slug, pending);
  }
  if (!signal) {
    return pending;
  }
  return withSignal(pending, signal);
};

export const fetchPublicDoc = async (
  slug: string,
  signal?: AbortSignal,
): Promise<DocPageModel> => {
  const item = await fetchPublicPage(slug, signal);
  return mapCmsDoc({
    slug: item.slug,
    title: item.title,
    payload: item.payload,
  });
};

export const fetchPublicDocsList = async (): Promise<CmsDocItem[]> => {
  const response = await requestWithError(PUBLIC_DOCS_PATH, undefined, {
    silent: true,
    code: 'pages',
  });
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as CmsDocsListResponse;
  if (!data.items || !Array.isArray(data.items)) {
    return [];
  }
  return data.items;
};
