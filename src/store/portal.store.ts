import { createNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '../constants/strings.const';

export interface PortalState {
  searchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
}

export const portalNucleus = createNucleus<PortalState>((set) => ({
  searchOpen: false,
  searchQuery: EMPTY_STRING,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false, searchQuery: EMPTY_STRING }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
}));
