import type { FC } from 'react';
import { NUMBER_ZERO } from '@const/numbers.const';
import { PortalNavLink } from '../PortalNavLink';
import type { PortalNavLinksProps } from './PortalNavLinks.types';

export const PortalNavLinks: FC<PortalNavLinksProps> = (props) => {
  const { managed, fallback } = props;
  if (managed.length > NUMBER_ZERO) {
    return (
      <>
        {managed.map((item) => (
          <PortalNavLink key={item.id} href={item.href} label={item.label} />
        ))}
      </>
    );
  }
  return (
    <>
      {fallback.map((item) => (
        <PortalNavLink
          key={item.id}
          href={item.href}
          label={item.label}
          className={item.className}
        />
      ))}
    </>
  );
};
