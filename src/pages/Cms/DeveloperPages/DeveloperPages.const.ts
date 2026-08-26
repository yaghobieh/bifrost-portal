import { EMPTY_STRING } from '@const/strings.const';
import type { DeveloperRowId } from './DeveloperPages.types';

export const DEVELOPER_SECONDS_PER_MINUTE = 60;
export const DEVELOPER_SECONDS_PER_HOUR = 3600;
export const DEVELOPER_LAYOUT_COLS = 2 as const;
export const DEVELOPER_LAYOUT_GAP = 4 as const;

export const DEVELOPER_RUNTIME_ROW_IDS: readonly DeveloperRowId[] = [
  'node',
  'platform',
  'env',
  'uptime',
] as const;

export const DEVELOPER_BUILD_ROW_IDS: readonly DeveloperRowId[] = [
  'product',
  'version',
  'portal',
  'docker',
  'build',
] as const;

export const DEVELOPER_ROW_IDS: readonly DeveloperRowId[] = [
  ...DEVELOPER_RUNTIME_ROW_IDS,
  ...DEVELOPER_BUILD_ROW_IDS,
];

export const DEVELOPER_EMPTY = EMPTY_STRING;
export const DEVELOPER_SPACE = ' ';
export const DEVELOPER_DOCKER_SEP = ' · ';
export const DEVELOPER_BUILD_SEP = ' · ';
