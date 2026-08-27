import type { FC } from 'react';
import type { CrewUser } from '@pages/Cms/CrewPages/CrewPages.const';

export type CalendarDraftUsersProps = {
  ids: string[];
  users: CrewUser[];
};
