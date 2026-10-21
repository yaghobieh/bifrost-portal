export type CmsSite = {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  description: string | null;
  locale: string;
  theme: string;
  isDefault: boolean;
  settings?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSiteInput = {
  id?: string;
  slug: string;
  name: string;
  domain?: string | null;
  description?: string | null;
  locale?: string;
  theme?: string;
  isDefault?: boolean;
};

export type UpdateSiteInput = Partial<CreateSiteInput & { settings?: Record<string, unknown> }>;

export type SitePlugin = {
  id: string;
  name: string;
  enabled: boolean;
  version?: string;
  description?: string;
};

export type SiteUser = {
  id: string;
  name: string;
  email?: string;
  role: string;
  globalAccess?: boolean;
  isOwner?: boolean;
  siteId?: string;
};
