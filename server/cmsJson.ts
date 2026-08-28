import { CONTENT_TYPE_JSON } from './cmsDocs.const';

export const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': CONTENT_TYPE_JSON },
  });
