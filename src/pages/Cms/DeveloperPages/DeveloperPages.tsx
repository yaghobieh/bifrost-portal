import type { FC } from 'react';
import { CmsShell, CMS_NAV_IDS } from '../CmsShell';
import { DeveloperPanel } from './helpers/DeveloperPanel';

export const DeveloperPages: FC = () => (
  <CmsShell activeNavId={CMS_NAV_IDS.SETTINGS}>
    <DeveloperPanel />
  </CmsShell>
);
