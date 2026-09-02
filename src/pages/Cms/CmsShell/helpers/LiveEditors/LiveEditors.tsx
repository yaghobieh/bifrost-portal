import type { FC } from 'react';
import { Avatar, Flex, Tooltip } from '@forgedevstack/bear';
import { useNucleus } from '@forgedevstack/synapse';
import { EMPTY_STRING } from '@const/index';
import { CMS_AVATAR_INITIALS_LENGTH } from '@const/numbers.const';
import { mediaNucleus } from '@sdk/index';
import { toCloudinarySrc } from '@sdk/modules/media';
import { editorInitials, usersAtLocation } from './LiveEditors.utils';
import type { LiveEditorsProps } from './LiveEditors.types';

export const LiveEditors: FC<LiveEditorsProps> = (props) => {
  const { users, currentUserId, currentSessionId, location } = props;
  const { cloudName } = useNucleus(mediaNucleus);
  const others = usersAtLocation({ users, currentUserId, currentSessionId, location });
  if (others.length === 0) {
    return null;
  }
  return (
    <Flex align="center" gap={1} className="bifrost-cms-live-editors">
      {others.map((person) => (
        <Tooltip key={person.sessionId || person.id} content={person.name} placement="bottom">
          <span className="bifrost-cms-live-editors__item">
            <Avatar
              src={toCloudinarySrc(person.avatar || EMPTY_STRING, cloudName) || undefined}
              initials={editorInitials(person.name, CMS_AVATAR_INITIALS_LENGTH)}
              size="sm"
            />
            <span className="bifrost-cms-live-editors__dot" />
          </span>
        </Tooltip>
      ))}
    </Flex>
  );
};
