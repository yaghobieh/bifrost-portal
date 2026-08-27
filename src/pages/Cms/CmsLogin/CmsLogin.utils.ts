import type { MeUser } from '@hooks/auth.types';
import type { AuthUser } from '@sdk/modules/auth/auth.types';
import { EMPTY_STRING } from '@const/generals.const';
import { INK_API_URL } from '@const/billing.const';
import {
  CMS_LOGIN_LOCAL_HOSTS,
  CMS_LOGIN_LOCAL_PASSWORD,
  CMS_LOGIN_LOCAL_USERNAME,
} from './CmsLogin.const';

export const toLoginSessionUser = (user: AuthUser): MeUser => {
  const { id, email, name, username, plan, premium, role } = user;
  return {
    id,
    email,
    name,
    username: username ?? undefined,
    plan,
    premium,
    role,
  };
};

export const isCmsLoginLocalHost = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return (CMS_LOGIN_LOCAL_HOSTS as readonly string[]).includes(window.location.hostname);
};

export const cmsLoginInitialUsername = (): string =>
  isCmsLoginLocalHost() ? CMS_LOGIN_LOCAL_USERNAME : EMPTY_STRING;

export const cmsLoginInitialPassword = (): string =>
  isCmsLoginLocalHost() ? CMS_LOGIN_LOCAL_PASSWORD : EMPTY_STRING;

export const cmsLoginApiUrl = (path: string): string => `${INK_API_URL}${path}`;

export const QUERY_PREFIX = '?';

export const loginSubmitLabel = (input: {
  loading: boolean;
  isRegister: boolean;
  signIn: string;
  signUp: string;
  signingIn: string;
  registering: string;
}): string => {
  if (input.loading && input.isRegister) {
    return input.registering;
  }
  if (input.loading) {
    return input.signingIn;
  }
  if (input.isRegister) {
    return input.signUp;
  }
  return input.signIn;
};
