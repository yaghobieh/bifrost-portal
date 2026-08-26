import type { FC } from 'react';
import { Avatar, Flex, Tooltip } from '@forgedevstack/bear';
import { CMS_AVATAR_INITIALS_LENGTH } from '../../../CmsShell.const';
import { editorInitials, usersAtLocation } from './LiveEditors.utils';
import type { LiveEditorsProps } from './LiveEditors.types';

export const LiveEditors: FC<LiveEditorsProps> = (props) => {
  const { users, currentUserId, location } = props;
  const others = usersAtLocation({ users, currentUserId, location });
  if (others.length === 0) {
    return null;
  }
  return (
    <Flex align="center" gap={1} className="bifrost-cms-live-editors">
      {others.map((person) => (
        <Tooltip key={person.id} content={person.name} placement="bottom">
          <span className="bifrost-cms-live-editors__item">
            <Avatar
              src={person.avatar || undefined}
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
