import { INK_API_URL } from '@const/billing.const';
import { HTTP_METHOD_POST, HTTP_METHOD_PUT } from '@const/http.const';
import { CONTENT_TYPE_JSON, HEADER_CONTENT_TYPE } from '@const/strings.const';
import { useApi } from '@sdk/http';
import { authHeaders } from '../auth/auth.api';
import { CMS_MEETINGS_PATH, MEETING_ERROR } from './meetings.const';
import type {
  CmsMeeting,
  CmsMeetingInput,
  CmsMeetingListResponse,
  CmsMeetingResponse,
} from './meetings.types';

export const fetchMeetings = async (token: string): Promise<CmsMeeting[] | null> => {
  if (!token) {
    return null;
  }
  const response = await useApi(
    `${INK_API_URL}${CMS_MEETINGS_PATH}`,
    { headers: authHeaders(token) },
    MEETING_ERROR,
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as CmsMeetingListResponse;
  return data.meetings ?? [];
};

export const createMeetingRequest = async (
  token: string,
  input: CmsMeetingInput,
): Promise<CmsMeeting | null> => {
  if (!token) {
    return null;
  }
  const response = await useApi(
    `${INK_API_URL}${CMS_MEETINGS_PATH}`,
    {
      method: HTTP_METHOD_POST,
      headers: { ...authHeaders(token), [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON },
      body: JSON.stringify(input),
    },
    MEETING_ERROR,
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as CmsMeetingResponse;
  return data.meeting ?? null;
};

export const updateMeetingRequest = async (
  token: string,
  id: string,
  input: CmsMeetingInput,
): Promise<CmsMeeting | null> => {
  if (!token) {
    return null;
  }
  const response = await useApi(
    `${INK_API_URL}${CMS_MEETINGS_PATH}/${encodeURIComponent(id)}`,
    {
      method: HTTP_METHOD_PUT,
      headers: { ...authHeaders(token), [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON },
      body: JSON.stringify(input),
    },
    MEETING_ERROR,
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as CmsMeetingResponse;
  return data.meeting ?? null;
};
