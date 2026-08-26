import { requestWithError } from '@sdk/http';
import {
  CONTENT_TYPE_JSON,
  HEADER_CONTENT_TYPE,
  HTTP_METHOD_POST,
  TRANSLATE_CATALOGS_PATH,
} from './Plans.const';
import type { TranslateCatalogsBody, TranslateCatalogsResponse } from './Plans.types';

export const postTranslateCatalogs = async (params: {
  locales: readonly string[];
}): Promise<TranslateCatalogsResponse> => {
  const { locales } = params;
  const body: TranslateCatalogsBody = { locales: [...locales] };
  const response = await requestWithError(
    TRANSLATE_CATALOGS_PATH,
    {
      method: HTTP_METHOD_POST,
      headers: { [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON },
      body: JSON.stringify(body),
    },
    { silent: true, code: 'plans' },
  );
  if (!response.ok) {
    throw new Error(TRANSLATE_CATALOGS_PATH);
  }
  const payload = (await response.json()) as TranslateCatalogsResponse;
  if (!payload.translated) {
    throw new Error(TRANSLATE_CATALOGS_PATH);
  }
  return payload;
};
