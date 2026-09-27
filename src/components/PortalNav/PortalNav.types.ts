import type { MeUser } from '@hooks/auth.types';

export type PortalNavProps = {
  showProductLink: boolean;
  activeId?: string;
};

export type PortalNavAccountProps = {
  isAuthenticated: boolean;
  user: MeUser | null | undefined;
  initials: string;
  cmsPath: string;
  loginPath: string;
  signInLabel: string;
};
