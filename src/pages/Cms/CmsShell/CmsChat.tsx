import { useState, type FC, type FormEvent } from 'react';
import {
  Badge,
  BearIcons,
  Button,
  Card,
  Chip,
  Drawer,
  Flex,
  Input,
  Typography,
} from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useI18n } from '@i18n/index';
import { CMS_ICON_SIZE, NUMBER_FOURTEEN, NUMBER_SIXTEEN, NUMBER_TWO, NUMBER_ZERO } from '@const/numbers.const';
import { cmsEditPath } from '@const/index';
import { useAlloyAgent } from '@hooks/useAlloyAgent';
import {
  CMS_CHAT_EMPTY,
  CMS_CHAT_INPUT_ID,
  HTTP_FORBIDDEN,
  HTTP_NOT_IMPLEMENTED,
} from './CmsChat.const';
import type { CmsChatAction, CmsChatProps } from './CmsChat.types';

const CMS_PROMPT_SUGGESTIONS = [
  'Draft a landing page about product launch',
  'Write a blog article about headless CMS trends',
  'Create documentation page for API integration',
] as const;

export const CmsChat: FC<CmsChatProps> = (props) => {
  const { isOpen, onClose, token, side, crewAvailable, onOpenCrew } = props;
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const [draft, setDraft] = useState(CMS_CHAT_EMPTY);
  const [applyingId, setApplyingId] = useState<string | null>(null);

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

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt || pending) return;
    setDraft(CMS_CHAT_EMPTY);
    await sendMessage(prompt);
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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      side={side}
      size="md"
      title={t.cmsShell.chat}
    >
      <Flex direction="column" gap={3} className="bifrost-cms-chat">
        <Flex justify="between" align="center" className="w-full">
          <Typography variant="body2" className="bifrost-cms__muted mb-0">
            {t.cmsShell.chatHint}
          </Typography>
          {totalTokensUsed > NUMBER_ZERO ? (
            <Badge variant="neutral" className="text-xs shrink-0">
              {t.cmsShell.alloyTokensUsage.replace('{count}', String(totalTokensUsed))}
            </Badge>
          ) : null}
        </Flex>

        {crewAvailable ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            icon={<BearIcons.UsersIcon size={CMS_ICON_SIZE} />}
            onClick={() => {
              onClose();
              onOpenCrew();
            }}
          >
            {t.cmsShell.chatOpenCrew}
          </Button>
        ) : null}

        <Flex wrap="wrap" gap={2} className="bifrost-cms-chat__prompts">
          {CMS_PROMPT_SUGGESTIONS.map((text) => (
            <Chip key={text} size="sm" onClick={() => onPromptClick(text)}>
              {text}
            </Chip>
          ))}
        </Flex>

        <div className="bifrost-cms-chat__log">
          {messages.length === NUMBER_ZERO ? (
            <Typography variant="body2" className="bifrost-cms__muted mb-0">
              {t.cmsShell.chatEmpty}
            </Typography>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`bifrost-cms-chat__bubble bifrost-cms-chat__bubble--${message.role}`}
              >
                <Typography variant="caption" className="mb-1 font-semibold flex items-center justify-between">
                  <span>{message.role === 'user' ? t.cmsShell.chatYou : t.cmsShell.chatAssistant}</span>
                  {message.usage?.totalTokens ? (
                    <span className="text-[10px] text-gray-400 font-normal">
                      {message.usage.totalTokens} tokens
                    </span>
                  ) : null}
                </Typography>
                <Typography variant="body2" className="mb-2 whitespace-pre-wrap">
                  {message.text}
                </Typography>

                {message.action ? (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-pink-200 dark:border-pink-900 shadow-sm text-left">
                    <Flex justify="between" align="center" className="mb-2">
                      <Badge variant="neutral" className="bg-pink-100 text-pink-700 text-xs font-semibold">
                        {message.action.action === 'create_article'
                          ? t.cmsShell.alloyActionCreateArticle
                          : t.cmsShell.alloyActionCreatePage}
                      </Badge>
                      {message.actionApplied ? (
                        <span className="text-xs text-emerald-600 font-medium">
                          ✓ {t.cmsShell.alloyActionApplied}
                        </span>
                      ) : null}
                    </Flex>

                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                      <div><span className="font-semibold">Title:</span> {String(message.action.data.title || '')}</div>
                      <div><span className="font-semibold">Slug:</span> {String(message.action.data.slug || '')}</div>
                    </div>

                    {!message.actionApplied ? (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={applyingId === message.id}
                        onClick={() => void handleApplyAction(message.id, message.action!)}
                        className="bg-pink-600 hover:bg-pink-700 text-white text-xs w-full justify-center"
                      >
                        {applyingId === message.id
                          ? t.cmsShell.alloyActionApplying
                          : t.cmsShell.alloyActionExecute}
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))
          )}
          {pending ? (
            <Flex align="center" gap={2}>
              <span className="bifrost-cms-glow-mark bifrost-cms-glow-mark--sm" aria-hidden="true" />
              <Typography variant="caption" className="mb-0">
                {t.cmsShell.chatPending}
              </Typography>
            </Flex>
          ) : null}
        </div>

        <form onSubmit={(event) => void onSubmit(event)} className="bifrost-cms-chat__form">
          <Input
            id={CMS_CHAT_INPUT_ID}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t.cmsShell.chatPlaceholder}
            disabled={pending}
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            icon={<BearIcons.SparklesIcon size={CMS_ICON_SIZE} />}
            disabled={pending || !draft.trim()}
          >
            {t.cmsShell.chatSend}
          </Button>
        </form>
      </Flex>
    </Drawer>
  );
};
