import type { CmsPresenceUser } from '../CmsLive.types';

export type CmsOnlineStatusProps = {
  users: CmsPresenceUser[];
  currentUserId: string;
  currentSessionId: string;
  onOpenUser: (id: string) => void;
};
