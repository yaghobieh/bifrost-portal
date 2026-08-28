import type { FC } from 'react';
import { Typography } from '@forgedevstack/bear';
import { DocShell } from '@components/DocShell';
import { useLingo } from '@forgedevstack/lingo';
import { DOC_PATH, ROUTES } from '@const/index';
import { CMS_DEMO_SLUG, DEMO_APP_URL, MIDDLE_DOT } from '@const/strings.const';
import { usePublicPage } from '@hooks/usePublicPage';
import { mapSitePage } from '@data/pages.mapper';
import { LandingPreview } from '@pages/Home/helpers/LandingPreview';
import { PageLoader } from '@components/PageLoader';
import { PublicPageCanvas } from '@components/PublicPageCanvas';
import { DEMO_DOC_HOW_TO, DEMO_DOC_INSTALLMENT, DEMO_DOC_MCP } from './Demo.const';
import { renderDemoNav } from './Demo.utils';

export const Demo: FC = () => {
  const { t } = useLingo();
  const { item, loading } = usePublicPage(CMS_DEMO_SLUG);
  const page = item ? mapSitePage(item.slug, item.title, item.payload) : null;

  if (loading) {
    return <PageLoader />;
  }

  if (!page) {
    return (
      <DocShell activeTab="docs">
        <div className="Bp-content">
          <Typography variant="h1">{t('docsMissing')}</Typography>
        </div>
      </DocShell>
    );
  }

  return (
    <DocShell activeTab="docs">
      <div className="Bp-content">
        <Typography variant="h1">{page.title}</Typography>
        <PublicPageCanvas payload={item?.payload} />
        <Typography variant="body1">{page.lead}</Typography>
        {page.note && (
          <div className="Bp-callout">
            <p>{page.note}</p>
          </div>
        )}
        <p className="Bp-p">{page.body}</p>
        <p className="Bp-p">
          {renderDemoNav({
            separator: MIDDLE_DOT,
            links: [
              { to: DOC_PATH(DEMO_DOC_HOW_TO), label: t('nav.howToUse') },
              { to: DOC_PATH(DEMO_DOC_INSTALLMENT), label: t('nav.installment') },
              { to: ROUTES.API, label: t('nav.api') },
              { to: DOC_PATH(DEMO_DOC_MCP), label: t('nav.mcp') },
            ],
          })}
        </p>
        <LandingPreview url={page.previewUrl || DEMO_APP_URL} embedded showDemoLink={false} />
      </div>
    </DocShell>
  );
};
