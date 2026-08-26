import { createNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '@const/index';
import { fetchMediaConfig, fetchMediaRequest, uploadAndRegisterMedia } from './media.api';
import type { MediaItem, MediaState } from './media.types';
import { toCloudinarySrc } from './media.utils';

const withCloudinaryUrls = (item: MediaItem, cloudName: string): MediaItem => ({
  ...item,
  url: toCloudinarySrc(item.url, cloudName),
  secureUrl: toCloudinarySrc(item.secureUrl || item.url, cloudName),
});

export const mediaNucleus = createNucleus<MediaState>((set, get) => ({
  items: [],
  source: null,
  cloudName: EMPTY_STRING,
  configured: false,
  loading: false,
  uploading: false,
  error: false,
  uploadError: false,

  reset: () => {
    set({
      items: [],
      source: null,
      cloudName: EMPTY_STRING,
      configured: false,
      loading: false,
      uploading: false,
      error: false,
      uploadError: false,
    });
  },

  loadConfig: async (token: string) => {
    const config = await fetchMediaConfig(token);
    if (!config) {
      return false;
    }
    const cloudName = config.cloudName;
    set({
      cloudName,
      configured: config.configured,
      items: get().items.map((item) => withCloudinaryUrls(item, cloudName)),
    });
    return true;
  },

  fetchMedia: async (token: string) => {
    set({ loading: true, error: false });
    try {
      await get().loadConfig(token);
      const result = await fetchMediaRequest(token);
      const cloudName = get().cloudName;
      set({
        items: result.items.map((item) => withCloudinaryUrls(item, cloudName)),
        source: result.source,
        loading: false,
        error: false,
      });
      return true;
    } catch {
      set({ items: [], source: null, loading: false, error: true });
      return false;
    }
  },

  uploadMedia: async (token: string, file: File) => {
    set({ uploading: true, uploadError: false });
    try {
      const item = await uploadAndRegisterMedia(token, file);
      if (!item) {
        set({ uploading: false, uploadError: true });
        return null;
      }
      const cloudName = get().cloudName;
      const mapped = withCloudinaryUrls(item, cloudName);
      const current = get().items;
      set({
        items: [mapped, ...current.filter((entry) => entry.publicId !== mapped.publicId)],
        uploading: false,
        uploadError: false,
      });
      return mapped;
    } catch {
      set({ uploading: false, uploadError: true });
      return null;
    }
  },
}));
