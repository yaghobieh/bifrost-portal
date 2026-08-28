import {
  API_BLOG_POSTS_PATH,
  API_CMS_CONTENT_PATH,
  API_CMS_MEDIA_CONFIG_PATH,
  API_CMS_SETTINGS_PREFIX,
  API_PUBLIC_PLUGINS_PATH,
  API_V1_PAGE_PATH,
  API_V1_VERSION_PATH,
  API_VERSION_PATH,
  EMPTY_STRING,
  ERROR_NOT_FOUND,
  METHOD_DELETE,
  METHOD_GET,
  METHOD_PUT,
  PATH_SEGMENT_POSTS,
  PATH_SEGMENT_REST,
  QUERY_REST,
  QUERY_SLUG,
  REST_BLOG,
  REST_CONTENT,
  REST_MEDIA_CONFIG,
  REST_PAGE,
  REST_PLUGINS,
  REST_SETTINGS,
  REST_VERSION,
} from './cmsAuth.const';
import { HTTP_STATUS_NOT_FOUND } from './cmsDocs.const';
import {
  deleteAdminContent,
  listPublishedBlog,
  pageBySlugQuery,
  publishedBlogBySlug,
} from './cmsAdminContent';
import { handleAuthedJson, handlePublicJson } from './cmsAuthRoute';
import { jsonResponse } from './cmsJson';
import { handleSettings } from './cmsKv';
import { mediaConfigPayload, pluginCatalogPayload, versionPayload } from './cmsVersion';

const restFromPath = (pathname: string): string => {
  if (pathname.includes(API_CMS_SETTINGS_PREFIX)) {
    return REST_SETTINGS;
  }
  if (pathname.includes(API_CMS_MEDIA_CONFIG_PATH)) {
    return REST_MEDIA_CONFIG;
  }
  if (pathname.includes(API_CMS_CONTENT_PATH)) {
    return REST_CONTENT;
  }
  if (pathname.includes(API_PUBLIC_PLUGINS_PATH)) {
    return REST_PLUGINS;
  }
  if (pathname.includes(API_V1_PAGE_PATH)) {
    return REST_PAGE;
  }
  if (pathname.includes(API_V1_VERSION_PATH) || pathname === API_VERSION_PATH) {
    return REST_VERSION;
  }
  if (pathname.includes(API_BLOG_POSTS_PATH)) {
    return REST_BLOG;
  }
  return EMPTY_STRING;
};

const restKind = (request: Request): string => {
  const url = new URL(request.url);
  const fromQuery = (url.searchParams.get(QUERY_REST) ?? EMPTY_STRING).trim();
  if (fromQuery) {
    return fromQuery;
  }
  return restFromPath(url.pathname);
};

export const handleCmsRest = async (request: Request): Promise<Response> => {
  const kind = restKind(request);
  if (kind === REST_SETTINGS) {
    return handleAuthedJson(request, [METHOD_GET, METHOD_PUT], handleSettings);
  }
  if (kind === REST_CONTENT) {
    return handleAuthedJson(request, [METHOD_DELETE], deleteAdminContent);
  }
  if (kind === REST_MEDIA_CONFIG) {
    return handlePublicJson(request, [METHOD_GET], async () => mediaConfigPayload());
  }
  if (kind === REST_PLUGINS) {
    return handlePublicJson(request, [METHOD_GET], async () => pluginCatalogPayload());
  }
  if (kind === REST_PAGE) {
    return handlePublicJson(request, [METHOD_GET], pageBySlugQuery);
  }
  if (kind === REST_VERSION) {
    return handlePublicJson(request, [METHOD_GET], async () => versionPayload());
  }
  if (kind === REST_BLOG) {
    const url = new URL(request.url);
    const slugQuery = (url.searchParams.get(QUERY_SLUG) ?? EMPTY_STRING).trim();
    const parts = url.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] ?? EMPTY_STRING;
    const isList = last === REST_BLOG || last === PATH_SEGMENT_POSTS || last === PATH_SEGMENT_REST;
    if (slugQuery || !isList) {
      return handlePublicJson(request, [METHOD_GET], publishedBlogBySlug);
    }
    return handlePublicJson(request, [METHOD_GET], listPublishedBlog);
  }
  return jsonResponse(HTTP_STATUS_NOT_FOUND, { error: ERROR_NOT_FOUND });
};
