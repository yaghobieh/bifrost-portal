import { versionPayload } from '../server/cmsVersion';
import { handlePublicJson } from '../server/cmsAuthRoute';
import { METHOD_GET } from '../server/cmsAuth.const';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handlePublicJson(request, [METHOD_GET], async () => versionPayload());
}
