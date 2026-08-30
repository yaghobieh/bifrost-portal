import type { ReactNode } from 'react';

export type CmsPageHeaderProps = {
  title: string;
  subtitle?: string;
  actionTitle?: string;
  actionBody?: string;
  extra?: ReactNode;
  actions?: ReactNode;
};
