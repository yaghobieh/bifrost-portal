import { ROUTES } from './routes.const';
import { SITE_URL } from './urls.const';
import { resolveApiBase, resolvePublicOrigin } from '@utils/host.utils';

export const INK_PREMIUM_LICENSE_EXAMPLE = 'ink_prem_AB12_CD34_EF56_GH78';

export const PREMIUM_SUCCESS_URL = `${SITE_URL}${ROUTES.PREMIUM_SUCCESS}`;

const SAME_ORIGIN_API = '';
const apiUrlRaw = import.meta.env.VITE_CMS_API_URL || import.meta.env.VITE_INK_API_URL;
const apiUrlTrimmed = typeof apiUrlRaw === 'string' ? apiUrlRaw.trim() : '';
export const INK_API_URL = resolveApiBase(apiUrlTrimmed) || SAME_ORIGIN_API;
const bifrostUrlRaw = import.meta.env.VITE_BIFROST_API_URL;
const bifrostUrlTrimmed = typeof bifrostUrlRaw === 'string' ? bifrostUrlRaw.trim() : '';
export const BIFROST_API_URL = resolvePublicOrigin(bifrostUrlTrimmed, SAME_ORIGIN_API);
