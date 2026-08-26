export type LandingCopy = {
  navProduct: string;
  startFree: string;
  eyebrow: string;
  titleBefore: string;
  titleEm: string;
  titleAfter: string;
  sub: string;
  readDocs: string;
  stripBuilder: string;
  stripStore: string;
  stripCrew: string;
  stripAi: string;
  previewUrl: string;
  bridgeEyebrow: string;
  bridgeTitle: string;
  bridgeSub: string;
  featEyebrow: string;
  featTitle: string;
  featSub: string;
  featStage: string;
  featStageBody: string;
  featStore: string;
  featStoreBody: string;
  featCrew: string;
  featCrewBody: string;
  featAi: string;
  featAiBody: string;
  codeEyebrow: string;
  codeTitle: string;
  codeSub: string;
  codeCheckApi: string;
  codeCheckTs: string;
  codeCheckHost: string;
  codeComment: string;
  ctaTitle: string;
  ctaSub: string;
  footerBlurb: string;
  footerResources: string;
  footerCompany: string;
  builtOn: string;
};

export type SitePageCopy = {
  slug: string;
  title: string;
  lead: string;
  body: string;
  note?: string;
  previewUrl?: string;
};

export type CmsPageItem = {
  slug: string;
  title: string;
  payload: Record<string, unknown>;
};

export type CmsItemResponse = {
  item?: {
    slug: string;
    title: string;
    payload?: Record<string, unknown> | null;
  };
};
