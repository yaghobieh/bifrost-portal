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
