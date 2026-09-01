export const LIVE_PRESENCE_TTL_SEC = 15;
export const LIVE_MESSAGE_LIMIT = 100;
export const LIVE_TASKS_ROW_ID = 'default';
export const LIVE_EVENTS_KEY = 'events';
export const LIVE_QUERY_TOKEN = 'token';
export const LIVE_TYPE_HEALTH = 'health';
export const LIVE_TYPE_PRESENCE = 'presence';
export const LIVE_TYPE_PRESENCE_PING = 'presence:ping';
export const LIVE_TYPE_CHAT_ROOMS = 'chat:rooms';
export const LIVE_TYPE_CHAT_ROOM = 'chat:room';
export const LIVE_TYPE_CHAT_MESSAGE = 'chat:message';
export const LIVE_TYPE_TASKS = 'tasks';
export const LIVE_TYPE_TASKS_UPDATE = 'tasks:update';
export const LIVE_AVAILABILITY_ONLINE = 'online';
export const LIVE_AVAILABILITY_AWAY = 'away';
export const LIVE_AVAILABILITY_BUSY = 'busy';
export const LIVE_AVAILABILITY_NOT_THERE = 'not_there';
export const LIVE_AVAILABILITIES = [
  LIVE_AVAILABILITY_ONLINE,
  LIVE_AVAILABILITY_AWAY,
  LIVE_AVAILABILITY_BUSY,
  LIVE_AVAILABILITY_NOT_THERE,
] as const;
export const LIVE_HEALTH_OK = 'ok';
