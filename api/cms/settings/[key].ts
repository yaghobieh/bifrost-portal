import { handleSettings } from '../../server/cmsKv';
import { handleAuthedJson } from '../../server/cmsAuthRoute';
import { METHOD_GET, METHOD_PUT } from '../../server/cmsAuth.const';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleAuthedJson(request, [METHOD_GET, METHOD_PUT], handleSettings);
}
