import { Link } from '@forgedevstack/forge-compass/react';
import type { ReactNode } from 'react';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { DemoNavParams } from './Demo.types';

export const renderDemoNav = (params: DemoNavParams): ReactNode => {
  const { links, separator } = params;
  return links.map((link, index) => {
    const item = (
      <Link key={link.to} to={link.to}>
        {link.label}
      </Link>
    );
    if (index === NUMBER_ZERO) {
      return item;
    }
    return (
      <span key={`${link.to}-wrap`}>
        {separator}
        {item}
      </span>
    );
  });
};
