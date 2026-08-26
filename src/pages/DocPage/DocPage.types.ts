export type DocPageParams = {
  slug?: string;
};

export type DocPageTab = 'docs' | 'guides';

export type DocFootLinkParams = {
  href: string;
  label: string;
  title: string;
  modifier?: string;
};
