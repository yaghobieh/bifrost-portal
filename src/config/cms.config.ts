import { PORT_PORTAL } from '@const/numbers.const';
import { resolveApiBase, resolvePublicOrigin } from '@utils/host.utils';

const trimUrl = (value: string): string => value.replace(/\/$/, '');

const readEnv = (key: string): string => {
  const raw = import.meta.env[key];
  if (typeof raw === 'string' && raw.trim()) return trimUrl(raw.trim());
  return '';
};

export const CMS_PATH = '/cms';
export const CMS_DOMAIN = resolvePublicOrigin(
  readEnv('VITE_CMS_DOMAIN'),
  `http://localhost:${PORT_PORTAL}`,
);
export const CMS_URL = `${CMS_DOMAIN}${CMS_PATH}`;
export const CMS_API_URL = resolveApiBase(readEnv('VITE_CMS_API_URL'));
export const CMS_ADMIN_ORIGIN = resolvePublicOrigin(
  readEnv('VITE_CMS_ADMIN_ORIGIN'),
  `http://localhost:${PORT_PORTAL}`,
);
export const CMS_LOGIN_PATH = `${CMS_PATH}/login`;
export const CMS_ADMIN_LOGIN_URL = `${CMS_ADMIN_ORIGIN}${CMS_LOGIN_PATH}`;

export const cms = {
  domain: CMS_DOMAIN,
  path: CMS_PATH,
  url: CMS_URL,
  apiUrl: CMS_API_URL,
  adminOrigin: CMS_ADMIN_ORIGIN,
  loginPath: CMS_LOGIN_PATH,
  adminLoginUrl: CMS_ADMIN_LOGIN_URL,
} as const;
