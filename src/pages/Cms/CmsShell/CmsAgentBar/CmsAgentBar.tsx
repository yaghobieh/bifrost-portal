import type { FC } from 'react';
import { Avatar, Chip, Flex, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { AGENT_AVATAR_INITIALS, AGENT_SUGGESTION_IDS } from '../cmsAgent.const';
import type { CmsAgentBarProps } from '../cmsAgent.types';
import { cmsAgentSuggestionLabel } from '../helpers/CmsAgentSuggestionLabel';

export const CmsAgentBar: FC<CmsAgentBarProps> = (props) => {
  const { onApply, chipsClassName } = props;
  const { t } = useI18n();
  return (
    <div className="bifrost-cms__agent-bar">
      <Avatar initials={AGENT_AVATAR_INITIALS} size="sm" variant="circle" />
      <div className="bifrost-cms__agent-bar-copy">
        <Typography variant="caption">
          {t.cmsShell.agentName}
        </Typography>
        <Typography variant="caption">
          {t.cmsShell.agentGreeting}
        </Typography>
      </div>
      <Flex gap={1} className={chipsClassName}>
        {AGENT_SUGGESTION_IDS.map((id) => (
          <Chip key={id} size="sm" onClick={() => onApply(id)}>
            {cmsAgentSuggestionLabel({ id, t })}
          </Chip>
        ))}
      </Flex>
    </div>
  );
};
