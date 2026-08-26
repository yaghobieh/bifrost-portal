import type { CmsPresenceUser } from '@pages/Cms/CmsShell/CmsLive.types';

export type LiveEditorsProps = {
  users: CmsPresenceUser[];
  currentUserId: string;
  location: string;
};
