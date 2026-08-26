import {
  CONTENT_TYPE_JSON,
  GONE_PAYLOAD,
  HTTP_STATUS_GONE,
} from '../../../../server/cmsDocs.const';

export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  return new Response(JSON.stringify(GONE_PAYLOAD), {
    status: HTTP_STATUS_GONE,
    headers: { 'Content-Type': CONTENT_TYPE_JSON },
  });
}
