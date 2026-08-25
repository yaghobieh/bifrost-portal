import { Link } from '@forgedevstack/forge-compass/react';
import { useLingo } from '@forgedevstack/lingo';
import { DOC_PATH, ROUTES } from '@const/routes.const';
import { NUMBER_TEN } from '@const/numbers.const';
import {
  BIFROST_CLI,
  BIFROST_REPO_URL,
  CLI_INSTALL_VERB,
  CODEBOX_FILE,
  DEMO_APP_URL,
  LANDING_YEAR,
  NPX,
  PROMPT_DOLLAR,
  SDK_COLLECTION_KEY,
  SDK_PACKAGE,
  SDK_SORT_PUBLISHED,
  SDK_STATUS_PUBLISHED,
  SPACE,
} from '@const/strings.const';
import { BifrostMark } from '@components/BifrostMark';
import { BridgeDiagram } from './helpers/BridgeDiagram';
import { CheckIcon } from './helpers/CheckIcon';
import { HeroArcs } from './helpers/HeroArcs';
import { LandingPreview } from './helpers/LandingPreview';
import type { FC } from 'react';

export const Home: FC = () => {
  const { t } = useLingo();
  return (
    <div className="Bl">
      <header className="Bl-nav">
        <div className="Bl-nav__inner">
          <Link to={ROUTES.HOME} className="Bl-nav__logo">
            <BifrostMark size="nav" />
            <span className="Bl-nav__word">{t('brand')}</span>
          </Link>
          <nav className="Bl-nav__links">
            <a className="Bl-nav__link" href="#features">{t('landing.navProduct')}</a>
            <Link className="Bl-nav__link" to={DOC_PATH('overview')}>{t('nav.docs')}</Link>
            <Link className="Bl-nav__link" to={ROUTES.DEMO}>{t('nav.demo')}</Link>
            <Link className="Bl-nav__link" to={ROUTES.CHANGELOG}>{t('nav.changelog')}</Link>
          </nav>
          <div className="Bl-nav__right">
            <a className="Bl-nav__gh" href={BIFROST_REPO_URL} target="_blank" rel="noreferrer">{t('nav.github')}</a>
            <Link className="Bl-nav__cta" to={DOC_PATH('installation')}>{t('landing.startFree')}</Link>
          </div>
        </div>
      </header>

      <section className="Bl-hero">
        <div className="Bl-hero__glow" />
        <div className="Bl-hero__inner">
          <div className="Bl-eyebrow">{t('landing.eyebrow')}</div>
          <h1 className="Bl-hero__title">
            {t('landing.titleBefore')} <em className="Bl-hero__em">{t('landing.titleEm')}</em>{t('landing.titleAfter')}
          </h1>
          <p className="Bl-hero__sub">{t('landing.sub')}</p>
          <div className="Bl-hero__ctas">
            <Link className="Bl-btn Bl-btn--grad" to={DOC_PATH('installation')}>{t('landing.startFree')}</Link>
            <Link className="Bl-btn Bl-btn--ghost" to={DOC_PATH('overview')}>{t('landing.readDocs')}</Link>
          </div>
        </div>
        <div className="Bl-hero__arcs">
          <HeroArcs />
        </div>
        <div className="Bl-hero__cmd">
          <div className="Bl-hero__install">
            <span className="Bl-hero__dollar">{PROMPT_DOLLAR}</span>
            {NPX}
            {SPACE}
            <span className="Bl-hero__pkg">{BIFROST_CLI}</span>
            {SPACE}
            {CLI_INSTALL_VERB}
          </div>
        </div>
      </section>

      <div className="Bl-strip">
        <div className="Bl-strip__inner">
          <div className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>
            {t('landing.stripBuilder')}
          </div>
          <div className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none"><path d="M2 5L8 2L14 5L8 8L2 5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M2 5V11L8 14L14 11V5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            {t('landing.stripStore')}
          </div>
          <div className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.3" /><circle cx="11" cy="10" r="2" stroke="currentColor" strokeWidth="1.3" /></svg>
            {t('landing.stripCrew')}
          </div>
          <div className="Bl-strip__item">
            <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.6 6H14.5L10.5 8.8L12 13.3L8 10.5L4 13.3L5.5 8.8L1.5 6H6.4L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            {t('landing.stripAi')}
          </div>
        </div>
      </div>

      <LandingPreview url={DEMO_APP_URL} />

      <section className="Bl-bridge">
        <div className="Bl-bridge__inner">
          <div className="Bl-eyebrow">{t('landing.bridgeEyebrow')}</div>
          <h2 className="Bl-bridge__h2">{t('landing.bridgeTitle')}</h2>
          <p className="Bl-bridge__sub">{t('landing.bridgeSub')}</p>
          <BridgeDiagram />
        </div>
      </section>

      <section className="Bl-features" id="features">
        <div className="Bl-features__head">
          <div className="Bl-eyebrow">{t('landing.featEyebrow')}</div>
          <h2>{t('landing.featTitle')}</h2>
          <p>{t('landing.featSub')}</p>
        </div>
        <div className="Bl-feat-grid">
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--blue">
              <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="8" rx="1" stroke="white" strokeWidth="1.4" /><path d="M6 13.5H10" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </div>
            <div className="Bl-feat__title">{t('landing.featStage')}</div>
            <div className="Bl-feat__desc">{t('landing.featStageBody')}</div>
          </div>
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--violet">
              <svg viewBox="0 0 16 16" fill="none"><path d="M2 5L8 2L14 5L8 8L2 5Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" /><path d="M2 5V11L8 14L14 11V5" stroke="white" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            </div>
            <div className="Bl-feat__title">{t('landing.featStore')}</div>
            <div className="Bl-feat__desc">{t('landing.featStoreBody')}</div>
          </div>
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--magenta">
              <svg viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2" stroke="white" strokeWidth="1.3" /><circle cx="11" cy="10" r="2" stroke="white" strokeWidth="1.3" /></svg>
            </div>
            <div className="Bl-feat__title">{t('landing.featCrew')}</div>
            <div className="Bl-feat__desc">{t('landing.featCrewBody')}</div>
          </div>
          <div className="Bl-feat">
            <div className="Bl-feat__ic Bl-feat__ic--pink">
              <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.6 6H14.5L10.5 8.8L12 13.3L8 10.5L4 13.3L5.5 8.8L1.5 6H6.4L8 1.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" /></svg>
            </div>
            <div className="Bl-feat__title">{t('landing.featAi')}</div>
            <div className="Bl-feat__desc">{t('landing.featAiBody')}</div>
          </div>
        </div>
      </section>

      <section className="Bl-code">
        <div className="Bl-code__inner">
          <div className="Bl-code__copy">
            <div className="Bl-eyebrow">{t('landing.codeEyebrow')}</div>
            <h2>{t('landing.codeTitle')}</h2>
            <p>{t('landing.codeSub')}</p>
            <div className="Bl-check"><CheckIcon />{t('landing.codeCheckApi')}</div>
            <div className="Bl-check"><CheckIcon />{t('landing.codeCheckTs')}</div>
            <div className="Bl-check"><CheckIcon />{t('landing.codeCheckHost')}</div>
          </div>
          <div className="Bl-codebox">
            <div className="Bl-codebox__head">
              <div className="Bl-codebox__dots"><span /><span /><span /></div>
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
          <Link className="Bl-btn Bl-btn--white" to={DOC_PATH('installation')}>{t('landing.startFree')}</Link>
          <Link className="Bl-btn Bl-btn--outline" to={ROUTES.DEMO}>{t('nav.demo')}</Link>
        </div>
      </section>

      <footer className="Bl-footer">
        <div className="Bl-footer__inner">
          <div className="Bl-footer__top">
            <div className="Bl-footer__brand">
              <span className="Bl-nav__word Bl-display">{t('brand')}</span>
              <p>{t('landing.footerBlurb')}</p>
            </div>
            <div>
              <div className="Bl-footer__label">{t('landing.navProduct')}</div>
              <Link className="Bl-footer__link" to={DOC_PATH('overview')}>{t('landing.featStage')}</Link>
              <Link className="Bl-footer__link" to={DOC_PATH('plugins')}>{t('landing.featStore')}</Link>
              <Link className="Bl-footer__link" to={DOC_PATH('agents')}>{t('landing.featCrew')}</Link>
            </div>
            <div>
              <div className="Bl-footer__label">{t('landing.footerResources')}</div>
              <Link className="Bl-footer__link" to={DOC_PATH('overview')}>{t('nav.docs')}</Link>
              <Link className="Bl-footer__link" to={ROUTES.API}>{t('nav.api')}</Link>
              <Link className="Bl-footer__link" to={ROUTES.CHANGELOG}>{t('nav.changelog')}</Link>
              <Link className="Bl-footer__link" to={DOC_PATH('mcp')}>{t('nav.mcp')}</Link>
            </div>
            <div>
              <div className="Bl-footer__label">{t('landing.footerCompany')}</div>
              <a className="Bl-footer__link" href={BIFROST_REPO_URL}>{t('nav.github')}</a>
              <Link className="Bl-footer__link" to={ROUTES.ASK_AI}>{t('nav.askAi')}</Link>
              <Link className="Bl-footer__link" to={ROUTES.DEMO}>{t('nav.demo')}</Link>
            </div>
          </div>
          <div className="Bl-footer__bottom">
            <span>© {LANDING_YEAR} {t('brand')}</span>
            <span>{t('landing.builtOn')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
