import type { FC } from 'react';
import { Typography } from '@forgedevstack/bear';
import { DocShell } from '@components/DocShell';
import { useLingo } from '@forgedevstack/lingo';

export const Changelog: FC = () => {
  const { t } = useLingo();
  return (
    <DocShell activeTab="changelog">
      <div className="Bp-content">
        <Typography variant="h1">{t('changelog.title')}</Typography>
        <Typography variant="body1">{t('changelog.lead')}</Typography>
        <p className="Bp-p">{t('changelog.body')}</p>
      </div>
    </DocShell>
  );
};
