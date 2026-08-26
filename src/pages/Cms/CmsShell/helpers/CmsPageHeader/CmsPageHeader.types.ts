import type { ReactNode } from 'react';

export type CmsPageHeaderProps = {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  actions?: ReactNode;
};
