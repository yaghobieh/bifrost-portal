import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { getPublishedPage } from './server/cmsDocs';
import {
  CONTENT_TYPE_JSON,
  ERROR_DOCS_UNAVAILABLE,
  ERROR_NOT_FOUND,
  GONE_PAYLOAD,
  HTTP_METHOD_GET,
  HTTP_STATUS_GONE,
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  PUBLIC_API_PREFIX,
  PUBLIC_CONTENT_PATH,
  PUBLIC_DOCS_PATH,
  PUBLIC_PAGES_PATH,
} from './server/cmsDocs.const';

const sendJson = (res: ServerResponse, status: number, body: unknown): void => {
  res.statusCode = status;
  res.setHeader('Content-Type', CONTENT_TYPE_JSON);
  res.end(JSON.stringify(body));
};

const pathOnly = (url: string): string => url.split('?')[0] ?? url;

const segmentsAfter = (url: string, prefix: string): string[] =>
  url.slice(prefix.length).replace(/^\//, '').split('/').filter(Boolean);

const publicPagePrefix = (url: string): string | null => {
  if (url === PUBLIC_PAGES_PATH || url.startsWith(`${PUBLIC_PAGES_PATH}/`)) {
    return PUBLIC_PAGES_PATH;
  }
  if (url === PUBLIC_DOCS_PATH || url.startsWith(`${PUBLIC_DOCS_PATH}/`)) {
    return PUBLIC_DOCS_PATH;
  }
  return null;
};

export const cmsDocsPlugin = (mode: string): Plugin => ({
  name: 'cms-docs',
  enforce: 'pre',
  configureServer(server) {
    const env = loadEnv(mode, process.cwd(), '');
    const databaseUrl = env.DATABASE_URL ?? '';
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const url = pathOnly(req.url ?? '');
      if (req.method !== HTTP_METHOD_GET || !url.startsWith(PUBLIC_API_PREFIX)) {
        next();
        return;
      }
      if (url === PUBLIC_CONTENT_PATH || url.startsWith(`${PUBLIC_CONTENT_PATH}/`)) {
        sendJson(res, HTTP_STATUS_GONE, GONE_PAYLOAD);
        return;
      }
      const prefix = publicPagePrefix(url);
      if (!prefix) {
        next();
        return;
      }
      if (!databaseUrl) {
        next();
        return;
      }
      try {
        const rest = segmentsAfter(url, prefix);
        const slug = rest[0] ?? '';
        if (!slug) {
          next();
          return;
        }
        const item = await getPublishedPage(databaseUrl, slug);
        if (!item) {
          sendJson(res, HTTP_STATUS_NOT_FOUND, { error: ERROR_NOT_FOUND });
          return;
        }
        sendJson(res, HTTP_STATUS_OK, { item });
      } catch {
        sendJson(res, HTTP_STATUS_INTERNAL_SERVER_ERROR, { error: ERROR_DOCS_UNAVAILABLE });
      }
    });
  },
});
