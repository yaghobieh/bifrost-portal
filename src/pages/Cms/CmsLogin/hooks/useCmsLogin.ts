import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { useAuth } from '@hooks/index';
import { AUTH_GITHUB_PATH, AUTH_GOOGLE_PATH } from '@hooks/auth.const';
import type { GoogleAuthStartResponse } from '@hooks/auth.types';
import { useI18n } from '@i18n/index';
import { AUTH_OAUTH_TOKEN_PARAM, ROUTES } from '@const/index';
import { EMPTY_STRING } from '@const/strings.const';
import { SPACE_STRING } from '@const/generals.const';
import { authNucleus } from '@sdk/index';
import {
  CMS_AUTH_MODE,
  CMS_LOGIN_EMAIL_INITIAL,
  CMS_LOGIN_NAME_INITIAL,
  CMS_LOGIN_PASSWORD_INITIAL,
  CMS_LOGIN_TERMS_UNCHECKED,
  CMS_OAUTH_GITHUB,
  CMS_OAUTH_GOOGLE,
} from '../CmsLogin.const';
import {
  QUERY_PREFIX,
  cmsLoginApiUrl,
  cmsLoginInitialPassword,
  cmsLoginInitialUsername,
  loginSubmitLabel,
  toLoginSessionUser,
} from '../CmsLogin.utils';

/**
 * Owns CMS login/register form state, OAuth start, and session apply after nucleus auth.
 */
export const useCmsLogin = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { setToken, setUserFromLogin, isAuthenticated } = useAuth();
  const { login, register, loading, error, user } = useNucleus(authNucleus);
  const [mode, setMode] = useState<(typeof CMS_AUTH_MODE)[keyof typeof CMS_AUTH_MODE]>(
    CMS_AUTH_MODE.LOGIN,
  );
  const [username, setUsername] = useState(cmsLoginInitialUsername());
  const [password, setPassword] = useState(cmsLoginInitialPassword());
  const [firstName, setFirstName] = useState(CMS_LOGIN_NAME_INITIAL);
  const [lastName, setLastName] = useState(CMS_LOGIN_NAME_INITIAL);
  const [email, setEmail] = useState(CMS_LOGIN_EMAIL_INITIAL);
  const [termsAccepted, setTermsAccepted] = useState(CMS_LOGIN_TERMS_UNCHECKED);
  const [oauthError, setOauthError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get(AUTH_OAUTH_TOKEN_PARAM);
    if (!oauthToken) {
      return;
    }
    setToken(oauthToken);
    params.delete(AUTH_OAUTH_TOKEN_PARAM);
    const query = params.toString() ? `${QUERY_PREFIX}${params}` : EMPTY_STRING;
    const next = `${window.location.pathname}${query}`;
    window.history.replaceState({}, EMPTY_STRING, next);
  }, [setToken]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.CMS, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const applySession = () => {
    const { token, user: sessionUser } = authNucleus.get();
    if (token) {
      setToken(token);
    }
    if (sessionUser) {
      setUserFromLogin(toLoginSessionUser(sessionUser));
    }
    setPassword(CMS_LOGIN_PASSWORD_INITIAL);
    navigate(ROUTES.CMS);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === CMS_AUTH_MODE.REGISTER) {
      if (!termsAccepted) {
        return;
      }
      const name = `${firstName}${SPACE_STRING}${lastName}`.trim();
      const ok = await register({
        email,
        name,
        password,
        username: username || undefined,
      });
      if (!ok) {
        return;
      }
      applySession();
      return;
    }
    const ok = await login(username, password);
    if (!ok) {
      return;
    }
    applySession();
  };

  const onOauth = async (provider: typeof CMS_OAUTH_GOOGLE | typeof CMS_OAUTH_GITHUB) => {
    setOauthError(false);
    const path = provider === CMS_OAUTH_GITHUB ? AUTH_GITHUB_PATH : AUTH_GOOGLE_PATH;
    const url = cmsLoginApiUrl(path);
    if (!url) {
      setOauthError(true);
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setOauthError(true);
        return;
      }
      const data = (await response.json()) as GoogleAuthStartResponse;
      if (!data.url) {
        setOauthError(true);
        return;
      }
      window.location.href = data.url;
    } catch {
      setOauthError(true);
    }
  };

  const isRegister = mode === CMS_AUTH_MODE.REGISTER;
  const showError = Boolean(error || oauthError);
  const errorText = isRegister ? t.login.registerError : t.login.error;
  const submitLabel = loginSubmitLabel({
    loading,
    isRegister,
    signIn: t.login.signIn,
    signUp: t.login.signUp,
    signingIn: t.login.signingIn,
    registering: t.login.registering,
  });

  return {
    t,
    mode,
    setMode,
    username,
    setUsername,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    termsAccepted,
    setTermsAccepted,
    loading,
    user,
    isRegister,
    showError,
    errorText,
    submitLabel,
    onSubmit,
    onOauth,
  };
};
