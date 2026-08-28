import { type FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { Flex, Typography } from '@forgedevstack/bear';
import { useLingo } from '@forgedevstack/lingo';
import { DOC_PATH, ROUTES } from '@const/index';
import { NUMBER_TEN } from '@const/numbers.const';
import {
  BIFROST_REPO_URL,
  CODEBOX_FILE,
  DEMO_APP_URL,
  LANDING_YEAR,
  SDK_COLLECTION_KEY,
  SDK_PACKAGE,
  SDK_SORT_PUBLISHED,
  SDK_STATUS_PUBLISHED,
} from '@const/strings.const';
import { PortalNav } from '@components/PortalNav';
import { BridgeDiagram } from './helpers/BridgeDiagram';
import { CheckIcon } from './helpers/CheckIcon';
import { LandingPreview } from './helpers/LandingPreview';
import { HomeHero } from './helpers/HomeHero';
import {
  HOME_DOC_AGENTS,
  HOME_DOC_INSTALLATION,
  HOME_DOC_MCP,
  HOME_DOC_OVERVIEW,
  HOME_DOC_PLUGINS,
} from './Home.const';
import { homeHeroCopy } from './Home.utils';

export const Home: FC = () => {
  const { t } = useLingo();

  return (
    <div className="Bl">
      <PortalNav showProductLink />
      <HomeHero copy={homeHeroCopy({ t })} />

      <div className="Bl-strip">
        <Flex justify="between" align="center" wrap="wrap" className="Bl-strip__inner">
          <Flex align="center" gap={2} className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {t('landing.stripBuilder')}
          </Flex>
          <Flex align="center" gap={2} className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M2 5L8 2L14 5L8 8L2 5Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <path
                d="M2 5V11L8 14L14 11V5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            {t('landing.stripStore')}
          </Flex>
          <Flex align="center" gap={2} className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="11" cy="10" r="2" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            {t('landing.stripCrew')}
          </Flex>
          <Flex align="center" gap={2} className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1.5L9.6 6H14.5L10.5 8.8L12 13.3L8 10.5L4 13.3L5.5 8.8L1.5 6H6.4L8 1.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
            {t('landing.stripAi')}
          </Flex>
        </Flex>
      </div>

      <LandingPreview url={DEMO_APP_URL} />

      <section className="Bl-bridge">
        <Flex direction="column" align="center" className="Bl-bridge__inner">
          <Typography variant="caption" className="Bl-eyebrow mb-0">
            {t('landing.bridgeEyebrow')}
          </Typography>
          <Typography variant="h2" className="Bl-bridge__h2 mb-0">
            {t('landing.bridgeTitle')}
          </Typography>
          <Typography variant="body1" className="Bl-bridge__sub mb-0">
            {t('landing.bridgeSub')}
          </Typography>
          <BridgeDiagram />
        </Flex>
      </section>

      <section className="Bl-features" id="features">
        <Flex direction="column" align="center" className="Bl-features__head">
          <Typography variant="caption" className="Bl-eyebrow mb-0">
            {t('landing.featEyebrow')}
          </Typography>
          <Typography variant="h2" className="mb-0">
            {t('landing.featTitle')}
          </Typography>
          <Typography variant="body1" className="mb-0">
            {t('landing.featSub')}
          </Typography>
        </Flex>
        <div className="Bl-feat-grid">
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--blue">
              <svg viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="8" rx="1" stroke="white" strokeWidth="1.4" />
                <path d="M6 13.5H10" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <Typography variant="h5" className="Bl-feat__title mb-0">
              {t('landing.featStage')}
            </Typography>
            <Typography variant="body2" className="Bl-feat__desc mb-0">
              {t('landing.featStageBody')}
            </Typography>
          </div>
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--violet">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M2 5L8 2L14 5L8 8L2 5Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M2 5V11L8 14L14 11V5" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </div>
            <Typography variant="h5" className="Bl-feat__title mb-0">
              {t('landing.featStore')}
            </Typography>
            <Typography variant="body2" className="Bl-feat__desc mb-0">
              {t('landing.featStoreBody')}
            </Typography>
          </div>
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--magenta">
              <svg viewBox="0 0 16 16" fill="none">
                <circle cx="6" cy="6" r="2" stroke="white" strokeWidth="1.3" />
                <circle cx="11" cy="10" r="2" stroke="white" strokeWidth="1.3" />
              </svg>
            </div>
            <Typography variant="h5" className="Bl-feat__title mb-0">
              {t('landing.featCrew')}
            </Typography>
            <Typography variant="body2" className="Bl-feat__desc mb-0">
              {t('landing.featCrewBody')}
            </Typography>
          </div>
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--pink">
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5L9.6 6H14.5L10.5 8.8L12 13.3L8 10.5L4 13.3L5.5 8.8L1.5 6H6.4L8 1.5Z"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Typography variant="h5" className="Bl-feat__title mb-0">
              {t('landing.featAi')}
            </Typography>
            <Typography variant="body2" className="Bl-feat__desc mb-0">
              {t('landing.featAiBody')}
            </Typography>
          </div>
        </div>
      </section>

      <section className="Bl-code">
        <div className="Bl-code__inner">
          <Flex direction="column" gap={2} className="Bl-code__copy">
            <Typography variant="caption" className="Bl-eyebrow mb-0">
              {t('landing.codeEyebrow')}
            </Typography>
            <Typography variant="h2" className="mb-0">
              {t('landing.codeTitle')}
            </Typography>
            <Typography variant="body1" className="mb-0">
              {t('landing.codeSub')}
            </Typography>
            <Flex align="center" gap={2} className="Bl-check">
              <CheckIcon />
              {t('landing.codeCheckApi')}
            </Flex>
            <Flex align="center" gap={2} className="Bl-check">
              <CheckIcon />
              {t('landing.codeCheckTs')}
            </Flex>
            <Flex align="center" gap={2} className="Bl-check">
              <CheckIcon />
              {t('landing.codeCheckHost')}
            </Flex>
          </Flex>
          <div className="Bl-codebox">
            <div className="Bl-codebox__head">
              <div className="Bl-codebox__dots">
                <span />
                <span />
                <span />
              </div>
              <span className="Bl-codebox__lang">{CODEBOX_FILE}</span>
            </div>
            <pre>
              <span className="Bl-tk">import</span>
              {' { bifrost } '}
              <span className="Bl-tk">from</span>
              {' '}
              <span className="Bl-tstr">'{SDK_PACKAGE}'</span>
              {';\n\n'}
              <span className="Bl-tk">const</span>
              {' posts = '}
              <span className="Bl-tk">await</span>
              {' bifrost\n  .'}
              <span className="Bl-tfn">collection</span>
              {'('}
              <span className="Bl-tstr">'{SDK_COLLECTION_KEY}'</span>
              {')\n  .'}
              <span className="Bl-tfn">filter</span>
              {'({ status: '}
              <span className="Bl-tstr">'{SDK_STATUS_PUBLISHED}'</span>
              {' })\n  .'}
              <span className="Bl-tfn">sort</span>
              {'('}
              <span className="Bl-tstr">'{SDK_SORT_PUBLISHED}'</span>
              {')\n  .'}
              <span className="Bl-tfn">limit</span>
              {'('}
              {NUMBER_TEN}
              {')\n  .'}
              <span className="Bl-tfn">find</span>
              {'();\n\n'}
              <span className="Bl-tcom">{t('landing.codeComment')}</span>
            </pre>
          </div>
        </div>
      </section>

      <section className="Bl-cta">
        <h2>{t('landing.ctaTitle')}</h2>
        <p>{t('landing.ctaSub')}</p>
        <div className="Bl-cta__btns">
          <Link to={DOC_PATH(HOME_DOC_INSTALLATION)} className="Bl-btn Bl-btn--white">
            {t('landing.startFree')}
          </Link>
          <Link to={ROUTES.DEMO} className="Bl-btn Bl-btn--outline">
            {t('nav.demo')}
          </Link>
        </div>
      </section>

      <footer className="Bl-footer">
        <div className="Bl-footer__inner">
          <div className="Bl-footer__top">
            <div className="Bl-footer__brand">
              <Typography variant="h6" className="Bl-nav__word Bl-display mb-0">
                {t('brand')}
              </Typography>
              <Typography variant="body2" className="mb-0">
                {t('landing.footerBlurb')}
              </Typography>
            </div>
            <div>
              <Typography variant="caption" className="Bl-footer__label mb-0">
                {t('landing.navProduct')}
              </Typography>
              <Link className="Bl-footer__link" to={DOC_PATH(HOME_DOC_OVERVIEW)}>
                {t('landing.featStage')}
              </Link>
              <Link className="Bl-footer__link" to={DOC_PATH(HOME_DOC_PLUGINS)}>
                {t('landing.featStore')}
              </Link>
              <Link className="Bl-footer__link" to={DOC_PATH(HOME_DOC_AGENTS)}>
                {t('landing.featCrew')}
              </Link>
            </div>
            <div>
              <Typography variant="caption" className="Bl-footer__label mb-0">
                {t('landing.footerResources')}
              </Typography>
              <Link className="Bl-footer__link" to={DOC_PATH(HOME_DOC_OVERVIEW)}>
                {t('nav.docs')}
              </Link>
              <Link className="Bl-footer__link" to={ROUTES.PLANS}>
                {t('nav.plans')}
              </Link>
              <Link className="Bl-footer__link" to={ROUTES.API}>
                {t('nav.api')}
              </Link>
              <Link className="Bl-footer__link" to={ROUTES.CHANGELOG}>
                {t('nav.changelog')}
              </Link>
              <Link className="Bl-footer__link" to={DOC_PATH(HOME_DOC_MCP)}>
                {t('nav.mcp')}
              </Link>
            </div>
            <div>
              <Typography variant="caption" className="Bl-footer__label mb-0">
                {t('landing.footerCompany')}
              </Typography>
              <a className="Bl-footer__link" href={BIFROST_REPO_URL}>
                {t('nav.github')}
              </a>
              <Link className="Bl-footer__link" to={ROUTES.ASK_AI}>
                {t('nav.askAi')}
              </Link>
              <Link className="Bl-footer__link" to={ROUTES.DEMO}>
                {t('nav.demo')}
              </Link>
            </div>
          </div>
          <Flex justify="between" align="center" className="Bl-footer__bottom">
            <Typography variant="caption" className="mb-0">
              © {LANDING_YEAR} {t('brand')}
            </Typography>
            <Typography variant="caption" className="mb-0">
              {t('landing.builtOn')}
            </Typography>
          </Flex>
        </div>
      </footer>
    </div>
  );
};
