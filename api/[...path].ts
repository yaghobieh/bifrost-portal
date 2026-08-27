import { handleCmsApi } from './cmsApi';
import type { CmsApiRequest, CmsApiResponse } from './cmsApi/cmsApi.types';

export default async function handler(req: CmsApiRequest, res: CmsApiResponse) {
  await handleCmsApi(req, res);
}
