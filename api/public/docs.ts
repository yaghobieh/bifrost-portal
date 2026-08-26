import { listPublishedDocs } from '../../server/cmsDocs';
import {
  CONTENT_TYPE_JSON,
  ERROR_DATABASE_UNAVAILABLE,
  ERROR_DOCS_UNAVAILABLE,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_OK,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from '../../server/cmsDocs.const';

export const config = { runtime: 'edge' };

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': CONTENT_TYPE_JSON },
  });

export default async function handler(): Promise<Response> {
  const databaseUrl = process.env.DATABASE_URL ?? '';
  if (!databaseUrl) {
    return json(HTTP_STATUS_SERVICE_UNAVAILABLE, { error: ERROR_DATABASE_UNAVAILABLE });
  }
  try {
    const items = await listPublishedDocs(databaseUrl);
    return json(HTTP_STATUS_OK, { items });
  } catch {
    return json(HTTP_STATUS_INTERNAL_SERVER_ERROR, { error: ERROR_DOCS_UNAVAILABLE });
  }
}
