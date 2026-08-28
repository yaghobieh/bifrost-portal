import type { ReactNode } from 'react';

export type DocShellTocItem = {
  id: string;
  label: string;
  sub?: boolean;
};

export interface DocShellProps {
  children: ReactNode;
  toc?: DocShellTocItem[];
  activeToc?: string;
  activeTab?: 'docs' | 'guides' | 'api' | 'changelog';
}
