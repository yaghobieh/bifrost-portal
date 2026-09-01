import { CONTENT_TYPE_JSON } from '@const/strings.const';
import { HTTP_METHOD_GET, HTTP_METHOD_POST } from '@const/http.const';
import { AUTH_BEARER_PREFIX, AUTH_HEADER_AUTHORIZATION } from '@hooks/auth.const';
import { EMPTY_STRING, INK_API_URL } from '@const/index';
import {
  CMS_HEALTH_PATH,
  CMS_LIVE_DOWN,
  CMS_LIVE_EVENTS_KEY,
  CMS_LIVE_HEADER_CONTENT_TYPE,
  CMS_LIVE_HTTP_PROTOCOL,
  CMS_LIVE_LOCAL_MSG_PREFIX,
  CMS_LIVE_LOCAL_ROOM_PREFIX,
  CMS_LIVE_OK,
  CMS_LIVE_PATH,
  CMS_LIVE_PATH_SEP,
  CMS_LIVE_TOKEN_QUERY,
  CMS_LIVE_TYPE_PRESENCE_PING,
  CMS_LIVE_WS_PROTOCOL,
  CMS_PRESENCE_NOT_THERE,
  CMS_PRESENCE_ONLINE,
  CMS_PRESENCE_STATUSES,
  CMS_PRESENCE_STORAGE_KEY,
} from './CmsLive.const';
import type { CmsChatMessage, CmsChatRoom, CmsLiveHealth, CmsPresenceStatus, CmsPresenceUser } from './CmsLive.types';

export const cmsApiOrigin = (): string => {
  if (INK_API_URL) {
    return INK_API_URL;
  }
  if (typeof window === 'undefined') {
    return EMPTY_STRING;
  }
  return window.location.origin;
};

export const toCmsLiveWsUrl = (token: string): string => {
  const base = cmsApiOrigin().replace(CMS_LIVE_HTTP_PROTOCOL, CMS_LIVE_WS_PROTOCOL);
  const params = new URLSearchParams({ [CMS_LIVE_TOKEN_QUERY]: token });
  return `${base}${CMS_LIVE_PATH}?${params.toString()}`;
};

export const pingCmsHealth = async (): Promise<CmsLiveHealth> => {
  try {
    const response = await fetch(`${cmsApiOrigin()}${CMS_HEALTH_PATH}`);
    if (!response.ok) {
      return { status: CMS_LIVE_DOWN, db: false };
    }
    const data = (await response.json()) as { db?: boolean };
    if (data.db) {
      return { status: CMS_LIVE_OK, db: true };
    }
    return { status: CMS_LIVE_DOWN, db: false };
  } catch {
    return { status: CMS_LIVE_DOWN, db: false };
  }
};

export const sameMembers = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) return false;
  const seen = new Set(left);
  return right.every((id) => seen.has(id));
};

export const matchRoom = (left: CmsChatRoom, right: CmsChatRoom): boolean => {
  if (left.tag && right.tag) return left.tag === right.tag;
  if (left.tag || right.tag) return false;
  return sameMembers(left.userIds, right.userIds);
};

export const mergeChatRooms = (current: CmsChatRoom[], incoming: CmsChatRoom[]): CmsChatRoom[] => {
  if (incoming.length === 0) return current;
  const locals = current.filter((room) => room.id.startsWith(CMS_LIVE_LOCAL_ROOM_PREFIX));
  const merged = incoming.map((room) => {
    const local = locals.find((item) => matchRoom(item, room));
    const known = current.find((item) => item.id === room.id || matchRoom(item, room));
    const prior = local ?? known;
    if (!prior || prior.messages.length === 0) return room;
    const seen = new Set(room.messages.map((message) => message.id));
    const extra = prior.messages.filter((message) => {
      if (seen.has(message.id)) return false;
      if (!message.id.startsWith(CMS_LIVE_LOCAL_MSG_PREFIX) || room.messages.length === 0) {
        return true;
      }
      return !room.messages.some(
        (item) => item.userId === message.userId && item.body === message.body,
      );
    });
    if (extra.length === 0) return room;
    return { ...room, messages: [...room.messages, ...extra] };
  });
  current.forEach((room) => {
    if (!incoming.some((item) => item.id === room.id || matchRoom(item, room))) {
      merged.push(room);
    }
  });
  return merged;
};

export const findDirectRoom = (
  rooms: CmsChatRoom[],
  currentUserId: string,
  otherId: string,
): CmsChatRoom | undefined =>
  rooms.find(
    (room) =>
      !room.tag &&
      room.userIds.includes(otherId) &&
      (!currentUserId || room.userIds.includes(currentUserId)),
  );

export const findServerMatch = (rooms: CmsChatRoom[], local: CmsChatRoom): CmsChatRoom | undefined =>
  rooms.find(
    (room) => !room.id.startsWith(CMS_LIVE_LOCAL_ROOM_PREFIX) && matchRoom(local, room),
  );

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (!value) {
    return false;
  }
  return typeof value === 'object' && !Array.isArray(value);
};

const readString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return EMPTY_STRING;
  }
  return value;
};

