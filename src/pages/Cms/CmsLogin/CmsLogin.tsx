import type { FC } from 'react';
import { Alert, Button, Checkbox, Flex, Input, Typography } from '@forgedevstack/bear';
import { GithubMark, GoogleMark } from '@icons';
import { ROUTES } from '@const/index';
import { SPACE_STRING } from '@const/generals.const';
import { CMS_AUTH_MODE, CMS_OAUTH_GITHUB, CMS_OAUTH_GOOGLE } from './CmsLogin.const';
import { CmsLoginBrand } from './helpers/CmsLoginBrand';
import { useCmsLogin } from './hooks';

export const CmsLogin: FC = () => {
  const {
    t,
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
  } = useCmsLogin();

  return (
    <div className="bifrost-cms-login">
      <div className="bifrost-cms-login__split">
        <CmsLoginBrand
          brand={t.cmsShell.brand}
          headline={t.cmsShell.loginHeadline}
          body={t.cmsShell.loginBrandBody}
          quote={t.cmsShell.loginQuote}
          quoteBy={t.cmsShell.loginQuoteBy}
        />
        <div className="bifrost-cms-login__form-panel">
          <Flex direction="column" gap={3} className="bifrost-cms-login__formbox">
            <Typography variant="h3">{isRegister ? t.cmsShell.registerTitle : t.cmsShell.loginTitle}</Typography>
            <Typography variant="body2">
              {isRegister ? t.cmsShell.registerDescription : t.login.description}
            </Typography>
            {showError && (
              <Alert severity="error" variant="outlined">
                {errorText}
              </Alert>
            )}
            <form className="bifrost-cms-login__form" onSubmit={onSubmit}>
              <Flex direction="column" gap={3}>
                {isRegister && (
                  <Flex gap={2} className="bifrost-cms-login__names">
                    <Input
                      id="bifrost-cms-register-first"
                      label={t.login.firstName}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      required
                    />
                    <Input
                      id="bifrost-cms-register-last"
                      label={t.login.lastName}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      required
                    />
                  </Flex>
                )}
                {isRegister && (
                  <Input
                    id="bifrost-cms-register-email"
                    type="email"
                    label={t.login.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                )}
                <Input
                  id="bifrost-cms-login-username"
                  label={t.login.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required={!isRegister}
                />
                <Input
                  id="bifrost-cms-login-password"
                  type="password"
                  label={t.login.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                />
                {isRegister && (
                  <Checkbox
                    checked={termsAccepted}
                    required
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    label={
                      <span>
                        {t.login.agreeTerms}
                        {SPACE_STRING}
                        <a href={ROUTES.TERMS}>{t.login.terms}</a>
                      </span>
                    }
                  />
                )}
                <Button type="submit" variant="primary" className="bifrost-cms-login__submit" disabled={loading}>
                  {submitLabel}
                </Button>
              </Flex>
            </form>
            <div className="bifrost-cms-login__divider">
              <span className="bifrost-cms-login__divider-line" />
              <Typography variant="caption">{t.login.oauthDivider}</Typography>
              <span className="bifrost-cms-login__divider-line" />
            </div>
            <Flex direction="column" gap={2} className="bifrost-cms-login__oauth">
              <Button
                type="button"
                variant="outline"
                className="bifrost-cms-login__oauth-btn"
                icon={<GoogleMark />}
                onClick={() => void onOauth(CMS_OAUTH_GOOGLE)}
              >
                {t.login.google}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bifrost-cms-login__oauth-btn"
                icon={<GithubMark />}
                onClick={() => void onOauth(CMS_OAUTH_GITHUB)}
              >
                {t.login.github}
              </Button>
            </Flex>
            <Typography variant="body2">
              {isRegister ? t.login.haveAccount : t.login.needAccount}
              {SPACE_STRING}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setMode(isRegister ? CMS_AUTH_MODE.LOGIN : CMS_AUTH_MODE.REGISTER)}
              >
                {isRegister ? t.login.signIn : t.login.register}
              </Button>
            </Typography>
            {user && <Typography variant="caption">{user.email}</Typography>}
          </Flex>
        </div>
      </div>
    </div>
  );
};
