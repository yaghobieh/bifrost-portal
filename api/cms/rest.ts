import { handleCmsRest } from '../../server/cmsRestDispatch';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleCmsRest(request);
}
