import { ROUTES } from '@const/routes.const';

export type PublicNavItem = {
  id: string;
  label: string;
  href: string;
  visible: boolean;
};

export type PublicNavChrome = {
  hiddenPublicNavIds: string[];
  blogPath: string;
  showTopNav: boolean;
  items: PublicNavItem[];
};

export const DEFAULT_PUBLIC_NAV: PublicNavChrome = {
  hiddenPublicNavIds: [],
  blogPath: ROUTES.BLOG,
  showTopNav: true,
  items: [],
};
