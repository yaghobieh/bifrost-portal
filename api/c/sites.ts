import { jsonResponse } from '../../server/cmsJson';

export const config = { runtime: 'edge' };

interface SiteRecord {
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
}

const MEMORY_SITES: SiteRecord[] = [
  {
    id: 'default',
    slug: 'default',
    name: 'Primary Site',
    domain: 'localhost',
    description: 'Default main portal website',
    locale: 'en',
    theme: 'light',
    isDefault: true,
    settings: {
      plugins: [
        { id: 'seo', name: 'SEO Engine & Meta Optimization', enabled: true, version: '1.2.0' },
        { id: 'analytics', name: 'Traffic & Conversion Analytics', enabled: true, version: '2.0.1' },
        { id: 'sitemap', name: 'Automated XML Sitemaps', enabled: true, version: '1.0.4' },
      ],
      users: [
        { id: 'usr-manager', name: 'Network Manager (You)', role: 'manager', globalAccess: true, isOwner: true },
        { id: 'usr-default-editor', name: 'Primary Content Editor', role: 'editor', globalAccess: false, siteId: 'default' },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathParam = url.searchParams.get('path') || '';

  // Handle /api/sites/:siteId/plugins
  if (pathname.includes('/plugins') || pathParam.includes('/plugins')) {
    const siteId = pathname.split('/')[3] || 'default';
    const site = MEMORY_SITES.find((s) => s.id === siteId || s.slug === siteId) || MEMORY_SITES[0];
    if (request.method === 'GET') {
      const plugins = (site.settings?.plugins as unknown[]) || [];
      return jsonResponse(200, { siteId: site.id, plugins });
    }
    if (request.method === 'PUT') {
      const body = (await request.json().catch(() => ({}))) as { plugins?: unknown[] };
      if (!site.settings) site.settings = {};
      site.settings.plugins = body.plugins || [];
      return jsonResponse(200, { ok: true, plugins: site.settings.plugins });
    }
  }

  // Handle /api/sites/:siteId/users
  if (pathname.includes('/users') || pathParam.includes('/users')) {
    const siteId = pathname.split('/')[3] || 'default';
    const site = MEMORY_SITES.find((s) => s.id === siteId || s.slug === siteId) || MEMORY_SITES[0];
    if (request.method === 'GET') {
      const users = (site.settings?.users as unknown[]) || [];
      return jsonResponse(200, { siteId: site.id, users });
    }
    if (request.method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { name: string; role?: string; email?: string };
      const newUser = {
        id: `usr-${Date.now()}`,
        name: body.name || 'Site Editor',
        email: body.email || '',
        role: body.role || 'editor',
        globalAccess: false,
        siteId: site.id,
      };
      if (!site.settings) site.settings = {};
      const currentUsers = Array.isArray(site.settings.users) ? site.settings.users : [];
      site.settings.users = [...currentUsers, newUser];
      return jsonResponse(200, { ok: true, user: newUser, users: site.settings.users });
    }
  }

  // Handle GET /api/sites
  if (request.method === 'GET') {
    const segments = pathname.replace(/^\/api\/sites\/?/, '').split('/').filter(Boolean);
    const id = segments[0];
    if (id) {
      const site = MEMORY_SITES.find((s) => s.id === id || s.slug === id);
      if (!site) return jsonResponse(404, { error: 'siteNotFound' });
      return jsonResponse(200, { site });
    }
    return jsonResponse(200, { sites: MEMORY_SITES, items: MEMORY_SITES, total: MEMORY_SITES.length });
  }

  // Handle POST /api/sites
  if (request.method === 'POST') {
    const body = (await request.json().catch(() => ({}))) as {
      name: string;
      slug: string;
      domain?: string;
      locale?: string;
      description?: string;
      isDefault?: boolean;
    };
    if (!body.name || !body.slug) {
      return jsonResponse(400, { error: 'siteNameAndSlugRequired' });
    }
    const slug = body.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
    const existing = MEMORY_SITES.find((s) => s.slug === slug || s.id === slug);
    if (existing) {
      return jsonResponse(400, { error: 'siteAlreadyExists' });
    }
    const newSite: SiteRecord = {
      id: slug,
      slug,
      name: body.name.trim(),
      domain: body.domain || null,
      description: body.description || null,
      locale: body.locale || 'en',
      theme: 'light',
      isDefault: Boolean(body.isDefault),
      settings: {
        plugins: [
          { id: 'seo', name: 'SEO Engine & Meta Optimization', enabled: true, version: '1.2.0' },
          { id: 'analytics', name: 'Traffic & Conversion Analytics', enabled: true, version: '2.0.1' },
        ],
        users: [
          { id: 'usr-manager', name: 'Network Manager (You)', role: 'manager', globalAccess: true, isOwner: true },
          { id: `usr-${slug}-editor`, name: `${body.name} Content Editor`, role: 'editor', globalAccess: false, siteId: slug },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MEMORY_SITES.push(newSite);
    return jsonResponse(200, { site: newSite });
  }

  // Handle PUT /api/sites/:id
  if (request.method === 'PUT') {
    const segments = pathname.replace(/^\/api\/sites\/?/, '').split('/').filter(Boolean);
    const id = segments[0];
    const site = MEMORY_SITES.find((s) => s.id === id || s.slug === id);
    if (!site) return jsonResponse(404, { error: 'siteNotFound' });
    const body = (await request.json().catch(() => ({}))) as Partial<SiteRecord>;
    if (body.name) site.name = body.name;
    if (body.domain !== undefined) site.domain = body.domain;
    if (body.description !== undefined) site.description = body.description;
    if (body.locale) site.locale = body.locale;
    site.updatedAt = new Date().toISOString();
    return jsonResponse(200, { site });
  }

  // Handle DELETE /api/sites/:id
  if (request.method === 'DELETE') {
    const segments = pathname.replace(/^\/api\/sites\/?/, '').split('/').filter(Boolean);
    const id = segments[0];
    const index = MEMORY_SITES.findIndex((s) => s.id === id || s.slug === id);
    if (index === -1) return jsonResponse(404, { error: 'siteNotFound' });
    if (MEMORY_SITES[index].isDefault) {
      return jsonResponse(400, { error: 'cannotDeleteDefaultSite' });
    }
    const removed = MEMORY_SITES.splice(index, 1)[0];
    return jsonResponse(200, { ok: true, id: removed.id, slug: removed.slug });
  }

  return jsonResponse(405, { error: 'methodNotAllowed' });
}
