import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CMS_SITES_STORAGE_KEY,
  createSite,
  deleteSite,
  fetchSites,
  getStoredSites,
  updateSite,
} from '../data/sites.api';
import type { CmsSite, CreateSiteInput, UpdateSiteInput } from '../data/sites.types';

export const CMS_ACTIVE_SITE_KEY = 'bifrost_cms_active_site_id';
export const CMS_ACTIVE_SITE_EVENT = 'cms_active_site_changed';
export { CMS_SITES_STORAGE_KEY };

const getInitialActiveSiteId = (): string => {
  try {
    return localStorage.getItem(CMS_ACTIVE_SITE_KEY) || 'default';
  } catch {
    return 'default';
  }
};

/**
 * Custom hook to manage multi-site state, active site switching, and CRUD operations.
 * Handles synchronization across components via browser events and local storage.
 *
 * @param token Optional bearer token for authenticated operations
 * @returns Sites state, active site object, and management handlers
 */
export const useSites = (token?: string) => {
  const [sites, setSites] = useState<CmsSite[]>(getStoredSites);
  const [activeSiteId, setActiveSiteIdState] = useState<string>(getInitialActiveSiteId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSites();
      if (data && data.length > 0) {
        setSites(data);
      } else {
        setSites(getStoredSites());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load sites';
      setError(msg);
      setSites(getStoredSites());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSites();
  }, [loadSites]);

  useEffect(() => {
    const handleSiteChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ siteId: string }>;
      if (customEvent.detail?.siteId) {
        setActiveSiteIdState(customEvent.detail.siteId);
      }
    };
    window.addEventListener(CMS_ACTIVE_SITE_EVENT, handleSiteChange);
    return () => window.removeEventListener(CMS_ACTIVE_SITE_EVENT, handleSiteChange);
  }, []);

  const setActiveSiteId = useCallback((id: string) => {
    setActiveSiteIdState(id);
    try {
      localStorage.setItem(CMS_ACTIVE_SITE_KEY, id);
    } catch {
      // noop
    }
    window.dispatchEvent(
      new CustomEvent(CMS_ACTIVE_SITE_EVENT, { detail: { siteId: id } }),
    );
  }, []);

  const activeSite = useMemo(() => {
    return sites.find((s) => s.id === activeSiteId || s.slug === activeSiteId) || sites[0] || null;
  }, [sites, activeSiteId]);

  const addNewSite = useCallback(
    async (input: CreateSiteInput): Promise<CmsSite> => {
      setLoading(true);
      setError(null);
      try {
        const created = await createSite(input, token);
        await loadSites();
        return created;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to create site';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, loadSites],
  );

  const updateExistingSite = useCallback(
    async (id: string, input: UpdateSiteInput): Promise<CmsSite> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateSite(id, input, token);
        await loadSites();
        return updated;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update site';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, loadSites],
  );

  const removeSite = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const ok = await deleteSite(id, token);
        if (ok) {
          if (activeSiteId === id) {
            setActiveSiteId('default');
          }
          await loadSites();
        }
        return ok;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete site';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token, activeSiteId, setActiveSiteId, loadSites],
  );

  return {
    sites,
    activeSiteId,
    activeSite,
    loading,
    error,
    setActiveSiteId,
    refreshSites: loadSites,
    addNewSite,
    updateExistingSite,
    removeSite,
  };
};
