import { EMPTY_STRING } from '@const/index';
import type { CmsPresenceUser } from '../../../CmsLive.types';

export const usersAtLocation = (params: {
  users: CmsPresenceUser[];
  currentUserId: string;
  location: string;
}): CmsPresenceUser[] => {
  const { users, currentUserId, location } = params;
  if (!location) {
    return [];
  }
  return users.filter((person) => {
    if (person.id === currentUserId) {
      return false;
    }
    if (!person.location) {
      return false;
    }
    if (person.location === location) {
      return true;
    }
    return person.location.includes(location);
  });
};

export const editorInitials = (name: string, length: number): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return EMPTY_STRING;
  }
  return trimmed.slice(0, length).toUpperCase();
};
