/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CMS_DOMAIN?: string;
  readonly VITE_CMS_API_URL?: string;
  readonly VITE_CMS_ADMIN_ORIGIN?: string;
  readonly VITE_INK_API_URL?: string;
  readonly VITE_BIFROST_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
