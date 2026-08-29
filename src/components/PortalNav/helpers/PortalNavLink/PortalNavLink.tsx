import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import {
  PORTAL_NAV_BLANK,
  PORTAL_NAV_DOUBLE_SLASH,
  PORTAL_NAV_HASH_PREFIX,
  PORTAL_NAV_HTTP,
  PORTAL_NAV_HTTPS,
  PORTAL_NAV_REL,
  PORTAL_NAV_SLASH,
} from '../../PortalNav.const';
import type { PortalNavLinkProps } from './PortalNavLink.types';

const isInternalHref = (href: string): boolean =>
  href.startsWith(PORTAL_NAV_SLASH) && !href.startsWith(PORTAL_NAV_DOUBLE_SLASH);

const isExternalHref = (href: string): boolean =>
  href.startsWith(PORTAL_NAV_HTTP) || href.startsWith(PORTAL_NAV_HTTPS);

const isHashHref = (href: string): boolean => href.startsWith(PORTAL_NAV_HASH_PREFIX);

export const PortalNavLink: FC<PortalNavLinkProps> = (props) => {
  const { href, label } = props;
  if (!href || !label) {
    return null;
  }
  if (isInternalHref(href)) {
    return (
      <Link className="Bl-nav__link" to={href}>
        {label}
      </Link>
    );
  }
  if (isExternalHref(href)) {
    return (
      <a className="Bl-nav__link" href={href} target={PORTAL_NAV_BLANK} rel={PORTAL_NAV_REL}>
        {label}
      </a>
    );
  }
  if (isHashHref(href)) {
    return (
      <a className="Bl-nav__link" href={href}>
        {label}
      </a>
    );
  }
  return (
    <Link className="Bl-nav__link" to={href}>
      {label}
    </Link>
  );
};
