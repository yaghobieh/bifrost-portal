import type { ApiErrorCode } from '@sdk/http';

export const CMS_MEETINGS_PATH = '/api/cms/meetings';

export const MEETING_ERROR: { code: ApiErrorCode; message: string } = {
  code: 'notifications',
  message: 'Could not load meetings.',
};
