import type { ReactNode } from 'react';

export interface DocShellProps {
  children: ReactNode;
  toc?: { id: string; label: string; sub?: boolean }[];
  activeToc?: string;
  activeTab?: 'docs' | 'guides' | 'api' | 'changelog';
}
