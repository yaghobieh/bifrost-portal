export type DemoNavLink = {
  to: string;
  label: string;
};

export type DemoNavParams = {
  links: DemoNavLink[];
  separator: string;
};
