import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { Typography } from '@forgedevstack/bear';
import { DocShell } from '@components/DocShell';
import { useLingo } from '@forgedevstack/lingo';
import { DOC_PATH, ROUTES } from '@const/routes.const';
import { DEMO_APP_URL } from '@const/strings.const';
import { LandingPreview } from '@pages/Home/helpers/LandingPreview';

export const Demo: FC = () => {
  const { t } = useLingo();
  return (
    <DocShell activeTab="docs">
      <div className="Bp-content">
        <Typography variant="h1">{t('demo.title')}</Typography>
        <Typography variant="body1">{t('demo.lead')}</Typography>
        <div className="Bp-callout">
          <p>{t('demo.note')}</p>
        </div>
        <p className="Bp-p">
          <Link to={DOC_PATH('how-to-use')}>{t('nav.howToUse')}</Link>
          {' · '}
          <Link to={DOC_PATH('installment')}>{t('nav.installment')}</Link>
          {' · '}
          <Link to={ROUTES.API}>{t('nav.api')}</Link>
          {' · '}
          <Link to={DOC_PATH('mcp')}>{t('nav.mcp')}</Link>
        </p>
        <LandingPreview url={DEMO_APP_URL} embedded showDemoLink={false} />
      </div>
    </DocShell>
  );
};
