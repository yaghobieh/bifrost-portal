import type { FC } from 'react';
import { Badge, Flex } from '@forgedevstack/bear';
import type { CrewUser } from '@pages/Cms/CrewPages/CrewPages.const';
import type { CalendarDraftUsersProps } from './CalendarDraftUsers.types';

export const CalendarDraftUsers: FC<CalendarDraftUsersProps> = (props) => {
  const { ids, users } = props;
  const badges = ids
    .map((id) => users.find((item) => item.id === id))
    .filter((user): user is CrewUser => Boolean(user));
  return (
    <Flex gap={1} wrap="wrap">
      {badges.map((user) => (
        <Badge key={user.id} variant="info">
          {user.name || user.username || user.email}
        </Badge>
      ))}
    </Flex>
  );
};
