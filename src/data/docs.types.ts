export type DocTable = {
  headers: string[];
  rows: string[][];
};

export type DocSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  callout?: string;
  code?: { lang: string; source: string };
  table?: DocTable;
};

export type DocPageModel = {
  slug: string;
  title: string;
  lead: string;
  crumb: string;
  sections: DocSection[];
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
};

export type CmsDocItem = {
  id?: string;
  slug: string;
  title: string;
  status?: string;
  updatedAt?: string;
  payload?: Record<string, unknown> | null;
};

export type CmsDocsListResponse = {
  items?: CmsDocItem[];
};

export type DocSearchHit = {
  slug: string;
  title: string;
};
