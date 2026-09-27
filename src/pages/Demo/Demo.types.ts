import { DEMO_TAB } from './Demo.const';

export type DemoNavLink = {
  to: string;
  label: string;
};

export type DemoNavParams = {
  links: DemoNavLink[];
  separator: string;
};

export type DemoTabId = (typeof DEMO_TAB)[keyof typeof DEMO_TAB];

export type DemoTabsProps = {
  active: DemoTabId;
  labels: Record<DemoTabId, string>;
  onSelect: (id: DemoTabId) => void;
};
