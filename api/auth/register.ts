import { registerWithPassword } from '../../server/cmsAuth';
import { handlePostAuth } from '../../server/cmsAuthRoute';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handlePostAuth(request, registerWithPassword);
}
