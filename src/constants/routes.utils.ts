import {
  BUILDER_QUERY_DOC,
  BUILDER_QUERY_LAYOUT,
  NAV_LINKS_BASE,
  ROUTES,
  SHOW_LAB_NAV,
} from './routes.const';

export const cmsEditPath = (id: string): string =>
  ROUTES.CMS_EDIT.replace(':id', encodeURIComponent(id));

export const cmsBlogEditPath = (id: string): string =>
  ROUTES.CMS_BLOG_EDIT.replace(':id', encodeURIComponent(id));

export const blogPostPath = (slug: string, basePath: string = ROUTES.BLOG): string =>
  `${basePath}/${encodeURIComponent(slug)}`;

export const cmsBuilderPath = (query?: { doc?: string; layout?: string }): string => {
  const params = new URLSearchParams();
  if (query?.doc) {
    params.set(BUILDER_QUERY_DOC, query.doc);
  }
  if (query?.layout) {
    params.set(BUILDER_QUERY_LAYOUT, query.layout);
  }
  const search = params.toString();
  if (search) {
    return `${ROUTES.CMS_BUILDER}?${search}`;
  }
  return ROUTES.CMS_BUILDER;
};

export const DOC_PATH = (slug: string): string => `${ROUTES.DOCS}/${slug}`;

export const navLinks = () => {
  if (!SHOW_LAB_NAV) {
    return NAV_LINKS_BASE;
  }
  return [...NAV_LINKS_BASE, { id: 'lab' as const, href: ROUTES.LAB }];
};

export const NAV_LINKS = navLinks();
