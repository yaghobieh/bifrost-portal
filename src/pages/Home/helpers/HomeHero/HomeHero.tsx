import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { DOC_PATH } from '@const/routes.const';
import { BIFROST_CLI, INSTALL_COMMAND } from '@const/strings.const';
import { BlInstallCommand } from '@components/BlInstallCommand';
import { HOME_DOC_INSTALLATION, HOME_DOC_OVERVIEW } from '../../Home.const';
import { HeroArcs } from '../HeroArcs';
import type { HomeHeroProps } from './HomeHero.types';

export const HomeHero: FC<HomeHeroProps> = (props) => {
  const { copy } = props;
  return (
    <section className="Bl-hero">
      <div className="Bl-hero__glow" />
      <div className="Bl-hero__inner">
        <p className="Bl-eyebrow">{copy.eyebrow}</p>
        <h1 className="Bl-hero__title">
          {copy.titleBefore} <em className="Bl-hero__em">{copy.titleEm}</em>
          {copy.titleAfter}
        </h1>
        <p className="Bl-hero__sub">{copy.sub}</p>
        <div className="Bl-hero__ctas">
          <Link to={DOC_PATH(HOME_DOC_INSTALLATION)} className="Bl-btn Bl-btn--grad">
            {copy.startFree}
          </Link>
          <Link to={DOC_PATH(HOME_DOC_OVERVIEW)} className="Bl-btn Bl-btn--ghost">
            {copy.readDocs}
          </Link>
        </div>
      </div>
      <div className="Bl-hero__visual">
        <div className="Bl-hero__arcs">
          <HeroArcs />
        </div>
        <div className="Bl-hero__cmd">
          <BlInstallCommand command={INSTALL_COMMAND} packageName={BIFROST_CLI} />
        </div>
      </div>
    </section>
  );
};
