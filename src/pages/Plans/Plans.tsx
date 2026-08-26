import { useState, type FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { Button, Card, Flex, Typography } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { DOC_PATH } from '@const/routes.const';
import { NUMBER_FOUR } from '@const/numbers.const';
import { CMS_PLANS_SLUG } from '@const/strings.const';
import { PortalNav } from '@components/PortalNav';
import { PublicPageCanvas } from '@components/PublicPageCanvas';
import { usePublicPage } from '@hooks/usePublicPage';
import { PageLoader } from '@components/PageLoader';
import {
  AI_FEATURE_KEYS,
  PLANS_DOC_INSTALLATION,
  STANDARD_FEATURE_KEYS,
  TRANSLATE_LOCALES,
  TRANSLATE_STATUS,
} from './Plans.const';
import type { TranslateStatus } from './Plans.types';
import { postTranslateCatalogs } from './Plans.utils';

export const Plans: FC = () => {
  const { t } = useLingo();
  const { item, loading } = usePublicPage(CMS_PLANS_SLUG);
  const [status, setStatus] = useState<TranslateStatus>(TRANSLATE_STATUS.IDLE);

  const onTranslate = () => {
    setStatus(TRANSLATE_STATUS.LOADING);
    void postTranslateCatalogs({ locales: TRANSLATE_LOCALES })
      .then(() => {
        setStatus(TRANSLATE_STATUS.SUCCESS);
      })
      .catch(() => {
        setStatus(TRANSLATE_STATUS.ERROR);
      });
  };

  let translateLabel = t('plans.translateAction');
  if (status === TRANSLATE_STATUS.LOADING) {
    translateLabel = t('plans.translating');
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="Bl">
      <PortalNav showProductLink={false} />

      <section className="Bl-plans">
        <PublicPageCanvas payload={item?.payload} />
        <Typography variant="h1">{t('plans.title')}</Typography>
        <Typography variant="body1">{t('plans.lead')}</Typography>
        <Flex gap={NUMBER_FOUR} wrap="wrap" className="Bl-plans__grid">
          <Card className="Bl-plans__card">
            <Typography variant="h2">{t('plans.standardName')}</Typography>
            <Typography variant="body2">{t('plans.standardLead')}</Typography>
            <ul className="Bl-plans__features">
              {STANDARD_FEATURE_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
            <Link className="Bl-btn Bl-btn--ghost" to={DOC_PATH(PLANS_DOC_INSTALLATION)}>
              {t('landing.startFree')}
            </Link>
          </Card>
          <Card className="Bl-plans__card Bl-plans__card--ai">
            <Typography variant="h2">{t('plans.aiName')}</Typography>
            <Typography variant="body2">{t('plans.aiLead')}</Typography>
            <ul className="Bl-plans__features">
              {AI_FEATURE_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
            <Button
              variant="bifrost"
              type="button"
              disabled={status === TRANSLATE_STATUS.LOADING}
              onClick={onTranslate}
            >
              {translateLabel}
            </Button>
            {status === TRANSLATE_STATUS.SUCCESS && (
              <Typography variant="body2">{t('plans.translateSuccess')}</Typography>
            )}
            {status === TRANSLATE_STATUS.ERROR && (
              <Typography variant="body2">{t('plans.translateError')}</Typography>
            )}
          </Card>
        </Flex>
      </section>
    </div>
  );
};
