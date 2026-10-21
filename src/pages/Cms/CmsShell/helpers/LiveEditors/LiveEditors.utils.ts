import { EMPTY_STRING } from '@const/index';
import { CMS_PRESENCE_NOT_THERE } from '@pages/Cms/CmsShell/CmsLive.const';
import type { CmsPresenceUser } from '@pages/Cms/CmsShell/CmsLive.types';

const matchesLocation = (person: CmsPresenceUser, location: string): boolean => {
  if (!person.location) {
    return false;
  }
  if (person.location === location) {
    return true;
  }
  return person.location.includes(location);
};

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
    if (person.availability === CMS_PRESENCE_NOT_THERE) {
      return false;
    }
    return matchesLocation(person, location);
  });
};

export const locationOwner = (params: {
  users: CmsPresenceUser[];
  location: string;
}): CmsPresenceUser | null => {
  const { users, location } = params;
  if (!location) {
    return null;
  }
  const owner = users.find(
    (person) => person.availability !== CMS_PRESENCE_NOT_THERE && matchesLocation(person, location),
  );
  if (!owner) {
    return null;
  }
  return owner;
};

export const isPageSubmitLocked = (params: {
  users: CmsPresenceUser[];
  currentUserId: string;
  location: string;
}): boolean => {
  const { currentUserId } = params;
  const owner = locationOwner(params);
  if (!owner) {
    return false;
  }
  if (!currentUserId) {
    return false;
  }
  return owner.id !== currentUserId;
};

export const editorInitials = (name: string, length: number): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return EMPTY_STRING;
  }
  return trimmed.slice(0, length).toUpperCase();
};
