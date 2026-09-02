import { neon } from '@neondatabase/serverless';
import {
  BEARER_PREFIX,
  EMPTY_STRING,
  ERROR_INTERNAL,
  HEADER_AUTHORIZATION,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_OK,
  METHOD_POST,
  NUMBER_ZERO,
} from './cmsAuth.const';
import type { CmsAuthResult } from './cmsAuth.types';
import { isAuthResult, requireUser } from './cmsAuth';
import { readUnknownObject, str } from './cmsAuth.utils';
import {
  LIVE_AVAILABILITY_ONLINE,
  LIVE_EVENTS_KEY,
  LIVE_HEALTH_OK,
  LIVE_MESSAGE_LIMIT,
  LIVE_PRESENCE_TTL_SEC,
  LIVE_QUERY_TOKEN,
  LIVE_TASKS_ROW_ID,
  LIVE_TYPE_CHAT_MESSAGE,
  LIVE_TYPE_CHAT_ROOM,
  LIVE_TYPE_CHAT_ROOMS,
  LIVE_TYPE_HEALTH,
  LIVE_TYPE_PRESENCE,
  LIVE_TYPE_PRESENCE_PING,
  LIVE_TYPE_TASKS,
  LIVE_TYPE_TASKS_UPDATE,
} from './cmsLive.const';
import type {
  LiveChatRoom,
  LiveIncoming,
  LiveMessageRow,
  LivePresenceRow,
  LiveRoomRow,
  LiveTasksRow,
} from './cmsLive.types';
import {
  assembleRooms,
  findMatchingRoom,
  mapPresenceUser,
  parseIncoming,
  parseUserIds,
} from './cmsLive.utils';

type SqlClient = ReturnType<typeof neon>;

const withQueryToken = (request: Request): Request => {
  const header = request.headers.get(HEADER_AUTHORIZATION);
  if (header) {
    return request;
  }
  const token = new URL(request.url).searchParams.get(LIVE_QUERY_TOKEN) ?? EMPTY_STRING;
  if (!token) {
    return request;
  }
  const headers = new Headers(request.headers);
  headers.set(HEADER_AUTHORIZATION, `${BEARER_PREFIX}${token}`);
  return new Request(request, { headers });
};

const ensureLiveTables = async (sql: SqlClient): Promise<void> => {
  await sql`
    CREATE TABLE IF NOT EXISTS cms_live_sessions (
      session_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      avatar TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      location_label TEXT NOT NULL DEFAULT '',
      availability TEXT NOT NULL DEFAULT 'online',
      seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_chat_rooms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tag TEXT NOT NULL DEFAULT '',
      user_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      room_id UUID NOT NULL REFERENCES cms_chat_rooms(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cms_live_tasks (
      id TEXT PRIMARY KEY,
      tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
      board JSONB
    )
  `;
};

const upsertPresence = async (params: {
  sql: SqlClient;
  sessionId: string;
  userId: string;
  name: string;
  avatar: string;
  location: string;
  locationLabel: string;
  availability: string;
}): Promise<void> => {
  const { sql, sessionId, userId, name, avatar, location, locationLabel, availability } = params;
  await sql`
    INSERT INTO cms_live_sessions (
      session_id, user_id, name, avatar, location, location_label, availability, seen_at
    )
    VALUES (
      ${sessionId}, ${userId}, ${name}, ${avatar}, ${location}, ${locationLabel}, ${availability}, NOW()
    )
    ON CONFLICT (session_id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      name = EXCLUDED.name,
      avatar = EXCLUDED.avatar,
      location = EXCLUDED.location,
      location_label = EXCLUDED.location_label,
      availability = EXCLUDED.availability,
      seen_at = NOW()
  `;
};

const listPresence = async (sql: SqlClient): Promise<LivePresenceUser[]> => {
  const ttl = LIVE_PRESENCE_TTL_SEC;
  const rows = (await sql`
    SELECT session_id, user_id, name, avatar, location, location_label, availability
    FROM cms_live_sessions
    WHERE seen_at > NOW() - (${ttl}::int * INTERVAL '1 second')
  `) as LivePresenceRow[];
  return rows.map(mapPresenceUser);
};

const listRoomsForUser = async (params: {
  sql: SqlClient;
  userId: string;
}): Promise<LiveChatRoom[]> => {
  const { sql, userId } = params;
  const rooms = (await sql`
    SELECT id, tag, user_ids FROM cms_chat_rooms
  `) as LiveRoomRow[];
  const messages = (await sql`
    SELECT id, room_id, user_id, name, body, at
    FROM cms_chat_messages
    ORDER BY at ASC
  `) as LiveMessageRow[];
  const keep =
    rooms.length === NUMBER_ZERO
      ? LIVE_MESSAGE_LIMIT
      : LIVE_MESSAGE_LIMIT * rooms.length;
  const start = messages.length > keep ? messages.length - keep : NUMBER_ZERO;
  const trimmed = messages.slice(start);
  return assembleRooms({ rooms, messages: trimmed, userId });
};

