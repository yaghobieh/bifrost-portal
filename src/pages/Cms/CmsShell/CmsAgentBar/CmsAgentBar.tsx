import { useState, type FC, type FormEvent } from 'react';
import { Avatar, BearIcons, Button, Chip, Flex, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import {
  AGENT_AVATAR_INITIALS,
  AGENT_BAR_CLASS,
  AGENT_BAR_COPY_CLASS,
  AGENT_SUGGESTION_IDS,
  AGENT_TEMPLATE_IDS,
} from '../cmsAgent.const';
import type { CmsAgentBarProps } from '../cmsAgent.types';

const suggestionLabel = (
  id: string,
  t: ReturnType<typeof useI18n>['t'],
): string => {
  const labels: Record<string, string> = {
    [AGENT_TEMPLATE_IDS.LANDING]: t.cmsShell.agentSuggestLanding,
    [AGENT_TEMPLATE_IDS.DOCS]: t.cmsShell.agentSuggestDocs,
    [AGENT_TEMPLATE_IDS.BLANK]: t.cmsShell.agentSuggestBlank,
  };
  return labels[id] || id;
};

export const CmsAgentBar: FC<CmsAgentBarProps> = (props) => {
  const { onApply, onPromptSubmit } = props;
  const { t } = useI18n();
  const [promptInput, setPromptInput] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const clean = promptInput.trim();
    if (!clean) return;
    if (onPromptSubmit) {
      onPromptSubmit(clean);
    } else {
      onApply(clean);
    }
    setPromptInput('');
  };

  return (
    <div className={AGENT_BAR_CLASS}>
      <Avatar initials={AGENT_AVATAR_INITIALS} size="sm" variant="circle" />
      <div className={AGENT_BAR_COPY_CLASS}>
        <Typography variant="caption" className="mb-0 font-medium">
          {t.cmsShell.agentName}
        </Typography>
        <Typography variant="caption" className="bifrost-cms__muted mb-0">
          {t.cmsShell.agentGreeting}
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 flex-1 min-w-[200px]">
        <input
          type="text"
          value={promptInput}
          onChange={(event) => setPromptInput(event.target.value)}
          placeholder={t.cmsShell.chatPlaceholder || 'Ask Alloy Copilot...'}
          className="w-full text-xs px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-blue-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1e3a8a] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
        <Button
          type="submit"
          size="xs"
          variant="primary"
          disabled={!promptInput.trim()}
          icon={<BearIcons.SparklesIcon size={12} />}
          className="bg-[#1e3a8a] hover:bg-[#172554] text-white shrink-0 px-2 py-0.5 rounded-full"
        />
      </form>

      <Flex gap={1} className="flex-wrap shrink-0">
        {AGENT_SUGGESTION_IDS.map((id) => (
          <Chip key={id} size="sm" onClick={() => onApply(id)}>
            {suggestionLabel(id, t)}
          </Chip>
        ))}
      </Flex>
    </div>
  );
};
