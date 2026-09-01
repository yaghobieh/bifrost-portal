import { str } from './cmsAuth.utils';
import {
  LIVE_AVAILABILITIES,
  LIVE_AVAILABILITY_ONLINE,
} from './cmsLive.const';
import type {
  LiveAvailability,
  LiveChatMessage,
  LiveChatRoom,
  LiveIncoming,
  LiveMessageRow,
  LivePresenceRow,
  LivePresenceUser,
  LiveRoomRow,
} from './cmsLive.types';

export const sameMembers = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  const seen = new Set(left);
  return right.every((id) => seen.has(id));
};

export const parseUserIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
};

export const readAvailability = (value: unknown): LiveAvailability => {
  const match = LIVE_AVAILABILITIES.find((item) => item === value);
  if (match) {
    return match;
  }
  return LIVE_AVAILABILITY_ONLINE;
};

export const mapPresenceUser = (row: LivePresenceRow): LivePresenceUser => ({
  id: row.user_id,
  name: row.name,
  avatar: row.avatar,
  location: row.location,
  locationLabel: row.location_label,
  availability: readAvailability(row.availability),
});

export const isoTime = (value: string | Date): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

export const mapMessage = (row: LiveMessageRow): LiveChatMessage => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  body: row.body,
  at: isoTime(row.at),
});

export const assembleRooms = (params: {
  rooms: LiveRoomRow[];
  messages: LiveMessageRow[];
  userId: string;
}): LiveChatRoom[] => {
  const { rooms, messages, userId } = params;
  const byRoom = new Map<string, LiveChatMessage[]>();
  messages.forEach((row) => {
    const list = byRoom.get(row.room_id) ?? [];
    list.push(mapMessage(row));
    byRoom.set(row.room_id, list);
  });
  const assembled: LiveChatRoom[] = [];
  rooms.forEach((row) => {
    const userIds = parseUserIds(row.user_ids);
    if (!userIds.includes(userId)) {
      return;
    }
    assembled.push({
      id: row.id,
      tag: row.tag,
      userIds,
      messages: byRoom.get(row.id) ?? [],
    });
  });
  return assembled;
};

export const findMatchingRoom = (params: {
  rooms: LiveChatRoom[];
  roomId: string;
  tag: string;
  userIds: string[];
}): LiveChatRoom | undefined => {
  const { rooms, roomId, tag, userIds } = params;
  if (roomId) {
    return rooms.find((room) => room.id === roomId);
  }
  if (tag) {
    return rooms.find((room) => room.tag === tag);
  }
  return rooms.find((room) => !room.tag && sameMembers(room.userIds, userIds));
};

export const parseIncoming = (body: Record<string, unknown>): LiveIncoming => ({
  type: str(body.type),
  location: body.location === undefined ? undefined : str(body.location),
  locationLabel: body.locationLabel === undefined ? undefined : str(body.locationLabel),
  avatar: body.avatar === undefined ? undefined : str(body.avatar),
  name: body.name === undefined ? undefined : str(body.name),
  availability: body.availability === undefined ? undefined : readAvailability(body.availability),
  roomId: body.roomId === undefined ? undefined : str(body.roomId),
  userIds: body.userIds === undefined ? undefined : parseUserIds(body.userIds),
  tag: body.tag === undefined ? undefined : str(body.tag),
  body: body.body === undefined ? undefined : str(body.body),
  tasks: body.tasks,
  board: body.board,
});
