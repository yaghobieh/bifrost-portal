import { useState, type FC } from 'react';
import { Badge, BearIcons, Button, Flex, Switch, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { downloadPostmanCollection } from '../../DeveloperPages.utils';
import { loadAllPageTypes } from '../../../ContentPages/pageTypes.utils';
import type { EndpointDef } from './ApiEndpointsView.types';

const ALL_ENDPOINTS: EndpointDef[] = [
  // Articles
  {
    id: 'get-articles',
    method: 'GET',
    path: '/api/articles',
    category: 'Articles',
    description: 'List articles with filtering, pagination, locale and status',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer <api_token>',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      data: [
        {
          id: 'art-101',
          title: 'Getting started with GraphQL',
          slug: 'getting-started-graphql',
          status: 'published',
          locale: 'en',
          collection: 'articles',
          author: 'Maya Chen',
          updatedAt: '2026-09-27T08:12:00Z',
        },
        {
          id: 'art-102',
          title: 'Designing resilient content models',
          slug: 'resilient-content-models',
          status: 'draft',
          locale: 'en',
          collection: 'articles',
          author: 'Priya Nair',
          updatedAt: '2026-09-26T14:30:00Z',
        },
      ],
      meta: { page: 1, pageSize: 25, total: 96 },
    },
  },
  {
    id: 'get-article-slug',
    method: 'GET',
    path: '/api/articles/:slug',
    category: 'Articles',
    description: 'Fetch single article by slug or document ID',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer <api_token>',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      data: {
        id: 'art-101',
        title: 'Getting started with GraphQL',
        slug: 'getting-started-graphql',
        status: 'published',
        locale: 'en',
        collection: 'articles',
        payload: {
          lead: 'Learn how to consume headless CMS content via GraphQL queries.',
          body: '<p>GraphQL provides declarative data fetching for your multi-channel digital surfaces.</p>',
          featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
          categories: ['Engineering', 'Tutorial'],
          tags: ['graphql', 'headless', 'cms'],
          createdBy: 'Maya Chen',
          updatedBy: 'Maya Chen',
        },
        updatedAt: '2026-09-27T08:12:00Z',
      },
    },
  },
  {
    id: 'post-article',
    method: 'POST',
    path: '/api/articles',
    category: 'Articles',
    description: 'Create a new article entry with custom fields, categories, and tags',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer <api_token>',
    },
    requestBody: {
      title: 'Deploying Modern Headless Microfrontends',
      slug: 'deploying-modern-headless-microfrontends',
      type: 'articles',
      locale: 'en',
      status: 'published',
      payload: {
        lead: 'A guide to decoupled architecture and instant content delivery.',
        body: '<p>Modern teams decouple presentation from backend business logic.</p>',
        author: 'John Doe',
        categories: ['Architecture'],
        tags: ['headless', 'vite', 'react'],
      },
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      page: {
        id: 'art-103',
        name: 'deploying-modern-headless-microfrontends',
        type: 'articles',
        title: 'Deploying Modern Headless Microfrontends',
        status: 'published',
        locale: 'en',
        createdAt: '2026-09-27T12:00:00Z',
      },
    },
  },
  {
    id: 'delete-article',
    method: 'DELETE',
    path: '/api/articles?name=:slug&type=articles',
    category: 'Articles',
    description: 'Remove an article from database',
    headers: {
      Authorization: 'Bearer <api_token>',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      ok: true,
      name: 'deploying-modern-headless-microfrontends',
      type: 'articles',
    },
  },

  // Pages
  {
    id: 'get-pages',
    method: 'GET',
    path: '/api/pages',
    category: 'Pages',
    description: 'List site structure and static pages by hierarchy',
    headers: {
      Accept: 'application/json',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      pages: [
        { name: 'home', path: '/', status: 'published', locale: 'en' },
        { name: 'pricing', path: '/pricing', status: 'published', locale: 'en' },
        { name: 'about', path: '/about', status: 'published', locale: 'en' },
      ],
    },
  },
  {
    id: 'get-page-slug',
    method: 'GET',
    path: '/api/public/pages/:slug',
    category: 'Pages',
    description: 'Fetch page content, layouts, and canvas widgets by slug',
    headers: {
      Accept: 'application/json',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      items: [
        {
          title: 'Pricing',
          body: '<h2>Simple, predictable plans</h2>',
          meta: { lead: 'Pay as you grow with dedicated API tokens.' },
        },
      ],
    },
  },
  {
    id: 'post-page',
    method: 'POST',
    path: '/api/pages',
    category: 'Pages',
    description: 'Create or update a page document',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer <api_token>',
    },
    requestBody: {
      name: 'enterprise',
      title: 'Enterprise Solutions',
      type: 'pages',
      locale: 'en',
      status: 'draft',
      payload: {
        lead: 'High availability multi-region CMS infrastructure.',
        sections: [],
      },
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      page: {
        id: 'pg-204',
        name: 'enterprise',
        type: 'pages',
        title: 'Enterprise Solutions',
        status: 'draft',
      },
    },
  },

  // Blog
  {
    id: 'get-blogs',
    method: 'GET',
    path: '/api/blog/posts',
    category: 'Blog',
    description: 'List blog posts feed with author and category filtering',
    headers: {
      Accept: 'application/json',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      items: [
        {
          id: 'bg-301',
          title: 'How we cut build times by 40%',
          slug: 'cut-build-times-40',
          category: 'Engineering',
          author: 'Sam Okoye',
          publishedAt: '2026-09-25T10:00:00Z',
        },
      ],
    },
  },
  {
    id: 'get-blog-slug',
    method: 'GET',
    path: '/api/blog/posts/:slug',
    category: 'Blog',
    description: 'Fetch blog post by slug with views tracking and full content',
    headers: {
      Accept: 'application/json',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      item: {
        id: 'bg-301',
        title: 'How we cut build times by 40%',
        slug: 'cut-build-times-40',
        payload: {
          views: 1420,
          author: 'Sam Okoye',
          body: '<p>Incremental builds and Vite asset bundling dramatically improved DX.</p>',
        },
      },
    },
  },

  // Generic Content
  {
    id: 'get-content-collection',
    method: 'GET',
    path: '/api/cms/get-content/:collection',
    category: 'Content',
    description: 'Universal headless content query endpoint for any custom collection',
    headers: {
      Authorization: 'Bearer <api_token>',
      Accept: 'application/json',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      items: [
        {
          id: 'cnt-88',
          collection: 'products',
          slug: 'pro-license',
          title: 'Bifrost Pro License',
          status: 'published',
          payload: { price: 299, currency: 'USD', seats: 5 },
        },
      ],
    },
  },
  {
    id: 'post-content',
    method: 'POST',
    path: '/api/cms/create-page',
    category: 'Content',
    description: 'Create or update an entry in any custom schema collection',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer <api_token>',
    },
    requestBody: {
      collection: 'products',
      slug: 'enterprise-license',
      title: 'Bifrost Enterprise Plan',
      status: 'published',
      locale: 'en',
      payload: {
        price: 999,
        currency: 'USD',
        seats: 'unlimited',
      },
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      item: {
        id: 'cnt-89',
        collection: 'products',
        slug: 'enterprise-license',
        title: 'Bifrost Enterprise Plan',
        status: 'published',
      },
    },
  },

  // Media
  {
    id: 'get-media',
    method: 'GET',
    path: '/api/cms/media',
    category: 'Media',
    description: 'List media assets, thumbnails, dimensions, and CDN URLs',
    headers: {
      Authorization: 'Bearer <api_token>',
      Accept: 'application/json',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      items: [
        {
          id: 'med-501',
          url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          name: 'hero-banner.jpg',
          format: 'jpg',
          sizeBytes: 248000,
        },
      ],
    },
  },

  // Auth
  {
    id: 'post-auth-login',
    method: 'POST',
    path: '/api/auth/login',
    category: 'Auth',
    description: 'Authenticate user credentials and receive JWT bearer session token',
    headers: {
      'Content-Type': 'application/json',
    },
    requestBody: {
      username: 'editor@example.com',
      password: '••••••••••••',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      token: 'jwt_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'usr-1',
        username: 'editor@example.com',
        role: 'admin',
      },
    },
  },

  // System
  {
    id: 'get-health',
    method: 'GET',
    path: '/api/health',
    category: 'System',
    description: 'Inspect CMS runtime health, database connection, and uptime',
    headers: {
      Accept: 'application/json',
    },
    responseStatus: 200,
    responseHeaders: {
      'content-type': 'application/json; charset=utf-8',
    },
    responseBody: {
      status: 'ok',
      uptime: 38420,
      database: 'connected',
      version: '1.1.16',
    },
  },
];

