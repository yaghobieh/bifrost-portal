import { handleAdminContent } from '../../server/cmsAdminContent';
import { handleAuthedJson } from '../../server/cmsAuthRoute';
import { METHOD_GET, METHOD_POST } from '../../server/cmsAuth.const';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleAuthedJson(request, [METHOD_GET, METHOD_POST], handleAdminContent);
}
