import type { PublicNavItem } from '../../SettingsPages.types';

export type SettingsPublicNavProps = {
  items: PublicNavItem[];
  disabled: boolean;
  title: string;
  hint: string;
  labelTitle: string;
  hrefTitle: string;
  addLabel: string;
  removeLabel: string;
  moveUpLabel: string;
  moveDownLabel: string;
  visibleLabel: string;
  onChange: (items: PublicNavItem[]) => void;
};
