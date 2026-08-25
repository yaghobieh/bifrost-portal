import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { getPublishedDoc, listPublishedDocs } from './server/cmsDocs';
import {
  CONTENT_TYPE_JSON,
  ERROR_DATABASE_UNAVAILABLE,
  ERROR_DOCS_UNAVAILABLE,
  ERROR_NOT_FOUND,
  HTTP_METHOD_GET,
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
  PUBLIC_DOCS_PATH,
} from './server/cmsDocs.const';

const sendJson = (res: ServerResponse, status: number, body: unknown): void => {
  res.statusCode = status;
  res.setHeader('Content-Type', CONTENT_TYPE_JSON);
  res.end(JSON.stringify(body));
};

const pathOnly = (url: string): string => url.split('?')[0] ?? url;

export const cmsDocsPlugin = (mode: string): Plugin => ({
  name: 'cms-docs',
  enforce: 'pre',
  configureServer(server) {
    const env = loadEnv(mode, process.cwd(), '');
    const databaseUrl = env.DATABASE_URL ?? '';
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = pathOnly(req.url ?? '');
        if (req.method !== HTTP_METHOD_GET || !url.startsWith(PUBLIC_DOCS_PATH)) {
          next();
          return;
        }
        if (!databaseUrl) {
          sendJson(res, HTTP_STATUS_SERVICE_UNAVAILABLE, { error: ERROR_DATABASE_UNAVAILABLE });
          return;
        }
        try {
          const rest = url.slice(PUBLIC_DOCS_PATH.length);
          if (rest === '' || rest === '/') {
            const items = await listPublishedDocs(databaseUrl);
            sendJson(res, HTTP_STATUS_OK, { items });
            return;
          }
          const slug = rest.replace(/^\//, '').split('/')[0] ?? '';
          const item = await getPublishedDoc(databaseUrl, slug);
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
