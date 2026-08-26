import {
  CMS_CHAT_SIDE_LEFT,
  CMS_CHAT_SIDE_RIGHT,
  CMS_CHAT_PREFS_EVENT,
  CMS_NOTIFY_PREFS_EVENT,
  CMS_PERMALINK_ID,
  CMS_PERMALINK_TITLE,
  CMS_PROFILE_STORAGE_KEY,
  CMS_THEME_STORAGE_KEY,
  CMS_SITE_STORAGE_KEY,
  CMS_MCP_STORAGE_KEY,
  CMS_PROFILE_EVENT,
  CMS_SITE_EVENT,
  CMS_CATALOG_STORAGE_KEY,
  CMS_DEV_PREFS_EVENT,
  EMPTY_STRING,
  PINK_HEX,
  PINK_SOFT_HEX,
} from '@const/index';
import { CMS_NAV_IDS } from '../CmsShell/CmsShell.const';
import type { SettingsTabId } from './SettingsPages.types';

export const SETTINGS_THEME_STORAGE_KEY = CMS_THEME_STORAGE_KEY;
export const SETTINGS_PROFILE_STORAGE_KEY = CMS_PROFILE_STORAGE_KEY;
export const SETTINGS_SITE_STORAGE_KEY = CMS_SITE_STORAGE_KEY;
export const SETTINGS_MCP_STORAGE_KEY = CMS_MCP_STORAGE_KEY;
export const SETTINGS_PROFILE_EMPTY = EMPTY_STRING;
export const SETTINGS_PROFILE_EVENT = CMS_PROFILE_EVENT;
export const SETTINGS_SITE_EVENT = CMS_SITE_EVENT;
export const SETTINGS_CHAT_PREFS_EVENT = CMS_CHAT_PREFS_EVENT;
export const SETTINGS_NOTIFY_PREFS_EVENT = CMS_NOTIFY_PREFS_EVENT;

export const SETTINGS_TABS = {
  PROFILE: 'profile',
  CREW: 'crew',
  SITE: 'site',
  DEVELOPER: 'developer',
  THEME: 'theme',
  MEDIA: 'media',
  MCP: 'mcp',
  API: 'api',
  CATALOG: 'catalog',
  UPDATE: 'update',
} as const satisfies Record<string, SettingsTabId>;

export const SETTINGS_SITE_PANELS = {
  GENERAL: 'general',
  WRITING: 'writing',
  DISCUSSION: 'discussion',
  CHROME: 'chrome',
  READING: 'reading',
  MEDIA: 'media',
} as const;

export const SETTINGS_SAVE_SOURCE = 'settings' as const;

export const SETTINGS_THEME_DEFAULTS_LIGHT = {
  primary: PINK_HEX,
  accent: PINK_HEX,
  background: '#f5f6f8',
} as const;

export const SETTINGS_THEME_DEFAULTS_DARK = {
  primary: PINK_HEX,
  accent: PINK_HEX,
  background: '#12192c',
} as const;

export const SETTINGS_THEME_DEFAULTS = SETTINGS_THEME_DEFAULTS_LIGHT;

export const SETTINGS_HEX_SHORT_LENGTH = 3;
export const SETTINGS_HEX_FULL_LENGTH = 6;
export const SETTINGS_HEX_RADIX = 16;
export const SETTINGS_RGB_MAX = 255;
export const SETTINGS_LUMINANCE_RED = 0.2126;
export const SETTINGS_LUMINANCE_GREEN = 0.7152;
export const SETTINGS_LUMINANCE_BLUE = 0.0722;
export const SETTINGS_DARK_LUMINANCE_MAX = 0.45;
export const SETTINGS_HEX_SLICE_RED_END = 2;
export const SETTINGS_HEX_SLICE_GREEN_END = 4;
export const SETTINGS_HEX_SLICE_BLUE_END = 6;