export const ApiEndpointsView: FC = () => {
  const { t } = useI18n();
  const [devMode, setDevMode] = useState(true);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('get-articles');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const customPageTypes = loadAllPageTypes().filter(
    (pt) => !['articles', 'pages', 'blog', 'docs'].includes(pt.id),
  );

  const customEndpoints: EndpointDef[] = customPageTypes.flatMap((pt): EndpointDef[] => [
    {
      id: `get-${pt.id}`,
      method: 'GET',
      path: `/api/${pt.id}`,
      category: pt.name,
      description: `List ${pt.name} entries with pagination and locale filtering`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer <api_token>',
      } as Record<string, string>,
      requestBody: null,
      responseStatus: 200,
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
      },
      responseBody: {
        data: [
          {
            id: `${pt.id}-101`,
            title: `Sample ${pt.name} Entry`,
            slug: `sample-${pt.id}-entry`,
            collection: pt.id,
            status: 'published',
            locale: 'en',
            updatedAt: '2026-09-27T12:00:00Z',
          },
        ],
        meta: { page: 1, pageSize: 25, total: 1 },
      },
    },
    {
      id: `get-${pt.id}-slug`,
      method: 'GET',
      path: `/api/${pt.id}/:slug`,
      category: pt.name,
      description: `Fetch single ${pt.name} entry by slug`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer <api_token>',
      } as Record<string, string>,
      requestBody: null,
      responseStatus: 200,
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
      },
      responseBody: {
        data: {
          id: `${pt.id}-101`,
          title: `Sample ${pt.name} Entry`,
          slug: `sample-${pt.id}-entry`,
          collection: pt.id,
          status: 'published',
          locale: 'en',
          payload: pt.fields.reduce(
            (acc, f) => ({ ...acc, [f.id]: f.defaultValue || `<${f.name}>` }),
            {},
          ),
          updatedAt: '2026-09-27T12:00:00Z',
        },
      },
    },
    {
      id: `post-${pt.id}`,
      method: 'POST',
      path: `/api/${pt.id}`,
      category: pt.name,
      description: `Create a new ${pt.name} entry`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer <api_token>',
      },
      requestBody: {
        title: `New ${pt.name}`,
        slug: `new-${pt.id}-${Date.now()}`,
        type: pt.id,
        locale: 'en',
        status: 'draft',
        payload: pt.fields.reduce(
          (acc, f) => ({ ...acc, [f.id]: f.defaultValue || `<${f.name}>` }),
          {},
        ),
      },
      responseStatus: 200,
      responseHeaders: {
        'content-type': 'application/json; charset=utf-8',
      },
      responseBody: {
        page: {
          id: `${pt.id}-102`,
          name: `new-${pt.id}`,
          type: pt.id,
          title: `New ${pt.name}`,
          status: 'draft',
          locale: 'en',
          createdAt: '2026-09-27T12:00:00Z',
        },
      },
    },
  ]);

  const allEndpoints = [...ALL_ENDPOINTS, ...customEndpoints];

  const activeEndpoint =
    allEndpoints.find((ep) => ep.id === selectedEndpointId) || allEndpoints[0];

  const categories = [
    'All',
    'Articles',
    'Pages',
    'Blog',
    'Content',
    'Media',
    'Auth',
    'System',
    ...customPageTypes.map((pt) => pt.name),
  ];

  const filteredEndpoints =
    activeCategory === 'All'
      ? allEndpoints
      : allEndpoints.filter((ep) => ep.category === activeCategory);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      setCopiedType(null);
    }
  };

  const methodClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'anchor-method get';
      case 'POST':
        return 'anchor-method post';
      case 'PUT':
        return 'anchor-method put';
      case 'DELETE':
        return 'anchor-method delete';
      default:
        return 'anchor-method get';
    }
  };

  return (
    <div className="anchor-api-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-1">
            API Reference &amp; Endpoints
          </Typography>
          <Typography variant="body2" className="text-sm text-gray-500">
            Every content type is exposed automatically over REST and GraphQL. Click any endpoint to inspect headers, request payload, and response.
          </Typography>
        </div>
        <Flex gap={3} align="center" className="flex-wrap">
          <Flex gap={2} align="center" className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            <Typography variant="caption" className="text-xs font-semibold text-gray-700">
              Dev Mode
            </Typography>
            <Switch
              id="cms-dev-mode-toggle"
              checked={devMode}
              onCheckedChange={setDevMode}
            />
          </Flex>
          {devMode && (
            <Button
              variant="primary"
              size="sm"
              onClick={downloadPostmanCollection}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold flex items-center gap-2 shadow-sm"
            >
              <BearIcons.DownloadIcon size={16} />
              <span>Download Postman Collection (.json)</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-pink-600 text-pink-600 hover:bg-pink-50 font-medium"
          >
            View full reference
          </Button>
        </Flex>
      </div>

      {devMode && (
        <div className="mb-6 p-4 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-between shadow-sm">
          <Flex gap={2} align="center">
            <Badge variant="info" className="bg-pink-600 text-white font-bold">
              Dev Mode Active
            </Badge>
            <Typography variant="body2" className="text-sm text-pink-900">
              Postman collection v2.1 with environments and live headers is ready for export.
            </Typography>
          </Flex>
          <Button
            size="sm"
            variant="primary"
            onClick={downloadPostmanCollection}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold flex items-center gap-1.5"
          >
            <BearIcons.DownloadIcon size={14} />
            <span>Export Collection (.json)</span>
          </Button>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid: Left column endpoints, Right column inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Endpoints List */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <Typography variant="caption" className="text-xs uppercase font-bold text-gray-400 mb-1 px-1 block">
            Select an endpoint to inspect ({filteredEndpoints.length})
          </Typography>
          <div className="anchor-panel divide-y divide-gray-100 overflow-hidden shadow-sm">
            {filteredEndpoints.map((ep) => {
              const isSelected = ep.id === activeEndpoint.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpointId(ep.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-pink-50/70 border-l-4 border-l-pink-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`${methodClass(ep.method)} mt-0.5`}>{ep.method}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-semibold text-gray-900 truncate">
                      {ep.path}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {ep.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Inspector Panel */}
        <div className="lg:col-span-7">
          <Typography variant="caption" className="text-xs uppercase font-bold text-gray-400 mb-1 px-1 block">
            Endpoint Inspector
          </Typography>
          <div className="anchor-panel p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header info */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className={methodClass(activeEndpoint.method)}>
                  {activeEndpoint.method}
                </span>
                <span className="font-mono text-sm font-bold text-gray-900">
                  {activeEndpoint.path}
                </span>
              </div>
              <Badge variant="info" className="bg-pink-100 text-pink-700 font-semibold border-pink-200">
                {activeEndpoint.category}
              </Badge>
            </div>

            <Typography variant="body2" className="text-sm text-gray-600 mb-4">
              {activeEndpoint.description}
            </Typography>

            {/* Request Headers */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Request Headers
                </Typography>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(activeEndpoint.headers, null, 2),
                      'headers',
                    )
                  }
                  className="text-xs text-pink-600 hover:text-pink-700 font-semibold cursor-pointer"
                >
                  {copiedType === 'headers' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-gray-900 text-pink-200 rounded-md text-xs font-mono overflow-x-auto m-0 leading-relaxed">
                {Object.entries(activeEndpoint.headers)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')}
              </pre>
            </div>

            {/* Request Body (if POST/PUT) */}
            {Boolean(activeEndpoint.requestBody) && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Post Send Object (Request Body)
                  </Typography>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(activeEndpoint.requestBody, null, 2),
                        'reqBody',
                      )
                    }
                    className="text-xs text-pink-600 hover:text-pink-700 font-semibold cursor-pointer"
                  >
                    {copiedType === 'reqBody' ? 'Copied!' : 'Copy Object'}
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-emerald-300 rounded-md text-xs font-mono overflow-x-auto m-0 leading-relaxed max-h-56">
                  {JSON.stringify(activeEndpoint.requestBody, null, 2)}
                </pre>
              </div>
            )}

            {/* Expected Response */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Flex gap={2} align="center">
                  <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Look-like Response
                  </Typography>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {activeEndpoint.responseStatus} OK
                  </span>
                </Flex>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(activeEndpoint.responseBody, null, 2),
                      'resBody',
                    )
                  }
                  className="text-xs text-pink-600 hover:text-pink-700 font-semibold cursor-pointer"
                >
                  {copiedType === 'resBody' ? 'Copied!' : 'Copy Response'}
                </button>
              </div>
              <pre className="p-3 bg-gray-900 text-blue-200 rounded-md text-xs font-mono overflow-x-auto m-0 leading-relaxed max-h-72">
                {JSON.stringify(activeEndpoint.responseBody, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* API Tokens */}
      <div className="anchor-panel mb-6 shadow-sm">
        <div className="anchor-panel-head flex justify-between items-center p-4 border-b border-gray-100">
          <Typography variant="h3" className="text-base font-bold text-gray-900 mb-0">
            API Tokens
          </Typography>
          <Button
            size="sm"
            variant="primary"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold"
          >
            ＋ Generate Token
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Access</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last used</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">Storefront — read only</div>
                  <div className="text-xs text-gray-400 font-mono">tk_live_4f2a…c91b</div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="info">Read-only</Badge>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">3 hours ago</td>
                <td className="py-3 px-4 text-gray-500 text-xs">2 minutes ago</td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost">✎</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">Marketing site</div>
                  <div className="text-xs text-gray-400 font-mono">tk_live_88e1…40aa</div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="info">Read-only</Badge>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">2 weeks ago</td>
                <td className="py-3 px-4 text-gray-500 text-xs">1 hour ago</td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost">✎</Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">CI Pipeline</div>
                  <div className="text-xs text-gray-400 font-mono">tk_live_99d3…aa52</div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="success">Full Access</Badge>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">1 month ago</td>
                <td className="py-3 px-4 text-gray-500 text-xs">Yesterday</td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost">✎</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