export const currentLiveLocation = (): { location: string; locationLabel: string } => {
  if (typeof window === 'undefined') {
    return { location: EMPTY_STRING, locationLabel: EMPTY_STRING };
  }
  const location = window.location.pathname;
  const parts = location.split(CMS_LIVE_PATH_SEP).filter((part) => part.length > 0);
  if (parts.length === 0) {
    return { location, locationLabel: location };
  }
  return { location, locationLabel: parts[parts.length - 1] };
};

export const presencePingBody = (params: {
  name: string;
  avatar: string;
  availability: CmsPresenceStatus;
}): string => {
  const { name, avatar, availability } = params;
  const { location, locationLabel } = currentLiveLocation();
  return JSON.stringify({
    type: CMS_LIVE_TYPE_PRESENCE_PING,
    location,
    locationLabel,
    name,
    avatar,
    availability,
  });
};

export const readPresenceStatus = (value: unknown): CmsPresenceStatus => {
  const match = CMS_PRESENCE_STATUSES.find((status) => status === value);
  if (match) {
    return match;
  }
  return CMS_PRESENCE_ONLINE;
};

export const loadStoredAvailability = (): CmsPresenceStatus => {
  try {
    return readPresenceStatus(window.localStorage.getItem(CMS_PRESENCE_STORAGE_KEY));
  } catch {
    return CMS_PRESENCE_ONLINE;
  }
};

export const saveStoredAvailability = (status: CmsPresenceStatus): void => {
  try {
    window.localStorage.setItem(CMS_PRESENCE_STORAGE_KEY, status);
  } catch {
    return;
  }
};

export const isChatPresent = (user: CmsPresenceUser): boolean =>
  user.availability !== CMS_PRESENCE_NOT_THERE;

export const resolvePresenceUsers = (value: unknown): CmsPresenceUser[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const users: CmsPresenceUser[] = [];
  value.forEach((row) => {
    if (!isRecord(row)) {
      return;
    }
    const id = readString(row.id);
    if (!id) {
      return;
    }
    users.push({
      id,
      name: readString(row.name),
      avatar: readString(row.avatar),
      location: readString(row.location),
      locationLabel: readString(row.locationLabel),
      availability: readPresenceStatus(row.availability),
    });
  });
  return users;
};

export const resolveChatRoom = (value: unknown): CmsChatRoom | null => {
  if (!isRecord(value)) {
    return null;
  }
  const id = readString(value.id);
  if (!id) {
    return null;
  }
  const userIds = Array.isArray(value.userIds)
    ? value.userIds.filter((item) => typeof item === 'string')
    : [];
  const messages: CmsChatMessage[] = [];
  if (Array.isArray(value.messages)) {
    value.messages.forEach((row) => {
      if (!isRecord(row)) {
        return;
      }
      const messageId = readString(row.id);
      const body = readString(row.body);
      if (!messageId || !body) {
        return;
      }
      messages.push({
        id: messageId,
        userId: readString(row.userId),
        name: readString(row.name),
        body,
        at: readString(row.at),
      });
    });
  }
  return {
    id,
    userIds,
    tag: readString(value.tag),
    messages,
  };
};

export const resolveChatRooms = (value: unknown): CmsChatRoom[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const rooms: CmsChatRoom[] = [];
  value.forEach((row) => {
    const room = resolveChatRoom(row);
    if (room) {
      rooms.push(room);
    }
  });
  return rooms;
};

export type CmsLiveParsedPayload = {
  type: string;
  db: boolean;
  items: unknown;
  unread: number | null;
  item: unknown;
  users: unknown;
  selfId: string;
  tasks: unknown;
  board: unknown;
  rooms: unknown;
  room: unknown;
};

export const parseLiveSocketPayload = (raw: string): CmsLiveParsedPayload | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }
    const type = readString(parsed.type);
    if (!type) {
      return null;
    }
    const unread = typeof parsed.unread === 'number' ? parsed.unread : null;
    return {
      type,
      db: Boolean(parsed.db),
      items: parsed.items,
      unread,
      item: parsed.item,
      users: parsed.users,
      selfId: readString(parsed.selfId),
      tasks: parsed.tasks,
      board: parsed.board,
      rooms: parsed.rooms,
      room: parsed.room,
    };
  } catch {
    return null;
  }
};

export const liveEventsFromBody = (value: unknown): unknown[] => {
  if (!isRecord(value)) {
    return [];
  }
  const events = value[CMS_LIVE_EVENTS_KEY];
  if (!Array.isArray(events)) {
    return [];
  }
  return events;
};

export const requestCmsLiveHttp = async (params: {
  token: string;
  body?: string;
}): Promise<unknown> => {
  const { token, body } = params;
  const headers: Record<string, string> = {
    [AUTH_HEADER_AUTHORIZATION]: `${AUTH_BEARER_PREFIX}${token}`,
  };
  if (body) {
    headers[CMS_LIVE_HEADER_CONTENT_TYPE] = CONTENT_TYPE_JSON;
  }
  try {
    const response = await fetch(`${cmsApiOrigin()}${CMS_LIVE_PATH}`, {
      method: body ? HTTP_METHOD_POST : HTTP_METHOD_GET,
      headers,
      body,
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch {
    return null;
  }
};

