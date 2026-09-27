import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { Avatar } from '@forgedevstack/bear';
import type { PortalNavAccountProps } from '@components/PortalNav/PortalNav.types';

export const PortalNavAccount: FC<PortalNavAccountProps> = (props) => {
  const { isAuthenticated, user, initials, cmsPath, loginPath, signInLabel } = props;
  if (isAuthenticated && user) {
    return (
      <Link to={cmsPath} className="Bl-nav__user">
        <Avatar size="sm" initials={initials} />
        <span className="Bl-nav__user-name">{user.name || user.username || user.email}</span>
      </Link>
    );
  }
  return (
    <Link className="Bl-nav__link" to={loginPath}>
      {signInLabel}
    </Link>
  );
};
