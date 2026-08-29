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
