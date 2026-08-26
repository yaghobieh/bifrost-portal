import type { HomeHeroCopy } from './helpers/HomeHero';
import type { HomeCopyParams } from './Home.types';

export const homeHeroCopy = (params: HomeCopyParams): HomeHeroCopy => {
  const { t } = params;
  return {
    eyebrow: t('landing.eyebrow'),
    titleBefore: t('landing.titleBefore'),
    titleEm: t('landing.titleEm'),
    titleAfter: t('landing.titleAfter'),
    sub: t('landing.sub'),
    startFree: t('landing.startFree'),
    readDocs: t('landing.readDocs'),
  };
};
