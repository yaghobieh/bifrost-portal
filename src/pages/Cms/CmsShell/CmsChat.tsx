import { useEffect, useRef, useState, type FC, type FormEvent, type KeyboardEvent } from 'react';
import {
  Badge,
  BearIcons,
  Button,
  Card,
  Flex,
  Typography,
} from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useI18n } from '@i18n/index';
import {
  CMS_ICON_SIZE,
  NUMBER_FOURTEEN,
  NUMBER_SIXTEEN,
  NUMBER_TEN,
  NUMBER_TWELVE,
  NUMBER_TWO,
  NUMBER_ZERO,
} from '@const/numbers.const';
import { cmsEditPath } from '@const/index';
import { useAlloyAgent } from '@hooks/useAlloyAgent';
import {
  CMS_CHAT_EMPTY,
  CMS_CHAT_INPUT_ID,
} from './CmsChat.const';
import type { CmsChatAction, CmsChatProps } from './CmsChat.types';

const CMS_PROMPT_SUGGESTIONS = [
  'Draft a landing page about product launch',
  'Write a blog article about headless CMS trends',
  'Create documentation page for API integration',
  'Generate pricing page template with FAQ',
] as const;

export const CmsChat: FC<CmsChatProps> = (props) => {
  const { isOpen, onClose, token, side: _side, crewAvailable, onOpenCrew, initialPrompt } = props;
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const [draft, setDraft] = useState(CMS_CHAT_EMPTY);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    pending,
    totalTokensUsed,
    sendMessage,
    applyAction,
    clearHistory,
  } = useAlloyAgent({
    token,
    onActionSuccess: (createdId) => {
      navigate(cmsEditPath(createdId));
      onClose();
    },
  });

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setDraft(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, pending, isOpen, isMinimized]);

  if (!isOpen) {
    return null;
  }

  const onSubmit = async (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    const prompt = draft.trim();
    if (!prompt || pending) return;
    setDraft(CMS_CHAT_EMPTY);
    await sendMessage(prompt);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void onSubmit();
    }
  };

  const onPromptClick = (text: string) => {
    if (pending) return;
    setDraft(text);
  };

  const handleApplyAction = async (msgId: string, action: CmsChatAction) => {
    setApplyingId(msgId);
    try {
      await applyAction(msgId, action);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-label={t.cmsShell.alloyAgentCopilotTitle}
      className={`fixed z-50 transition-all duration-200 ${
        isMinimized
          ? 'bottom-4 right-4 w-72 h-14'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[480px] h-[640px] max-h-[88vh]'
      } bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-blue-900/20 dark:border-blue-800/40 flex flex-col overflow-hidden`}
    >
      {/* Top Glassmorphic Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-950 via-[#1e3a8a] to-blue-900 text-white flex items-center justify-between shadow-xs select-none">
        <Flex align="center" gap={2}>
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-cyan-300">
            <BearIcons.SparklesIcon size={NUMBER_SIXTEEN} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide">
                {t.cmsShell.alloyAgentCopilotTitle}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-300/30 font-mono">
                Flash
              </span>
            </div>
            <Typography variant="caption" className="text-[10px] text-blue-200/80 mb-0">
              {t.cmsShell.alloyAgentWithYou}
            </Typography>
          </div>
        </Flex>

        <Flex align="center" gap={1}>
          {totalTokensUsed > NUMBER_ZERO && !isMinimized && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-200 border border-white/10 font-mono mr-1">
              ⚡ {totalTokensUsed} tokens
            </span>
          )}
          {!isMinimized && messages.length > NUMBER_ZERO && (
            <button
              type="button"
              onClick={clearHistory}
              title="Clear Conversation"
              className="p-1 rounded text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <BearIcons.DeleteIcon size={NUMBER_FOURTEEN} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand' : 'Minimize'}
            className="p-1 rounded text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="p-1 rounded text-blue-200 hover:text-white hover:bg-white/10 transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </Flex>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Starter Chips */}
          <div className="px-3 py-2 bg-blue-50/60 dark:bg-gray-800/60 border-b border-blue-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-[#1e3a8a] dark:text-cyan-400 shrink-0">
              Prompts:
            </span>
            {CMS_PROMPT_SUGGESTIONS.map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => onPromptClick(text)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-blue-200 dark:border-gray-700 hover:border-[#1e3a8a] hover:bg-blue-50 dark:hover:bg-gray-750 transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Chat Message Scroll Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-gray-50/40 to-white dark:from-gray-900 dark:to-gray-900/90 text-xs">
            {messages.length === NUMBER_ZERO ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 to-[#1e3a8a] text-cyan-300 flex items-center justify-center shadow-md">
                  <BearIcons.SparklesIcon size={24} />
                </div>
                <div>
                  <Typography variant="body1" className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    {t.cmsShell.alloyAgentWithYou}
                  </Typography>
                  <Typography variant="body2" className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                    {t.cmsShell.chatHint}
                  </Typography>
                </div>

                <div className="w-full space-y-2 pt-2">
                  <div
                    onClick={() => onPromptClick(CMS_PROMPT_SUGGESTIONS[0])}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-[#1e3a8a] hover:bg-blue-50/50 dark:hover:bg-gray-750 transition-all cursor-pointer text-left shadow-2xs"
                  >
                    <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <span>📄</span> Create Landing Page
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      Generate full page draft with hero, sections & call to action
                    </div>
                  </div>

                  <div
                    onClick={() => onPromptClick(CMS_PROMPT_SUGGESTIONS[1])}
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-[#1e3a8a] hover:bg-blue-50/50 dark:hover:bg-gray-750 transition-all cursor-pointer text-left shadow-2xs"
                  >
                    <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <span>✍️</span> Draft Blog Article
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      Write formatted article with excerpt, slug, and markdown content
                    </div>
                  </div>
                </div>

                {crewAvailable && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    icon={<BearIcons.UsersIcon size={CMS_ICON_SIZE} />}
                    onClick={() => {
                      onClose();
                      onOpenCrew();
                    }}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {t.cmsShell.chatOpenCrew}
                  </Button>
                )}
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">
                        {isUser ? t.cmsShell.chatYou : t.cmsShell.chatAssistant}
                      </span>
                      {message.usage?.totalTokens ? (
                        <span className="text-[10px] text-gray-400 font-mono">
                          ({message.usage.totalTokens} tokens)
                        </span>
                      ) : null}
                    </div>

                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[#1e3a8a] text-white rounded-tr-xs shadow-xs'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {message.text}

                      {/* Action proposal card */}
                      {message.action && (
                        <div className="mt-3 p-3 bg-blue-50/70 dark:bg-gray-900/90 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-xs text-left">
                          <Flex justify="between" align="center" className="mb-2">
                            <Badge variant="info" className="bg-[#1e3a8a] text-white text-[10px] font-semibold">
                              {message.action.action === 'create_article'
                                ? t.cmsShell.alloyActionCreateArticle
                                : t.cmsShell.alloyActionCreatePage}
                            </Badge>
                            {message.actionApplied && (
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <BearIcons.CheckIcon size={NUMBER_TWELVE} />
                                {t.cmsShell.alloyActionApplied}
                              </span>
                            )}
                          </Flex>

                          <div className="text-[11px] text-gray-700 dark:text-gray-300 space-y-0.5 mb-3 bg-white/70 dark:bg-gray-800/70 p-2 rounded-lg border border-blue-100 dark:border-gray-700 font-mono">
                            <div><span className="font-bold text-gray-900 dark:text-white">Title:</span> {String(message.action.data.title || '')}</div>
                            <div><span className="font-bold text-gray-900 dark:text-white">Slug:</span> {String(message.action.data.slug || '')}</div>
                          </div>

                          {!message.actionApplied && (
                            <Button
                              size="sm"
                              variant="primary"
                              disabled={applyingId === message.id}
                              onClick={() => void handleApplyAction(message.id, message.action!)}
                              className="bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs w-full justify-center font-semibold shadow-xs"
                            >
                              {applyingId === message.id
                                ? t.cmsShell.alloyActionApplying
                                : `${t.cmsShell.alloyActionExecute} →`}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {pending && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 p-2">
                <span className="w-2 h-2 rounded-full bg-[#1e3a8a] animate-ping" />
                <span className="text-xs font-medium">{t.cmsShell.chatPending}</span>
              </div>
            )}
            <div ref={logEndRef} />
          </div>

          {/* Bottom Chat Prompt Form */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <form onSubmit={(event) => void onSubmit(event)} className="space-y-2">
              <div className="relative rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-[#1e3a8a] focus-within:border-transparent transition-all overflow-hidden shadow-2xs">
                <textarea
                  id={CMS_CHAT_INPUT_ID}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.cmsShell.chatPlaceholder}
                  disabled={pending}
                  rows={2}
                  className="w-full px-3 py-2 text-xs text-gray-900 dark:text-white bg-transparent focus:outline-none resize-none leading-relaxed placeholder:text-gray-400"
                />
                <div className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">
                    ↵ send • Shift+↵ new line
                  </span>
                  <Button
                    type="submit"
                    size="xs"
                    variant="primary"
                    icon={<BearIcons.SparklesIcon size={NUMBER_TWELVE} />}
                    disabled={pending || !draft.trim()}
                    className="bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold"
                  >
                    {t.cmsShell.chatSend}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
