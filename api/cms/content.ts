import { deleteAdminContent } from '../../server/cmsAdminContent';
import { handleAuthedJson } from '../../server/cmsAuthRoute';
import { METHOD_DELETE } from '../../server/cmsAuth.const';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleAuthedJson(request, [METHOD_DELETE], deleteAdminContent);
}
