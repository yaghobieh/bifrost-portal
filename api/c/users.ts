import { handleCrewUsers } from '../../server/cmsCrew';
import { METHOD_GET, METHOD_PATCH, METHOD_POST } from '../../server/cmsAuth.const';
import { handleAuthedJson } from '../../server/cmsAuthRoute';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleAuthedJson(request, [METHOD_GET, METHOD_POST, METHOD_PATCH], handleCrewUsers);
}