export const SETTINGS_SITE_DEFAULTS = {
  siteName: 'Bifrost',
  tagline: EMPTY_STRING,
  seoTitle: 'Bifrost',
  seoDescription: EMPTY_STRING,
  logoDataUrl: EMPTY_STRING,
  permalinkStyle: CMS_PERMALINK_TITLE,
  locale: 'en',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  fromEmail: EMPTY_STRING,
  chatSide: CMS_CHAT_SIDE_RIGHT,
  hiddenNavIds: [] as string[],
  anyoneCanRegister: false,
  searchEngineVisible: true,
  allowComments: false,
  showTopNav: true,
  showBottomNav: false,
  showAgent: true,
  apiErrorMode: 'snackbar',
  postsPerPage: '10',
  homepagePath: '/',
  loadingMessage: EMPTY_STRING,
  loadingSize: 'md',
} as const;

export const SETTINGS_PERMALINK_VALUES = {
  ID: CMS_PERMALINK_ID,
  TITLE: CMS_PERMALINK_TITLE,
} as const;

export const SETTINGS_CHAT_SIDES = {
  LEFT: CMS_CHAT_SIDE_LEFT,
  RIGHT: CMS_CHAT_SIDE_RIGHT,
} as const;

export const SETTINGS_NAV_TOGGLE_IDS = [
  CMS_NAV_IDS.DASHBOARD,
  CMS_NAV_IDS.PAGES,
  CMS_NAV_IDS.AI_USAGE,
  CMS_NAV_IDS.BUNDLES,
  CMS_NAV_IDS.TEMPLATES,
  CMS_NAV_IDS.MEDIA,
  CMS_NAV_IDS.CREW,
  CMS_NAV_IDS.LIVE_EDIT,
  CMS_NAV_IDS.BUILDER,
  CMS_NAV_IDS.CALENDAR,
] as const;

export const SETTINGS_MCP_DEFAULTS = {
  enabled: true,
} as const;

export const SETTINGS_LOCALE_VALUES = {
  EN: 'en',
  ES: 'es',
  HE: 'he',
  FR: 'fr',
  DE: 'de',
} as const;

export const SETTINGS_NOTIFY_DEFAULTS = {
  inApp: true,
  email: false,
  showPreview: true,
} as const;

export const SETTINGS_USER_PREFS_KEY = 'bifrost-cms-user-prefs';

export const SETTINGS_CHAT_SOUND = {
  OFF: 'off',
  PRIVATE: 'private',
  ROOM: 'room',
  ALL: 'all',
} as const;

export const SETTINGS_CHAT_SHOW = {
  DRAWER: 'drawer',
  SNACKBAR: 'snackbar',
  BOTH: 'both',
} as const;

export const SETTINGS_CHAT_PREFS_DEFAULTS = {
  sound: SETTINGS_CHAT_SOUND.ALL,
  color: PINK_HEX,
  show: SETTINGS_CHAT_SHOW.BOTH,
  roomSounds: {},
} as const;

export const SETTINGS_CHAT_COLOR_ID = 'bifrost-cms-chat-color';

export const SETTINGS_MCP_API_FALLBACK = '';

export const SETTINGS_MCP_TOOL_SUFFIXES = [
  'install_status',
  'install',
  'api_health',
  'cms_list_pages',
  'cms_get_page',
  'cms_create_page',
  'cms_create_template',
  'cms_create_document',
  'cms_create_form',
  'cms_delete_page',
  'cms_list_tables',
] as const;

export const SETTINGS_SITE_SLUG_FALLBACK = 'bifrost';

export const SETTINGS_MCP_JSON_INDENT = 2;

export const SETTINGS_ACCENT_SOFT_LIGHT = PINK_SOFT_HEX;
export const SETTINGS_ACCENT_SOFT_DARK = 'rgba(234, 10, 142, 0.22)';

export const SETTINGS_COLOR_INPUT_IDS = {
  PRIMARY: 'bifrost-cms-theme-primary',
  ACCENT: 'bifrost-cms-theme-accent',
  BACKGROUND: 'bifrost-cms-theme-background',
} as const;

export const SETTINGS_PROFILE_INPUT_IDS = {
  USERNAME: 'bifrost-cms-profile-username',
  DISPLAY_NAME: 'bifrost-cms-profile-name',
  PASSWORD: 'bifrost-cms-profile-password',
  AVATAR: 'bifrost-cms-profile-avatar',
} as const;

