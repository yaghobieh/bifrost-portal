import {
  dashboardForUser,
  handleSettings,
} from '../../server/cmsAuth';
import {
  API_CMS_SETTINGS_PREFIX,
  EMPTY_STRING,
  METHOD_GET,
  METHOD_PUT,
  QUERY_REST,
  REST_SETTINGS,
} from '../../server/cmsAuth.const';
import { handleAuthedJson, handleGetAuth } from '../../server/cmsAuthRoute';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const rest = (url.searchParams.get(QUERY_REST) ?? EMPTY_STRING).trim();
  if (rest === REST_SETTINGS || url.pathname.includes(API_CMS_SETTINGS_PREFIX)) {
    return handleAuthedJson(request, [METHOD_GET, METHOD_PUT], handleSettings);
  }
  return handleGetAuth(request, dashboardForUser);
}