const upsertRoom = async (params: {
  sql: SqlClient;
  userId: string;
  incoming: LiveIncoming;
}): Promise<LiveChatRoom> => {
  const { sql, userId, incoming } = params;
  const tag = incoming.tag ?? EMPTY_STRING;
  const members = [...new Set([userId, ...(incoming.userIds ?? [])])];
  const current = await listRoomsForUser({ sql, userId });
  const existing = findMatchingRoom({
    rooms: current,
    roomId: incoming.roomId ?? EMPTY_STRING,
    tag,
    userIds: members,
  });
  if (existing) {
    const merged = [...new Set([...existing.userIds, ...members])];
    const mergedJson = JSON.stringify(merged);
    const nextTag = tag || existing.tag;
    await sql`
      UPDATE cms_chat_rooms
      SET user_ids = ${mergedJson}::jsonb, tag = ${nextTag}
      WHERE id = ${existing.id}
    `;
    return { ...existing, userIds: merged, tag: nextTag };
  }
  const membersJson = JSON.stringify(members);
  const created = (await sql`
    INSERT INTO cms_chat_rooms (tag, user_ids)
    VALUES (${tag}, ${membersJson}::jsonb)
    RETURNING id, tag, user_ids
  `) as LiveRoomRow[];
  const row = created[0];
  return {
    id: row?.id ?? EMPTY_STRING,
    tag: row?.tag ?? tag,
    userIds: parseUserIds(row?.user_ids) || members,
    messages: [],
  };
};

const insertMessage = async (params: {
  sql: SqlClient;
  roomId: string;
  userId: string;
  name: string;
  body: string;
}): Promise<void> => {
  const { sql, roomId, userId, name, body } = params;
  if (!body) {
    return;
  }
  await sql`
    INSERT INTO cms_chat_messages (room_id, user_id, name, body)
    VALUES (${roomId}, ${userId}, ${name}, ${body})
  `;
};

const loadTasks = async (sql: SqlClient): Promise<{ tasks: unknown; board: unknown }> => {
  const rows = (await sql`
    SELECT id, tasks, board FROM cms_live_tasks WHERE id = ${LIVE_TASKS_ROW_ID} LIMIT 1
  `) as LiveTasksRow[];
  const row = rows[0];
  if (!row) {
    return { tasks: null, board: null };
  }
  return { tasks: row.tasks, board: row.board };
};

const saveTasks = async (params: {
  sql: SqlClient;
  tasks: unknown;
  board: unknown;
}): Promise<void> => {
  const { sql, tasks, board } = params;
  const tasksJson = JSON.stringify(tasks ?? []);
  const boardJson = JSON.stringify(board ?? null);
  await sql`
    INSERT INTO cms_live_tasks (id, tasks, board)
    VALUES (${LIVE_TASKS_ROW_ID}, ${tasksJson}::jsonb, ${boardJson}::jsonb)
    ON CONFLICT (id) DO UPDATE SET tasks = EXCLUDED.tasks, board = EXCLUDED.board
  `;
};

const snapshot = async (params: {
  sql: SqlClient;
  userId: string;
  sessionId: string;
}): Promise<Record<string, unknown>> => {
  const { sql, userId, sessionId } = params;
  const users = await listPresence(sql);
  const rooms = await listRoomsForUser({ sql, userId });
  const tasks = await loadTasks(sql);
  return {
    [LIVE_EVENTS_KEY]: [
      { type: LIVE_TYPE_HEALTH, status: LIVE_HEALTH_OK, db: true },
      { type: LIVE_TYPE_PRESENCE, users, selfId: userId, selfSessionId: sessionId },
      { type: LIVE_TYPE_CHAT_ROOMS, rooms },
      { type: LIVE_TYPE_TASKS, tasks: tasks.tasks, board: tasks.board },
    ],
  };
};

const handleIncoming = async (params: {
  sql: SqlClient;
  userId: string;
  fallbackName: string;
  incoming: LiveIncoming;
}): Promise<string> => {
  const { sql, userId, fallbackName, incoming } = params;
  const sessionId = incoming.sessionId || userId;
  const isPing = incoming.type === LIVE_TYPE_PRESENCE_PING || incoming.type === EMPTY_STRING;
  if (isPing || incoming.location !== undefined || incoming.availability) {
    await upsertPresence({
      sql,
      sessionId,
      userId,
      name: incoming.name || fallbackName,
      avatar: incoming.avatar ?? EMPTY_STRING,
      location: incoming.location ?? EMPTY_STRING,
      locationLabel: incoming.locationLabel ?? EMPTY_STRING,
      availability: incoming.availability ?? LIVE_AVAILABILITY_ONLINE,
    });
  }
  if (incoming.type === LIVE_TYPE_CHAT_ROOM) {
    await upsertRoom({ sql, userId, incoming });
    return;
  }
  if (incoming.type === LIVE_TYPE_CHAT_MESSAGE) {
    const room = await upsertRoom({ sql, userId, incoming });
    await insertMessage({
      sql,
      roomId: room.id,
      userId,
      name: incoming.name || fallbackName,
      body: incoming.body ?? EMPTY_STRING,
    });
    return;
  }
  if (incoming.type === LIVE_TYPE_TASKS || incoming.type === LIVE_TYPE_TASKS_UPDATE) {
    await saveTasks({ sql, tasks: incoming.tasks, board: incoming.board });
  }
  return sessionId;
};

export const handleCmsLive = async (params: {
  databaseUrl: string;
  request: Request;
}): Promise<CmsAuthResult> => {
  const request = withQueryToken(params.request);
  const loaded = await requireUser({ databaseUrl: params.databaseUrl, request });
  if (isAuthResult(loaded)) {
    return loaded;
  }
  const sql = neon(params.databaseUrl);
  try {
    await ensureLiveTables(sql);
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
  const fallbackName = str(loaded.user.name) || str(loaded.user.username) || loaded.user.email;
  try {
    let sessionId = loaded.user.id;
    if (request.method === METHOD_POST) {
      const incoming = parseIncoming(await readUnknownObject(request));
      sessionId = await handleIncoming({
        sql,
        userId: loaded.user.id,
        fallbackName,
        incoming,
      });
    }
    const body = await snapshot({ sql, userId: loaded.user.id, sessionId });
    return { status: HTTP_STATUS_OK, body };
  } catch {
    return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR, body: { error: ERROR_INTERNAL } };
  }
};
