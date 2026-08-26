import type { CmsPresenceUser } from '../../../CmsLive.types';

export type LiveEditorsProps = {
  users: CmsPresenceUser[];
  currentUserId: string;
  location: string;
};
