import type { FC } from 'react';
import { CmsShell, CMS_NAV_IDS } from '../CmsShell';
import { AuditPanel } from './helpers/AuditPanel';

export const AuditPages: FC = () => (
  <CmsShell activeNavId={CMS_NAV_IDS.AUDIT}>
    <AuditPanel />
  </CmsShell>
);
