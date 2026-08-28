import { emptyPages } from '../../server/cmsAuth';
import {
  API_BLOG_POSTS_PATH,
  API_V1_PAGE_PATH,
  EMPTY_STRING,
  METHOD_GET,
  QUERY_REST,
  QUERY_SLUG,
  REST_BLOG,
  REST_PAGE,
} from '../../server/cmsAuth.const';
import { handleGetAuth, handlePublicJson } from '../../server/cmsAuthRoute';
import {
  isBlogListPath,
  listPublishedBlog,
  pageBySlugQuery,
  publishedBlogBySlug,
} from '../../server/cmsPublicRead';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const rest = (url.searchParams.get(QUERY_REST) ?? EMPTY_STRING).trim();
  const slugQuery = (url.searchParams.get(QUERY_SLUG) ?? EMPTY_STRING).trim();
  if (rest === REST_BLOG || pathname.includes(API_BLOG_POSTS_PATH)) {
    if (isBlogListPath(pathname, slugQuery) || (rest === REST_BLOG && !slugQuery)) {
      return handlePublicJson(request, [METHOD_GET], listPublishedBlog);
    }
    return handlePublicJson(request, [METHOD_GET], publishedBlogBySlug);
  }
  if (rest === REST_PAGE || pathname.includes(API_V1_PAGE_PATH) || slugQuery) {
    return handlePublicJson(request, [METHOD_GET], pageBySlugQuery);
  }
  return handleGetAuth(request, emptyPages);
}