export const SETTINGS_SITE_INPUT_IDS = {
  SITE_NAME: 'bifrost-cms-site-name',
  TAGLINE: 'bifrost-cms-site-tagline',
  SEO_TITLE: 'bifrost-cms-site-seo-title',
  SEO_DESCRIPTION: 'bifrost-cms-site-seo-description',
  LOGO: 'bifrost-cms-site-logo',
  PERMALINK: 'bifrost-cms-site-permalink',
  LOCALE: 'bifrost-cms-site-locale',
  TIMEZONE: 'bifrost-cms-site-timezone',
  DATE_FORMAT: 'bifrost-cms-site-date-format',
  FROM_EMAIL: 'bifrost-cms-site-from-email',
  CHAT_SIDE: 'bifrost-cms-site-chat-side',
  REGISTER: 'bifrost-cms-site-register',
  SEARCH_ENGINES: 'bifrost-cms-site-search-engines',
  COMMENTS: 'bifrost-cms-site-comments',
  TOP_NAV: 'bifrost-cms-site-top-nav',
  BOTTOM_NAV: 'bifrost-cms-site-bottom-nav',
  AGENT: 'bifrost-cms-site-agent',
  API_ERROR: 'bifrost-cms-site-api-error',
  POSTS_PER_PAGE: 'bifrost-cms-site-posts-per-page',
  HOMEPAGE: 'bifrost-cms-site-homepage',
  LOADING_MESSAGE: 'bifrost-cms-site-loading-message',
  LOADING_SIZE: 'bifrost-cms-site-loading-size',
} as const;

export const SETTINGS_MEDIA_INPUT_IDS = {
  CLOUD_NAME: 'bifrost-cms-media-cloud-name',
} as const;

export const SETTINGS_API_ERROR_MODES = {
  PAGE: 'page',
  MODAL: 'modal',
  SNACKBAR: 'snackbar',
} as const;

export const SETTINGS_API_FAIL_URL = 'https://cms.invalid.test/api/fail';

export const SETTINGS_TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid' },
  { value: 'Asia/Jerusalem', label: 'Asia/Jerusalem' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
] as const;

export const SETTINGS_DATE_FORMAT_OPTIONS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
] as const;

export const SETTINGS_MCP_INPUT_IDS = {
  ENABLED: 'bifrost-cms-mcp-enabled',
} as const;

export const SETTINGS_CSS_VARS = {
  PRIMARY: '--bifrost-cms-accent',
  ACCENT: '--bifrost-cms-bar-1',
  BACKGROUND: '--bifrost-cms-bg',
  ACCENT_SOFT: '--bifrost-cms-accent-soft',
  SIDEBAR: '--bifrost-cms-sidebar',
} as const;

export const SETTINGS_SIDEBAR = '#14161c';

export const SETTINGS_LOGO_MAX_FILES = 1;
export const SETTINGS_AVATAR_ACCEPT = 'image/*';
export const SETTINGS_PASSWORD_TYPE = 'password';
export const SETTINGS_FILE_TYPE = 'file';
export const SETTINGS_COLOR_TYPE = 'color';
export const SETTINGS_ROLE_ADMIN = 'admin';
export const SETTINGS_DEV_INPUT_ID = 'bifrost-cms-dev-show-page';
export const SETTINGS_DEV_PREFS_EVENT = CMS_DEV_PREFS_EVENT;
export const SETTINGS_DEV_PREFS_DEFAULTS = {
  showDeveloperPage: true,
} as const;
export const SETTINGS_STALE_SITE_NAMES = ['Ink CMS', 'ink CMS', 'testing 2', 'testing-2'];
export const SETTINGS_CATALOG_STORAGE_KEY = CMS_CATALOG_STORAGE_KEY;
export const SETTINGS_CATALOG_FORMAT = {
  JSON: 'json',
  JS: 'js',
} as const;
export const SETTINGS_CATALOG_DEFAULT_JSON = '{\n  "collections": []\n}\n';
export const SETTINGS_CATALOG_DEFAULT_JS = 'export const catalog = {\n  collections: [],\n};\n';
export const SETTINGS_CATALOG_TEXTAREA_ROWS = 12;
export const SETTINGS_CATALOG_INPUT_IDS = {
  FORMAT: 'bifrost-cms-catalog-format',
  SOURCE: 'bifrost-cms-catalog-source',
} as const;
