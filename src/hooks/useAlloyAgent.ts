import { useCallback, useEffect, useState } from 'react';
import { NUMBER_ZERO } from '@const/numbers.const';
import {
  completeCmsChat,
  executeCmsAction,
  loadChatHistory,
  saveChatHistory,
} from '../pages/Cms/CmsShell/CmsChat.utils';
import type {
  CmsChatAction,
  CmsChatMessage,
  CmsChatUsage,
} from '../pages/Cms/CmsShell/CmsChat.types';

export type UseAlloyAgentOptions = {
  token?: string;
  onError?: (error: string) => void;
  onActionSuccess?: (id: string, action: CmsChatAction) => void;
};

export type UseAlloyAgentResult = {
  messages: CmsChatMessage[];
  pending: boolean;
  totalTokensUsed: number;
  lastUsage: CmsChatUsage | null;
  sendMessage: (prompt: string) => Promise<void>;
  applyAction: (messageId: string, action: CmsChatAction) => Promise<string | null>;
  clearHistory: () => void;
};

/**
 * Custom hook to interact with the alloy alloy-1.5 flash CMS Agent.
 * Handles conversational history, token usage metrics, and executable CMS actions.
 *
 * @param options Configuration options including auth token and callbacks
 * @returns Agent state, message dispatch, and action execution handlers
 */
export const useAlloyAgent = (options: UseAlloyAgentOptions = {}): UseAlloyAgentResult => {
  const { token, onError, onActionSuccess } = options;
  const [messages, setMessages] = useState<CmsChatMessage[]>(() => loadChatHistory());
  const [pending, setPending] = useState(false);
  const [lastUsage, setLastUsage] = useState<CmsChatUsage | null>(null);
  const [totalTokensUsed, setTotalTokensUsed] = useState<number>(() => {
    const history = loadChatHistory();
    return history.reduce((sum, msg) => sum + (msg.usage?.totalTokens ?? NUMBER_ZERO), NUMBER_ZERO);
  });

  const persistMessages = useCallback((next: CmsChatMessage[]) => {
    setMessages(next);
    saveChatHistory(next);
  }, []);

  const sendMessage = useCallback(
    async (prompt: string) => {
      const cleanPrompt = prompt.trim();
      if (!cleanPrompt || pending || !token) {
        return;
      }

      const userMessage: CmsChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: cleanPrompt,
      };

      const updatedHistory = [...messages, userMessage];
      persistMessages(updatedHistory);
      setPending(true);

      try {
        const result = await completeCmsChat(token, cleanPrompt, messages);
        const assistantMessage: CmsChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: result.ok ? result.text : 'Assistant could not complete the request.',
          action: result.action ?? null,
          usage: result.usage ?? null,
        };

        if (result.usage?.totalTokens) {
          setLastUsage(result.usage);
          setTotalTokensUsed((prev) => prev + (result.usage?.totalTokens ?? NUMBER_ZERO));
        }

        persistMessages([...updatedHistory, assistantMessage]);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        if (onError) onError(errorMsg);
      } finally {
        setPending(false);
      }
    },
    [messages, pending, token, persistMessages, onError],
  );

  const applyAction = useCallback(
    async (messageId: string, action: CmsChatAction): Promise<string | null> => {
      if (!token) return null;

      try {
        const res = await executeCmsAction(token, action);
        if (res.ok && res.id) {
          // Mark the message action as applied
          const updated = messages.map((m) =>
            m.id === messageId ? { ...m, actionApplied: true } : m,
          );
          persistMessages(updated);
          if (onActionSuccess) {
            onActionSuccess(res.id, action);
          }
          return res.id;
        }
        if (res.error && onError) {
          onError(res.error);
        }
        return null;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to apply action';
        if (onError) onError(msg);
        return null;
      }
    },
    [messages, token, persistMessages, onActionSuccess, onError],
  );

  const clearHistory = useCallback(() => {
    persistMessages([]);
    setLastUsage(null);
    setTotalTokensUsed(NUMBER_ZERO);
  }, [persistMessages]);

  return {
    messages,
    pending,
    totalTokensUsed,
    lastUsage,
    sendMessage,
    applyAction,
    clearHistory,
  };
};
