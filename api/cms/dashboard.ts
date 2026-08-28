import { dashboardForUser } from '../../server/cmsAuth';
import { handleGetAuth } from '../../server/cmsAuthRoute';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleGetAuth(request, dashboardForUser);
}
