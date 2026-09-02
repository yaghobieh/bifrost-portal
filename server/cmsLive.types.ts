export type LiveAvailability = 'online' | 'away' | 'busy' | 'not_there';

export type LivePresenceUser = {
  id: string;
  sessionId: string;
  name: string;
  avatar: string;
  location: string;
  locationLabel: string;
  availability: LiveAvailability;
};

export type LiveChatMessage = {
  id: string;
  userId: string;
  name: string;
  body: string;
  at: string;
};

export type LiveChatRoom = {
  id: string;
  userIds: string[];
  tag: string;
  messages: LiveChatMessage[];
};

export type LiveIncoming = {
  type: string;
  sessionId?: string;
  location?: string;
  locationLabel?: string;
  avatar?: string;
  name?: string;
  availability?: LiveAvailability;
  roomId?: string;
  userIds?: string[];
  tag?: string;
  body?: string;
  tasks?: unknown;
  board?: unknown;
};

export type LivePresenceRow = {
  session_id: string;
  user_id: string;
  name: string;
  avatar: string;
  location: string;
  location_label: string;
  availability: string;
};

export type LiveRoomRow = {
  id: string;
  tag: string;
  user_ids: unknown;
};

export type LiveMessageRow = {
  id: string;
  room_id: string;
  user_id: string;
  name: string;
  body: string;
  at: string | Date;
};

export type LiveTasksRow = {
  id: string;
  tasks: unknown;
  board: unknown;
};
