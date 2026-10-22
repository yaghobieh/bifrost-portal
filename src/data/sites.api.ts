import { requestWithError } from '@sdk/http';
import type { CmsSite, CreateSiteInput, UpdateSiteInput } from './sites.types';

export const SITES_API_PATH = '/api/sites';
export const CMS_SITES_STORAGE_KEY = 'bifrost_cms_sites_list';

export const DEFAULT_SITES: CmsSite[] = [
  {
    id: 'default',
    slug: 'default',
    name: 'Primary Site',
    domain: 'localhost',
    description: 'Default main portal website',
    locale: 'en',
    theme: 'light',
    isDefault: true,
    settings: {},
  },
  {
    id: 'docs-site',
    slug: 'docs',
    name: 'Documentation Portal',
    domain: 'docs.bifrost.dev',
    description: 'Developer guides and API reference site',
    locale: 'en',
    theme: 'dark',
    isDefault: false,
    settings: {},
  },
  {
    id: 'marketing-site',
    slug: 'marketing',
    name: 'Marketing Hub',
    domain: 'bifrost.dev',
    description: 'Product landing and high-conversion marketing pages',
    locale: 'en',
    theme: 'light',
    isDefault: false,
    settings: {},
  },
];

export const getStoredSites = (): CmsSite[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(CMS_SITES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_SITES;
};

export const saveStoredSites = (sites: CmsSite[]): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CMS_SITES_STORAGE_KEY, JSON.stringify(sites));
    }
  } catch {
    // noop
  }
};

export const fetchSites = async (): Promise<CmsSite[]> => {
  try {
    const res = await requestWithError(SITES_API_PATH, undefined, { silent: true, code: 'sites' });
    if (res.ok) {
      const data = (await res.json()) as { sites?: CmsSite[] };
      if (data.sites && Array.isArray(data.sites) && data.sites.length > 0) {
        const stored = getStoredSites();
        const apiIds = new Set(data.sites.map((s) => s.id));
        const merged = [...data.sites, ...stored.filter((s) => !apiIds.has(s.id))];
        saveStoredSites(merged);
        return merged;
      }
    }
  } catch {
    // fallback to storage
  }
  return getStoredSites();
};

export const fetchSiteById = async (id: string): Promise<CmsSite | null> => {
  try {
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(id)}`, undefined, { silent: true, code: 'sites' });
    if (res.ok) {
      const data = (await res.json()) as { site?: CmsSite };
      if (data.site) return data.site;
    }
  } catch {
    // fallback to storage
  }
  const stored = getStoredSites();
  return stored.find((s) => s.id === id || s.slug === id) || null;
};

export const createSite = async (input: CreateSiteInput, token?: string): Promise<CmsSite> => {
  const newSite: CmsSite = {
    id: input.id || `site_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    slug: input.slug,
    name: input.name,
    domain: input.domain ?? null,
    description: input.description ?? null,
    locale: input.locale || 'en',
    theme: input.theme || 'light',
    isDefault: Boolean(input.isDefault),
    settings: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const current = getStoredSites();
  const next = input.isDefault
    ? [...current.map((s) => ({ ...s, isDefault: false })), newSite]
    : [...current, newSite];
  saveStoredSites(next);

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await requestWithError(SITES_API_PATH, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    }, { silent: true, code: 'sites' });
    if (res.ok) {
      const data = (await res.json()) as { site: CmsSite };
      if (data.site) {
        const synced = next.map((s) => (s.id === newSite.id ? data.site : s));
        saveStoredSites(synced);
        return data.site;
      }
    }
  } catch {
    // offline/mock fallback: local save preserved
  }
  return newSite;
};

export const updateSite = async (id: string, input: UpdateSiteInput, token?: string): Promise<CmsSite> => {
  const current = getStoredSites();
  let updatedSite: CmsSite | null = null;
  const next = current.map((s) => {
    if (s.id === id || s.slug === id) {
      updatedSite = {
        ...s,
        ...input,
        isDefault: input.isDefault !== undefined ? Boolean(input.isDefault) : s.isDefault,
        updatedAt: new Date().toISOString(),
      };
      return updatedSite;
    }
    if (input.isDefault) {
      return { ...s, isDefault: false };
    }
    return s;
  });
  if (updatedSite) {
    saveStoredSites(next);
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(input),
    }, { silent: true, code: 'sites' });
    if (res.ok) {
      const data = (await res.json()) as { site: CmsSite };
      if (data.site) {
        const synced = next.map((s) => (s.id === id ? data.site : s));
        saveStoredSites(synced);
        return data.site;
      }
    }
  } catch {
    // offline/mock fallback
  }
  return updatedSite || current.find((s) => s.id === id) || (current[0] as CmsSite);
};

export const deleteSite = async (id: string, token?: string): Promise<boolean> => {
  const current = getStoredSites();
  const next = current.filter((s) => s.id !== id && s.slug !== id);
  saveStoredSites(next);

  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers,
    }, { silent: true, code: 'sites' });
    return res.ok;
  } catch {
    return true;
  }
};

export const fetchSitePlugins = async (siteId: string): Promise<import('./sites.types').SitePlugin[]> => {
  try {
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(siteId)}/plugins`, undefined, { silent: true, code: 'sites' });
    if (!res.ok) return [];
    const data = (await res.json()) as { plugins?: import('./sites.types').SitePlugin[] };
    return data.plugins || [];
  } catch {
    return [];
  }
};

export const updateSitePlugins = async (
  siteId: string,
  plugins: import('./sites.types').SitePlugin[],
  applyToAllOnInstall = false,
  token?: string,
): Promise<boolean> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(siteId)}/plugins`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ plugins, applyToAllOnInstall }),
    }, { silent: false, code: 'sites' });
    return res.ok;
  } catch {
    return false;
  }
};

export const fetchSiteUsers = async (siteId: string): Promise<import('./sites.types').SiteUser[]> => {
  try {
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(siteId)}/users`, undefined, { silent: true, code: 'sites' });
    if (!res.ok) return [];
    const data = (await res.json()) as { users?: import('./sites.types').SiteUser[] };
    return data.users || [];
  } catch {
    return [];
  }
};

export const addSiteUser = async (
  siteId: string,
  user: { name: string; role?: string; email?: string },
  token?: string,
): Promise<import('./sites.types').SiteUser | null> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(siteId)}/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(user),
    }, { silent: false, code: 'sites' });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: import('./sites.types').SiteUser };
    return data.user || null;
  } catch {
    return null;
  }
};
