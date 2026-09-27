import type { PublicNavItem } from '../../PortalNav.chrome.types';

export type PortalNavFallbackItem = {
  id: string;
  href: string;
  label: string;
  className: string;
};

export type PortalNavLinksProps = {
  managed: PublicNavItem[];
  fallback: PortalNavFallbackItem[];
};
