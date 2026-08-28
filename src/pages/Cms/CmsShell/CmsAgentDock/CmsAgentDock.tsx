import type { FC } from 'react';
import { Badge, BearIcons, Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CMS_CHAT_SIDE_LEFT } from '@const/index';
import { CMS_ICON_SIZE, NUMBER_ZERO } from '@const/numbers.const';
import {
  AGENT_BUBBLE_CLASS,
  AGENT_DOCK_CLASS,
  AGENT_DOCK_LEFT_CLASS,
} from '../cmsAgent.const';
import type { CmsAgentDockProps } from '../cmsAgent.types';

export const CmsAgentDock: FC<CmsAgentDockProps> = (props) => {
  const { side, onOpenAi, onOpenCrew, crewUnread, crewOpen, crewPanel } = props;
  const { t } = useI18n();
  const dockClass = side === CMS_CHAT_SIDE_LEFT ? AGENT_DOCK_LEFT_CLASS : AGENT_DOCK_CLASS;
  const dockAlign = side === CMS_CHAT_SIDE_LEFT ? 'start' : 'end';
  return (
    <div className={dockClass}>
      <Flex direction="column" gap={2} align={dockAlign}>
        <button
          type="button"
          className={`${AGENT_BUBBLE_CLASS} bifrost-cms__agent-bubble--ai`}
          aria-label={t.cmsShell.dockAi}
          onClick={onOpenAi}
        >
          <BearIcons.SparklesIcon size={CMS_ICON_SIZE} />
        </button>
        <span className="bifrost-cms__agent-chat-wrap">
          {crewOpen && crewPanel}
          <button
            type="button"
            className={`${AGENT_BUBBLE_CLASS} bifrost-cms__agent-bubble--chat`}
            aria-label={t.cmsShell.dockChat}
            onClick={onOpenCrew}
          >
            <BearIcons.ChatIcon size={CMS_ICON_SIZE} />
          </button>
          {crewUnread > NUMBER_ZERO && (
            <Badge variant="error" className="bifrost-cms__agent-chat-badge text-xs">
              {crewUnread}
            </Badge>
          )}
        </span>
      </Flex>
    </div>
  );
};
