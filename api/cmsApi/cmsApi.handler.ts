import {
  ERROR_DATABASE,
  ERROR_INTERNAL,
  ERROR_NOT_FOUND,
  HEALTH_OK,
  HTTP_STATUS_INTERNAL,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAVAILABLE,
  METHOD_GET,
  METHOD_OPTIONS,
  METHOD_POST,
  PATH_API_PREFIX,
  PATH_CONTENT,
  PATH_DASHBOARD,
  PATH_DASHBOARD_ALIAS,
  PATH_GITHUB,
  PATH_GOOGLE,
  PATH_HEALTH,
  PATH_LOGIN,
  PATH_ME,
  PATH_ME_ALIAS,
  PATH_NOTIFICATIONS,
  PATH_PAGES,
  PATH_REGISTER,
  PATH_VERSION,
  PATH_VERSION_V1,
  PACKAGE_VERSION,
  SERVICE_NAME,
  SPRINT_VERSION,
} from './cmsApi.const';
import type { CmsApiRequest, CmsApiResponse, CmsRouteHandler } from './cmsApi.types';
import {
  handleDashboard,
  handleEmptyItems,
  handleEmptyNotifications,
  handleEmptyPages,
  handleLogin,
  handleMe,
  handleOauthStart,
  handleRegister,
} from './cmsApi.auth';
import {
  applyCors,
  getSql,
  requestMethod,
  requestPath,
  sendError,
  sendNoContent,
  sendOk,
} from './cmsApi.utils';

const ROUTES: Record<string, CmsRouteHandler> = {
  [`${METHOD_POST} ${PATH_LOGIN}`]: handleLogin,
  [`${METHOD_POST} ${PATH_REGISTER}`]: handleRegister,
  [`${METHOD_GET} ${PATH_ME}`]: handleMe,
  [`${METHOD_GET} ${PATH_ME_ALIAS}`]: handleMe,
  [`${METHOD_GET} ${PATH_GOOGLE}`]: handleOauthStart,
  [`${METHOD_GET} ${PATH_GITHUB}`]: handleOauthStart,
  [`${METHOD_GET} ${PATH_DASHBOARD}`]: handleDashboard,
  [`${METHOD_GET} ${PATH_DASHBOARD_ALIAS}`]: handleDashboard,
  [`${METHOD_GET} ${PATH_PAGES}`]: handleEmptyPages,
  [`${METHOD_GET} ${PATH_NOTIFICATIONS}`]: handleEmptyNotifications,
};

const handleHealth = async (_req: CmsApiRequest, res: CmsApiResponse): Promise<void> => {
  const sql = getSql();
  sendOk(res, {
    status: HEALTH_OK,
    service: SERVICE_NAME,
    db: Boolean(sql),
  });
};

const handleVersion = async (_req: CmsApiRequest, res: CmsApiResponse): Promise<void> => {
  sendOk(res, { version: PACKAGE_VERSION, sprint: SPRINT_VERSION });
};

ROUTES[`${METHOD_GET} ${PATH_HEALTH}`] = handleHealth;
ROUTES[`${METHOD_GET} ${PATH_VERSION}`] = handleVersion;
ROUTES[`${METHOD_GET} ${PATH_VERSION_V1}`] = handleVersion;

export const handleCmsApi = async (
  req: CmsApiRequest,
  res: CmsApiResponse,
): Promise<void> => {
  applyCors(req, res);
  const method = requestMethod(req);
  if (method === METHOD_OPTIONS) {
    sendNoContent(res);
    return;
  }
  const path = requestPath(req);
  const exact = ROUTES[`${method} ${path}`];
  if (exact) {
    try {
      await exact(req, res);
    } catch {
      if (!res.headersSent) {
        sendError(res, HTTP_STATUS_INTERNAL, ERROR_INTERNAL);
      }
    }
    return;
  }
  if (method === METHOD_GET && path.startsWith(PATH_CONTENT)) {
    try {
      await handleEmptyItems(req, res);
    } catch {
      if (!res.headersSent) {
        sendError(res, HTTP_STATUS_INTERNAL, ERROR_INTERNAL);
      }
    }
    return;
  }
  if (!getSql() && path.startsWith(PATH_API_PREFIX)) {
    sendError(res, HTTP_STATUS_UNAVAILABLE, ERROR_DATABASE);
    return;
  }
  if (path.startsWith(PATH_API_PREFIX)) {
    sendError(res, HTTP_STATUS_NOT_FOUND, ERROR_NOT_FOUND);
    return;
  }
  sendError(res, HTTP_STATUS_INTERNAL, ERROR_INTERNAL);
};
