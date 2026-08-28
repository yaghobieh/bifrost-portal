import { healthPayload } from '../server/cmsAuth';
import { handleGetHealth } from '../server/cmsAuthRoute';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const databaseUrl = process.env.DATABASE_URL ?? '';
  return handleGetHealth(request, healthPayload(databaseUrl));
}
