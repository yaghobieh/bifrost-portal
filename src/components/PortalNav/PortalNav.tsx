import { useEffect, useState, type FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { Avatar } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { useAuth } from '@hooks/index';
import { DOC_PATH, ROUTES } from '@const/routes.const';
import { BIFROST_REPO_URL } from '@const/strings.const';
import { BifrostMark } from '@components/BifrostMark';
import { PORTAL_NAV_PRODUCT_HASH } from './PortalNav.const';
import type { PortalNavProps } from './PortalNav.types';
import {
  CMS_SITE_EVENT,
  DEFAULT_PUBLIC_NAV,
  fetchPublicNav,
  portalNavInitials,
  visiblePublicNavItems,
} from './PortalNav.utils';
import { PortalNavLink } from './helpers/PortalNavLink';

export const PortalNav: FC<PortalNavProps> = (props) => {
  const { showProductLink } = props;
  const { t } = useLingo();
  const { user, isAuthenticated } = useAuth();
  const initials = portalNavInitials(user?.name || user?.username || t('brand'));
  const [chrome, setChrome] = useState(DEFAULT_PUBLIC_NAV);

  useEffect(() => {
    void fetchPublicNav().then(setChrome);
    const onSite = () => {
      void fetchPublicNav().then(setChrome);
    };
    window.addEventListener(CMS_SITE_EVENT, onSite);
    return () => {
      window.removeEventListener(CMS_SITE_EVENT, onSite);
    };
  }, []);

  const managed = visiblePublicNavItems(chrome);

  return (
    <header className="Bl-nav">
      <div className="Bl-nav__inner">
        <Link to={ROUTES.HOME} className="Bl-nav__logo">
          <BifrostMark size="nav" />
          <span className="Bl-nav__word">{t('brand')}</span>
        </Link>
        <nav className="Bl-nav__links">
          {managed.length ? (
            managed.map((item) => (
              <PortalNavLink key={item.id} href={item.href} label={item.label} />
            ))
          ) : (
            <>
              {showProductLink && (
                <a className="Bl-nav__link" href={PORTAL_NAV_PRODUCT_HASH}>
                  {t('landing.navProduct')}
                </a>
              )}
              <Link className="Bl-nav__link" to={DOC_PATH('overview')}>
                {t('nav.docs')}
              </Link>
              <Link className="Bl-nav__link" to={ROUTES.PLANS}>
                {t('nav.plans')}
              </Link>
              <Link className="Bl-nav__link" to={ROUTES.DEMO}>
                {t('nav.demo')}
              </Link>
              <Link className="Bl-nav__link" to={ROUTES.CHANGELOG}>
                {t('nav.changelog')}
              </Link>
              <Link className="Bl-nav__link" to={ROUTES.STATUS}>
                {t('nav.status')}
              </Link>
            </>
          )}
        </nav>
        <div className="Bl-nav__right">
          <a className="Bl-nav__gh" href={BIFROST_REPO_URL} target="_blank" rel="noreferrer">
            {t('nav.github')}
          </a>
          {isAuthenticated && user ? (
            <Link to={ROUTES.CMS} className="Bl-nav__user">
              <Avatar size="sm" initials={initials} />
              <span className="Bl-nav__user-name">{user.name || user.username || user.email}</span>
            </Link>
          ) : (
            <Link className="Bl-nav__link" to={ROUTES.CMS_LOGIN}>
              {t('nav.signIn')}
            </Link>
          )}
          <Link to={DOC_PATH('installation')} className="Bl-nav__cta">
            {t('landing.startFree')}
          </Link>
        </div>
      </div>
    </header>
  );
};
