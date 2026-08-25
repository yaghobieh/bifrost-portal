import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { useLingo } from '@forgedevstack/lingo';
import { ROUTES } from '@const/routes.const';
import type { LandingPreviewProps } from './LandingPreview.types';

export const LandingPreview: FC<LandingPreviewProps> = (props) => {
  const { t } = useLingo();
  const showDemoLink = props.showDemoLink !== false;
  const previewClass = props.embedded ? 'Bl-preview Bl-preview--embed' : 'Bl-preview';
  return (
    <section className={previewClass}>
      <div className="Bl-frame">
        <div className="Bl-frame__bar">
          <div className="Bl-frame__dots"><span /><span /><span /></div>
          <div className="Bl-frame__url">{props.url}</div>
          {showDemoLink && (
            <Link to={ROUTES.DEMO} className="Bl-nav__link">{t('nav.demo')}</Link>
          )}
        </div>
        <div className="Bl-frame__body">
          <div className="Bl-frame__top">
            <div>
              <div className="Bl-frame__title">{t('landing.previewTitle')}</div>
              <div className="Bl-frame__sub">{t('landing.previewSub')}</div>
            </div>
          </div>
          <div className="Bl-stats">
            <div className="Bl-stat"><div className="Bl-stat__lbl">{t('landing.statPages')}</div><div className="Bl-stat__val">{t('landing.statPagesVal')}</div></div>
            <div className="Bl-stat"><div className="Bl-stat__lbl">{t('landing.statPublished')}</div><div className="Bl-stat__val Bl-stat__val--ok">{t('landing.statPublishedVal')}</div></div>
            <div className="Bl-stat"><div className="Bl-stat__lbl">{t('landing.statDrafts')}</div><div className="Bl-stat__val Bl-stat__val--warn">{t('landing.statDraftsVal')}</div></div>
            <div className="Bl-stat"><div className="Bl-stat__lbl">{t('landing.statTokens')}</div><div className="Bl-stat__val">{t('landing.statTokensVal')}</div></div>
          </div>
          <div className="Bl-frame__row">
            <div className="Bl-card">
              <div className="Bl-card__title">{t('landing.editsTitle')}</div>
              <div className="Bl-bars">
                <div className="Bl-bar Bl-bar--h14" />
                <div className="Bl-bar Bl-bar--h8" />
                <div className="Bl-bar Bl-bar--hi Bl-bar--h60" />
                <div className="Bl-bar Bl-bar--h12" />
                <div className="Bl-bar Bl-bar--h40" />
                <div className="Bl-bar Bl-bar--hi Bl-bar--h90" />
                <div className="Bl-bar Bl-bar--h20" />
              </div>
            </div>
            <div className="Bl-card">
              <div className="Bl-card__title">{t('landing.stageTitle')}</div>
              <div className="Bl-canvas">
                <div className="Bl-block">{t('landing.stageGrid')}</div>
                <div className="Bl-block Bl-block--sel">{t('landing.stageGridSel')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
