import { createNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '../constants/strings.const';
import {
  DOCS_STATUS_ERROR,
  DOCS_STATUS_IDLE,
  DOCS_STATUS_LOADING,
  DOCS_STATUS_READY,
  type DocsStatus,
} from '../constants/docsStatus.const';
import type { DocPageModel } from '../data/docs.types';

export interface PortalState {
  searchOpen: boolean;
  searchQuery: string;
  docsBySlug: Record<string, DocPageModel>;
  docsStatus: DocsStatus;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  setDocsLoading: () => void;
  setDocs: (docsBySlug: Record<string, DocPageModel>) => void;
  setDocsError: () => void;
}

export const portalNucleus = createNucleus<PortalState>((set) => ({
  searchOpen: false,
  searchQuery: EMPTY_STRING,
  docsBySlug: {},
  docsStatus: DOCS_STATUS_IDLE,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false, searchQuery: EMPTY_STRING }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setDocsLoading: () => set({ docsStatus: DOCS_STATUS_LOADING }),
  setDocs: (docsBySlug: Record<string, DocPageModel>) =>
    set({ docsBySlug, docsStatus: DOCS_STATUS_READY }),
  setDocsError: () => set({ docsStatus: DOCS_STATUS_ERROR }),
}));
