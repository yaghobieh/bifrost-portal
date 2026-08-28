import {
  healthPayload,
  mediaConfigPayload,
  pluginCatalogPayload,
  versionPayload,
} from '../server/cmsAuth';
import {
  API_CMS_MEDIA_CONFIG_PATH,
  API_PUBLIC_PLUGINS_PATH,
  API_V1_VERSION_PATH,
  API_VERSION_PATH,
  EMPTY_STRING,
  QUERY_REST,
  REST_MEDIA_CONFIG,
  REST_PLUGINS,
  REST_VERSION,
} from '../server/cmsAuth.const';
import { handleGetHealth } from '../server/cmsAuthRoute';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const rest = (url.searchParams.get(QUERY_REST) ?? EMPTY_STRING).trim();
  if (rest === REST_VERSION || pathname.includes(API_V1_VERSION_PATH) || pathname === API_VERSION_PATH) {
    return handleGetHealth(request, versionPayload());
  }
  if (rest === REST_MEDIA_CONFIG || pathname.includes(API_CMS_MEDIA_CONFIG_PATH)) {
    return handleGetHealth(request, mediaConfigPayload());
  }
  if (rest === REST_PLUGINS || pathname.includes(API_PUBLIC_PLUGINS_PATH)) {
    return handleGetHealth(request, pluginCatalogPayload());
  }
  const databaseUrl = process.env.DATABASE_URL ?? '';
  return handleGetHealth(request, healthPayload(databaseUrl));
}
