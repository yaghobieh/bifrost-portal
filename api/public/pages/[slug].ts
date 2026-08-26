import {
  CONTENT_TYPE_JSON,
  ERROR_DATABASE_UNAVAILABLE,
  ERROR_DOCS_UNAVAILABLE,
  ERROR_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from '../../../server/cmsDocs.const';
import { getPublishedPage } from '../../../server/cmsDocs';

export const config = { runtime: 'edge' };

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': CONTENT_TYPE_JSON },
  });

export default async function handler(request: Request): Promise<Response> {
  const databaseUrl = process.env.DATABASE_URL ?? '';
  if (!databaseUrl) {
    return json(HTTP_STATUS_SERVICE_UNAVAILABLE, { error: ERROR_DATABASE_UNAVAILABLE });
  }
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const slug = parts[parts.length - 1] ?? '';
  if (!slug) {
    return json(HTTP_STATUS_NOT_FOUND, { error: ERROR_NOT_FOUND });
  }
  try {
    const item = await getPublishedPage(databaseUrl, slug);
    if (!item) {
      return json(HTTP_STATUS_NOT_FOUND, { error: ERROR_NOT_FOUND });
    }
    return json(HTTP_STATUS_OK, { item });
  } catch {
    return json(HTTP_STATUS_INTERNAL_SERVER_ERROR, { error: ERROR_DOCS_UNAVAILABLE });
  }
}
