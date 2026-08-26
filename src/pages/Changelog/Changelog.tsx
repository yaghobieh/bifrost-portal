import type { FC } from 'react';
import { Typography } from '@forgedevstack/bear';
import { DocShell } from '@components/DocShell';
import { useLingo } from '@forgedevstack/lingo';
import { CMS_CHANGELOG_SLUG } from '@const/strings.const';
import { usePublicPage } from '@hooks/usePublicPage';
import { PageLoader } from '@components/PageLoader';
import { PublicPageCanvas } from '@components/PublicPageCanvas';
import { CHANGELOG_TAB } from './Changelog.const';
import { changelogFromItem } from './Changelog.utils';

export const Changelog: FC = () => {
  const { t } = useLingo();
  const { item, loading } = usePublicPage(CMS_CHANGELOG_SLUG);
  const page = changelogFromItem(item);

  if (loading) {
    return <PageLoader />;
  }

  if (!page) {
    return (
      <DocShell activeTab={CHANGELOG_TAB}>
        <div className="Bp-content">
          <Typography variant="h1">{t('docsMissing')}</Typography>
        </div>
      </DocShell>
    );
  }

  return (
    <DocShell activeTab={CHANGELOG_TAB}>
      <div className="Bp-content">
        <Typography variant="h1">{page.title}</Typography>
        <PublicPageCanvas payload={item?.payload} />
        <Typography variant="body1">{page.lead}</Typography>
        <p className="Bp-p">{page.body}</p>
      </div>
    </DocShell>
  );
};
