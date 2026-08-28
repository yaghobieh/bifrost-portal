import {
  EMPTY_STRING,
  HTTP_STATUS_OK,
  INK_PACKAGE_VERSION,
  NUMBER_ZERO,
  PACKAGE_VERSION,
  PRODUCT_BIFROST,
  SERVICE_NAME,
  SPRINT_VERSION,
} from './cmsAuth.const';
import type { CmsAuthResult } from './cmsAuth.types';

export const versionPayload = (): CmsAuthResult => ({
  status: HTTP_STATUS_OK,
  body: {
    product: PRODUCT_BIFROST,
    version: PACKAGE_VERSION,
    sprint: SPRINT_VERSION,
    ink: INK_PACKAGE_VERSION,
    portal: PACKAGE_VERSION,
    node: EMPTY_STRING,
    platform: EMPTY_STRING,
    arch: EMPTY_STRING,
    env: SERVICE_NAME,
    uptimeSec: NUMBER_ZERO,
    docker: {
      running: false,
      hostname: EMPTY_STRING,
      image: EMPTY_STRING,
      containerName: EMPTY_STRING,
    },
    build: {
      sha: EMPTY_STRING,
      time: EMPTY_STRING,
      number: EMPTY_STRING,
    },
    packages: {
      [SERVICE_NAME]: PACKAGE_VERSION,
    },
    notes: EMPTY_STRING,
  },
});

export const mediaConfigPayload = (): CmsAuthResult => ({
  status: HTTP_STATUS_OK,
  body: {
    cloudName: EMPTY_STRING,
    hasKey: false,
    hasSecret: false,
    configured: false,
  },
});

export const pluginCatalogPayload = (): CmsAuthResult => ({
  status: HTTP_STATUS_OK,
  body: {
    items: [],
  },
});
