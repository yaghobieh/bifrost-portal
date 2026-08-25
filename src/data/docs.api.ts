import { PUBLIC_DOCS_PATH } from '@const/strings.const';
import { mapCmsDoc } from './docs.mapper';
import type { CmsDocsListResponse, DocPageModel } from './docs.types';

export const fetchPortalDocs = async (): Promise<Record<string, DocPageModel>> => {
  const response = await fetch(PUBLIC_DOCS_PATH);
  if (!response.ok) {
    throw new Error(PUBLIC_DOCS_PATH);
  }
  const body = (await response.json()) as CmsDocsListResponse;
  const docs: Record<string, DocPageModel> = {};
  for (const item of body.items ?? []) {
    docs[item.slug] = mapCmsDoc(item);
  }
  return docs;
};
