import {
  ENV_DATABASE_URL,
  ERROR_METHOD,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_NO_CONTENT,
  METHOD_GET,
  METHOD_OPTIONS,
  METHOD_POST,
} from './cmsAuth.const';
import type { CmsAuthResult } from './cmsAuth.types';
import { jsonResponse } from './cmsJson';

type AuthRunner = (params: { databaseUrl: string; request: Request }) => Promise<CmsAuthResult>;

const databaseUrl = (): string => process.env[ENV_DATABASE_URL] ?? '';

const allowOptions = (request: Request): Response | null => {
  if (request.method !== METHOD_OPTIONS) {
    return null;
  }
  return new Response(null, { status: HTTP_STATUS_NO_CONTENT });
};

export const handlePostAuth = async (request: Request, run: AuthRunner): Promise<Response> => {
  const options = allowOptions(request);
  if (options) {
    return options;
  }
  if (request.method !== METHOD_POST) {
    return jsonResponse(HTTP_STATUS_METHOD_NOT_ALLOWED, { error: ERROR_METHOD });
  }
  const result = await run({ databaseUrl: databaseUrl(), request });
  return jsonResponse(result.status, result.body);
};

export const handleGetAuth = async (request: Request, run: AuthRunner): Promise<Response> => {
  const options = allowOptions(request);
  if (options) {
    return options;
  }
  if (request.method !== METHOD_GET) {
    return jsonResponse(HTTP_STATUS_METHOD_NOT_ALLOWED, { error: ERROR_METHOD });
  }
  const result = await run({ databaseUrl: databaseUrl(), request });
  return jsonResponse(result.status, result.body);
};

export const handleAuthedJson = async (
  request: Request,
  methods: readonly string[],
  run: AuthRunner,
): Promise<Response> => {
  const options = allowOptions(request);
  if (options) {
    return options;
  }
  const allowed = methods.includes(request.method);
  if (!allowed) {
    return jsonResponse(HTTP_STATUS_METHOD_NOT_ALLOWED, { error: ERROR_METHOD });
  }
  const result = await run({ databaseUrl: databaseUrl(), request });
  return jsonResponse(result.status, result.body);
};

export const handlePublicJson = async (
  request: Request,
  methods: readonly string[],
  run: AuthRunner,
): Promise<Response> => {
  const options = allowOptions(request);
  if (options) {
    return options;
  }
  const allowed = methods.includes(request.method);
  if (!allowed) {
    return jsonResponse(HTTP_STATUS_METHOD_NOT_ALLOWED, { error: ERROR_METHOD });
  }
  const result = await run({ databaseUrl: databaseUrl(), request });
  return jsonResponse(result.status, result.body);
};

export const handleGetHealth = (request: Request, result: CmsAuthResult): Response => {
  const options = allowOptions(request);
  if (options) {
    return options;
  }
  if (request.method !== METHOD_GET) {
    return jsonResponse(HTTP_STATUS_METHOD_NOT_ALLOWED, { error: ERROR_METHOD });
  }
  return jsonResponse(result.status, result.body);
};
