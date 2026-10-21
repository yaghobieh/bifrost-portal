import { requestWithError } from '@sdk/http';
import type { CmsSite, CreateSiteInput, UpdateSiteInput } from './sites.types';

export const SITES_API_PATH = '/api/sites';

export const fetchSites = async (): Promise<CmsSite[]> => {
  try {
    const res = await requestWithError(SITES_API_PATH, undefined, { silent: true, code: 'sites' });
    if (!res.ok) return [];
    const data = (await res.json()) as { sites?: CmsSite[] };
    return data.sites || [];
  } catch {
    return [];
  }
};

export const fetchSiteById = async (id: string): Promise<CmsSite | null> => {
  try {
    const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(id)}`, undefined, { silent: true, code: 'sites' });
    if (!res.ok) return null;
    const data = (await res.json()) as { site?: CmsSite };
    return data.site || null;
  } catch {
    return null;
  }
};

export const createSite = async (input: CreateSiteInput, token?: string): Promise<CmsSite> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await requestWithError(SITES_API_PATH, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  }, { silent: false, code: 'sites' });
  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || 'Failed to create site');
  }
  const data = (await res.json()) as { site: CmsSite };
  return data.site;
};

export const updateSite = async (id: string, input: UpdateSiteInput, token?: string): Promise<CmsSite> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(input),
  }, { silent: false, code: 'sites' });
  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || 'Failed to update site');
  }
  const data = (await res.json()) as { site: CmsSite };
  return data.site;
};

export const deleteSite = async (id: string, token?: string): Promise<boolean> => {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await requestWithError(`${SITES_API_PATH}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  }, { silent: false, code: 'sites' });
  return res.ok;
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
