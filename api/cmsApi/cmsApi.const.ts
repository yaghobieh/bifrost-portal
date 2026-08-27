export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_NO_CONTENT = 204;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_CONFLICT = 409;
export const HTTP_STATUS_INTERNAL = 500;
export const HTTP_STATUS_UNAVAILABLE = 503;

export const JWT_EXPIRES_IN_SEC = 604800;
export const WEEK_DAY_COUNT = 7;
export const HASH_ALG = 'sha256';
export const HMAC_ALG = 'sha256';
export const JWT_ALG = 'HS256';
export const JWT_TYP = 'JWT';
export const JWT_HEADER_ALG_KEY = 'alg';
export const JWT_HEADER_TYP_KEY = 'typ';

export const ENV_DATABASE_URL = 'DATABASE_URL';
export const ENV_JWT_SECRET = 'JWT_SECRET';
export const JWT_SECRET_CHANGE_ME = 'change-me';
export const JWT_SECRET_DEV_FALLBACK = 'dev-only-change-me';

export const BEARER_PREFIX = 'Bearer ';
export const HEADER_AUTHORIZATION = 'authorization';
export const HEADER_CONTENT_TYPE = 'content-type';
export const HEADER_ORIGIN = 'origin';
export const CONTENT_TYPE_JSON = 'application/json';
export const COLON = ':';
export const DOT = '.';
export const EMPTY_STRING = '';
export const PLAN_FREE = 'free';
export const ROLE_USER = 'user';
export const PROVIDER_PASSWORD = 'password';
export const PACKAGE_VERSION = '1.0.0';
export const SPRINT_VERSION = '1.1.12';
export const HEALTH_OK = 'ok';
export const SERVICE_NAME = 'bifrost-cms-api';

export const METHOD_GET = 'GET';
export const METHOD_POST = 'POST';
export const METHOD_OPTIONS = 'OPTIONS';

export const PATH_API_PREFIX = '/api/';
export const PATH_LOGIN = '/api/auth/login';
export const PATH_REGISTER = '/api/auth/register';
export const PATH_ME = '/api/auth/get-current-user';
export const PATH_ME_ALIAS = '/api/auth/me';
export const PATH_GOOGLE = '/api/auth/google';
export const PATH_GITHUB = '/api/auth/github';
export const PATH_HEALTH = '/api/health';
export const PATH_VERSION = '/api/version';
export const PATH_VERSION_V1 = '/api/v1/version';
export const PATH_DASHBOARD = '/api/cms/get-live-analytics';
export const PATH_DASHBOARD_ALIAS = '/api/cms/dashboard';
export const PATH_CONTENT = '/api/cms/get-content';
export const PATH_PAGES = '/api/cms/pages';
export const PATH_NOTIFICATIONS = '/api/cms/get-notifications';

export const ERROR_USERNAME_PASSWORD = 'username and password are required';
export const ERROR_INVALID_CREDENTIALS = 'invalid credentials';
export const ERROR_UNAUTHORIZED = 'unauthorized';
export const ERROR_NOT_FOUND = 'not found';
export const ERROR_EMAIL_NAME_PASSWORD = 'email, name, and password are required';
export const ERROR_EMAIL_TAKEN = 'email already registered';
export const ERROR_DATABASE = 'database unavailable';
export const ERROR_INTERNAL = 'internal';

export const CORS_ALLOW_HEADERS = 'authorization, content-type';
export const CORS_ALLOW_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
