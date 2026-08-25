import type { DocPageModel, DocSearchHit } from './docs.types';
import { fetchPortalDocs } from './docs.api';
import { portalNucleus } from '@store/portal.store';
import { DOCS_STATUS_READY } from '@const/docsStatus.const';

export type { DocPageModel, DocSection, DocTable, DocSearchHit, CmsDocItem } from './docs.types';
export { mapCmsDoc } from './docs.mapper';
export { fetchPortalDocs } from './docs.api';

export const searchDocs = (
  docsBySlug: Record<string, DocPageModel>,
  query: string,
): DocSearchHit[] => {
  const slugs = Object.keys(docsBySlug);
  const q = query.trim().toLowerCase();
  if (!q) return slugs.map((slug) => ({ slug, title: docsBySlug[slug].title }));
  return slugs
    .filter((slug) => {
      const doc = docsBySlug[slug];
      const hay = [doc.title, doc.lead, doc.sections.map((section) => section.heading + section.paragraphs.join(' ')).join(' ')].join(' ').toLowerCase();
      return hay.includes(q);
    })
    .map((slug) => ({ slug, title: docsBySlug[slug].title }));
};

let loadPromise: Promise<void> | null = null;

export const loadPortalDocs = (): Promise<void> => {
  const status = portalNucleus.get().docsStatus;
  if (status === DOCS_STATUS_READY) return Promise.resolve();
  if (loadPromise) return loadPromise;
  portalNucleus.get().setDocsLoading();
  loadPromise = fetchPortalDocs()
    .then((docsBySlug) => {
      portalNucleus.get().setDocs(docsBySlug);
    })
    .catch(() => {
      portalNucleus.get().setDocsError();
      loadPromise = null;
    });
  return loadPromise;
};
