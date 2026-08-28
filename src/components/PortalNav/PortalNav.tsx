import { useEffect, useState, type FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { useLingo } from '@forgedevstack/lingo';
import { useAuth } from '@hooks/index';
import {
  DEFAULT_DOC_SLUG,
  DOC_INSTALLATION_SLUG,
  PUBLIC_NAV_IDS,
  ROUTES,
} from '@const/routes.const';
import { DOC_PATH } from '@const/routes.utils';
import { BIFROST_REPO_URL } from '@const/strings.const';
import { BifrostMark } from '@components/BifrostMark';
import { PORTAL_NAV_PRODUCT_HASH } from './PortalNav.const';
import type { PortalNavProps } from './PortalNav.types';
import {
  DEFAULT_PUBLIC_NAV,
  fetchPublicNav,
  isPublicNavVisible,
  portalNavInitials,
} from './PortalNav.utils';
import { PortalNavAccount } from './helpers/PortalNavAccount';

export const PortalNav: FC<PortalNavProps> = (props) => {
  const { showProductLink } = props;
  const { t } = useLingo();
  const { user, isAuthenticated } = useAuth();
  const initials = portalNavInitials(user?.name || user?.username || t('brand'));
  const [chrome, setChrome] = useState(DEFAULT_PUBLIC_NAV);

  useEffect(() => {
    void fetchPublicNav().then(setChrome);
  }, []);

  const show = (id: string): boolean => isPublicNavVisible(chrome, id);

  return (
    <header className="Bl-nav">
      <div className="Bl-nav__inner">
        <Link to={ROUTES.HOME} className="Bl-nav__logo">
          <BifrostMark size="nav" />
          <span className="Bl-nav__word">{t('brand')}</span>
        </Link>
        <nav className="Bl-nav__links">
          {showProductLink && show(PUBLIC_NAV_IDS.PRODUCT) && (
            <a className="Bl-nav__link" href={PORTAL_NAV_PRODUCT_HASH}>
              {t('landing.navProduct')}
            </a>
          )}
          {show(PUBLIC_NAV_IDS.DOCS) && (
            <Link className="Bl-nav__link" to={DOC_PATH(DEFAULT_DOC_SLUG)}>
              {t('nav.docs')}
            </Link>
          )}
          {show(PUBLIC_NAV_IDS.PLANS) && (
            <Link className="Bl-nav__link" to={ROUTES.PLANS}>
              {t('nav.plans')}
            </Link>
          )}
          {show(PUBLIC_NAV_IDS.DEMO) && (
            <Link className="Bl-nav__link" to={ROUTES.DEMO}>
              {t('nav.demo')}
            </Link>
          )}
          {show(PUBLIC_NAV_IDS.CHANGELOG) && (
            <Link className="Bl-nav__link" to={ROUTES.CHANGELOG}>
              {t('nav.changelog')}
            </Link>
          )}
          {show(PUBLIC_NAV_IDS.STATUS) && (
            <Link className="Bl-nav__link" to={ROUTES.STATUS}>
              {t('nav.status')}
            </Link>
          )}
          {show(PUBLIC_NAV_IDS.BLOG) && (
            <Link className="Bl-nav__link" to={chrome.blogPath}>
              {t('nav.blog')}
            </Link>
          )}
        </nav>
        <div className="Bl-nav__right">
          <a className="Bl-nav__gh" href={BIFROST_REPO_URL} target="_blank" rel="noreferrer">
            {t('nav.github')}
          </a>
          <PortalNavAccount
            isAuthenticated={isAuthenticated}
            user={user}
            initials={initials}
            cmsPath={ROUTES.CMS}
            loginPath={ROUTES.CMS_LOGIN}
            signInLabel={t('nav.signIn')}
          />
          <Link to={DOC_PATH(DOC_INSTALLATION_SLUG)} className="Bl-nav__cta">
            {t('landing.startFree')}
          </Link>
        </div>
      </div>
    </header>
  );
};
