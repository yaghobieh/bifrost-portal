import type { FC } from 'react';
import { Badge, BearIcons, Button, Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CMS_CHAT_SIDE_LEFT } from '@const/index';
import { CMS_ICON_SIZE, NUMBER_ZERO } from '@const/numbers.const';
import { AGENT_DOCK_ALIGN_END, AGENT_DOCK_ALIGN_START } from '../cmsAgent.const';
import type { CmsAgentDockProps } from '../cmsAgent.types';

export const CmsAgentDock: FC<CmsAgentDockProps> = (props) => {
  const { side, onOpenAi, onOpenCrew, crewUnread, crewOpen, crewPanel } = props;
  const { t } = useI18n();
  return (
    <div
      className={
        side === CMS_CHAT_SIDE_LEFT
          ? 'bifrost-cms__agent-dock bifrost-cms__agent-dock--left'
          : 'bifrost-cms__agent-dock'
      }
    >
      <Flex
        direction="column"
        gap={2}
        align={side === CMS_CHAT_SIDE_LEFT ? AGENT_DOCK_ALIGN_START : AGENT_DOCK_ALIGN_END}
      >
        <Button
          type="button"
          variant="ghost"
          iconOnly
          className="bifrost-cms__agent-bubble bifrost-cms__agent-bubble--ai"
          aria-label={t.cmsShell.dockAi}
          onClick={onOpenAi}
          icon={<BearIcons.SparklesIcon size={CMS_ICON_SIZE} />}
        />
        <span className="bifrost-cms__agent-chat-wrap">
          {crewOpen && crewPanel}
          <Button
            type="button"
            variant="ghost"
            iconOnly
            className="bifrost-cms__agent-bubble bifrost-cms__agent-bubble--chat"
            aria-label={t.cmsShell.dockChat}
            onClick={onOpenCrew}
            icon={<BearIcons.ChatIcon size={CMS_ICON_SIZE} />}
          />
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
