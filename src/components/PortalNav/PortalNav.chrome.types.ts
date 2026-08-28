import { ROUTES } from '@const/routes.const';

export type PublicNavChrome = {
  hiddenPublicNavIds: string[];
  blogPath: string;
  showTopNav: boolean;
};

export const DEFAULT_PUBLIC_NAV: PublicNavChrome = {
  hiddenPublicNavIds: [],
  blogPath: ROUTES.BLOG,
  showTopNav: true,
};
