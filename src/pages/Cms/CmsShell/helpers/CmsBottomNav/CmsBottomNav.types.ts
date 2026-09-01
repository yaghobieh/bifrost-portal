import type { ReactNode } from 'react';

export type CmsBottomNavItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  active: boolean;
  onClick: () => void;
};

export type CmsBottomNavProps = {
  items: CmsBottomNavItem[];
  label: string;
};
