import { INK_API_URL } from '@const/billing.const';
import { CMS_CHAT_HISTORY_KEY, CONTENT_TYPE_JSON } from '@const/strings.const';
import { authHeaders } from '@sdk/modules/auth';
import { saveContentRequest } from '@sdk/modules/content';
import {
  AI_CAPABILITY_CHAT,
  AI_COMPLETE_PATH,
  CMS_CHAT_HISTORY_LIMIT,
} from './CmsChat.const';
import type {
  CmsChatAction,
  CmsChatCompleteResult,
  CmsChatMessage,
  CmsChatUsage,
} from './CmsChat.types';

export const loadChatHistory = (): CmsChatMessage[] => {
  try {
    const raw = localStorage.getItem(CMS_CHAT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CmsChatMessage => {
      if (!item || typeof item !== 'object') return false;
      const row = item as CmsChatMessage;
      return typeof row.id === 'string' && typeof row.text === 'string';
    });
  } catch {
    return [];
  }
};

export const saveChatHistory = (messages: CmsChatMessage[]): void => {
  const next = messages.slice(-CMS_CHAT_HISTORY_LIMIT);
  localStorage.setItem(CMS_CHAT_HISTORY_KEY, JSON.stringify(next));
};

export const completeCmsChat = async (
  token: string,
  prompt: string,
  history?: CmsChatMessage[],
): Promise<CmsChatCompleteResult> => {
  if (!token) {
    return { ok: false, text: '', status: 0 };
  }

  const formattedHistory = (history || []).map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.text,
  }));

  try {
    const response = await fetch(`${INK_API_URL}${AI_COMPLETE_PATH}`, {
      method: 'POST',
      headers: {
        ...authHeaders(token),
        'Content-Type': CONTENT_TYPE_JSON,
      },
      body: JSON.stringify({
        prompt,
        capability: AI_CAPABILITY_CHAT,
        history: formattedHistory,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      text?: string;
      action?: CmsChatAction | null;
      usage?: CmsChatUsage | null;
      meta?: { model?: string };
      error?: string;
    };

    if (!response.ok) {
      return {
        ok: false,
        text: typeof data.error === 'string' ? data.error : '',
        status: response.status,
      };
    }

    return {
      ok: true,
      text: typeof data.text === 'string' ? data.text : '',
      action: data.action ?? null,
      usage: data.usage ?? null,
      model: data.meta?.model ?? 'alloy alloy-1.5 flash',
      status: response.status,
    };
  } catch {
    return { ok: false, text: '', status: 500 };
  }
};

export const executeCmsAction = async (
  token: string,
  action: CmsChatAction,
): Promise<{ ok: boolean; id?: string; error?: string }> => {
  if (!token) {
    return { ok: false, error: 'Unauthorized' };
  }

  const { action: actionType, data } = action;
  const title = typeof data.title === 'string' ? data.title : 'New AI Content';
  const slug =
    typeof data.slug === 'string' && data.slug
      ? data.slug
      : `alloy-${Date.now()}`;
  const content = typeof data.content === 'string' ? data.content : '';

  if (actionType === 'create_article') {
    const item = await saveContentRequest(token, {
      collection: 'articles',
      slug,
      locale: 'en',
      title,
      status: 'draft',
      payload: {
        kind: 'article',
        lead: typeof data.excerpt === 'string' ? data.excerpt : '',
        content,
        markdown: content,
        category: typeof data.category === 'string' ? data.category : 'General',
      },
    });
    return item
      ? { ok: true, id: item.id }
      : { ok: false, error: 'Failed to create article' };
  }

  // create_page or update_content
  const template =
    typeof data.template === 'string' ? data.template : 'landing';
  const item = await saveContentRequest(token, {
    collection: 'pages',
    slug,
    locale: 'en',
    title,
    status: 'draft',
    payload: {
      kind: 'doc',
      template,
      content,
      markdown: content,
    },
  });

  return item
    ? { ok: true, id: item.id }
    : { ok: false, error: 'Failed to create page' };
};
