import { INK_API_URL } from '@const/billing.const';
import {
  AI_CAPABILITY_MARKETING,
  AI_COMPLETE_PATH,
  CONTENT_TYPE_JSON,
  EMPTY_STRING,
  HEADER_CONTENT_TYPE,
  SCRIPT_SRC_HTTPS,
} from '@const/strings.const';
import { HTTP_METHOD_POST } from '@const/http.const';
import { authHeaders } from '@sdk/modules/auth/auth.api';
import { parseMarketingAiPage } from './BuilderPages.utils';
import type { CanvasNode, PageCode } from './BuilderPages.types';

export type MarketingAiResult = {
  nodes: CanvasNode[];
  code: PageCode;
} | null;

export const isHttpsScriptSrc = (value: string): boolean => value.trim().startsWith(SCRIPT_SRC_HTTPS);

export const completeMarketingPage = async (
  token: string,
  prompt: string,
): Promise<MarketingAiResult> => {
  if (!token || !prompt.trim()) {
    return null;
  }
  const response = await fetch(`${INK_API_URL}${AI_COMPLETE_PATH}`, {
    method: HTTP_METHOD_POST,
    headers: {
      ...authHeaders(token),
      [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
    },
    body: JSON.stringify({
      prompt,
      capability: AI_CAPABILITY_MARKETING,
    }),
  });
  if (!response.ok) {
    return null;
  }
  const data = (await response.json().catch(() => ({}))) as { text?: string };
  const text = typeof data.text === 'string' ? data.text : EMPTY_STRING;
  return parseMarketingAiPage(text);
};
