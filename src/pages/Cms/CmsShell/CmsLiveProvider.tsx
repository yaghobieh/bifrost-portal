import { createContext, useContext, useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import { NUMBER_TWO } from '@const/numbers.const';
import { EMPTY_STRING } from '@const/index';
import { useAuth } from '@hooks/index';
import { markNotificationReadRequest, type CmsNotification } from '@sdk/modules/cms';
import type { CmsTask, TaskBoardConfig } from '../TasksPages/TasksPages.types';
import { loadCmsProfile } from '../SettingsPages';
import {
  CMS_LIVE_CONNECTING,
  CMS_LIVE_DOWN,
  CMS_LIVE_OK,
  CMS_LIVE_PING_MS,
  CMS_LIVE_RECONNECT_MAX_MS,
  CMS_LIVE_RECONNECT_MS,
  CMS_LIVE_TYPE_CHAT_MESSAGE,
  CMS_LIVE_TYPE_CHAT_ROOM,
  CMS_LIVE_TYPE_CHAT_ROOMS,
  CMS_LIVE_TYPE_HEALTH,
  CMS_LIVE_TYPE_NOTIFICATION,
  CMS_LIVE_TYPE_NOTIFICATIONS,
  CMS_LIVE_TYPE_PRESENCE,
  CMS_LIVE_TYPE_TASKS,
  CMS_LIVE_TYPE_TASKS_UPDATE,
  CMS_LIVE_LOCAL_ROOM_PREFIX,
  CMS_LIVE_LOCAL_MSG_PREFIX,
  CMS_LIVE_TRANSPORT_HTTP,
  CMS_LIVE_TRANSPORT_WS,
} from './CmsLive.const';
import type {
  CmsChatRoom,
  CmsLiveContextValue,
  CmsLiveHealth,
  CmsPresenceStatus,
  CmsPresenceUser,
} from './CmsLive.types';
import {
  liveEventsFromBody,
  mergeChatRooms,
  loadStoredAvailability,
  parseLiveSocketPayload,
  presencePingBody,
  requestCmsLiveHttp,
  resolveChatRoom,
  resolveChatRooms,
  resolvePresenceUsers,
  sameMembers,
  saveStoredAvailability,
  toCmsLiveWsUrl,
} from './CmsLive.utils';

const CmsLiveContext = createContext<CmsLiveContextValue | null>(null);

const idleLive = (): CmsLiveContextValue => ({
  health: { status: CMS_LIVE_DOWN, db: false },
  items: [],
  unread: 0,
  selfId: EMPTY_STRING,
  onlineUsers: [],
  tasks: null,
  board: null,
  rooms: [],
  availability: 'online',
  setAvailability: () => undefined,
  markRead: () => undefined,
  markAllRead: () => undefined,
  publishTasks: () => undefined,
  createRoom: () => EMPTY_STRING,
  sendChat: () => undefined,
});

const resolveNotification = (value: unknown): CmsNotification | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const row = value as CmsNotification;
  if (typeof row.id !== 'string') {
    return null;
  }
  return row;
};

export const CmsLiveProvider: FC<{ children: ReactNode }> = (props) => {
  const { token, user } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const [health, setHealth] = useState<CmsLiveHealth>({
    status: CMS_LIVE_CONNECTING,
    db: false,
  });
  const [items, setItems] = useState<CmsNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [selfId, setSelfId] = useState(EMPTY_STRING);
  const [onlineUsers, setOnlineUsers] = useState<CmsPresenceUser[]>([]);
  const [tasks, setTasks] = useState<CmsTask[] | null>(null);
  const [board, setBoard] = useState<TaskBoardConfig | null>(null);
  const [rooms, setRooms] = useState<CmsChatRoom[]>([]);
  const [availability, setAvailabilityState] = useState<CmsPresenceStatus>(loadStoredAvailability);
  const availabilityRef = useRef(availability);
  availabilityRef.current = availability;
  const roomsRef = useRef<CmsChatRoom[]>([]);
  roomsRef.current = rooms;
  const transportRef = useRef<string | null>(null);
  const applyLiveRawRef = useRef<(raw: string) => void>(() => undefined);

  useEffect(() => {
    if (!token) {
      setHealth({ status: CMS_LIVE_DOWN, db: false });
      setOnlineUsers([]);
      setSelfId(EMPTY_STRING);
      return undefined;
    }
    let stopped = false;
    let socket: WebSocket | null = null;
    let pingTimer: number | null = null;
    let retryTimer: number | null = null;
    let delay = CMS_LIVE_RECONNECT_MS;
    let socketOpened = false;
    transportRef.current = null;

    const pingName = user?.name || user?.username || EMPTY_STRING;
    const pingBody = () =>
      presencePingBody({
        name: pingName,
        avatar: loadCmsProfile().avatarDataUrl || EMPTY_STRING,
        availability: availabilityRef.current,
      });

    const clearPing = () => {
      if (pingTimer !== null) {
        window.clearInterval(pingTimer);
        pingTimer = null;
      }
    };

    const applyMessage = (event: MessageEvent<string>) => {
      const payload = parseLiveSocketPayload(String(event.data));
      if (!payload) {
        return;
      }
      if (payload.type === CMS_LIVE_TYPE_HEALTH) {
        if (payload.db) {
          setHealth({ status: CMS_LIVE_OK, db: true });
          return;
        }
        setHealth({ status: CMS_LIVE_DOWN, db: false });
        return;
      }
      if (payload.type === CMS_LIVE_TYPE_NOTIFICATIONS && Array.isArray(payload.items)) {
        const nextItems = payload.items
          .map(resolveNotification)
          .filter((item): item is CmsNotification => Boolean(item));
        setItems(nextItems);
        if (payload.unread !== null) {
          setUnread(payload.unread);
        }
        return;
      }
      if (payload.type === CMS_LIVE_TYPE_NOTIFICATION) {
        const item = resolveNotification(payload.item);
        if (!item) {
          return;
        }
        setItems((current) => [item, ...current]);
        if (payload.unread !== null) {
          setUnread(payload.unread);
        }
        return;
      }
      if (payload.type === CMS_LIVE_TYPE_PRESENCE) {
        setOnlineUsers(resolvePresenceUsers(payload.users));
        if (payload.selfId) {
          setSelfId(payload.selfId);
        }
        return;
      }
      if (payload.type === CMS_LIVE_TYPE_TASKS) {
        if (Array.isArray(payload.tasks)) {
          setTasks(payload.tasks as CmsTask[]);
        }
        if (payload.board) {
          setBoard(payload.board as TaskBoardConfig);
        }
        return;
      }
      if (payload.type === CMS_LIVE_TYPE_CHAT_ROOMS) {
        const incoming = resolveChatRooms(payload.rooms);
        if (incoming.length > 0) {
          setRooms((current) => mergeChatRooms(current, incoming));
        }
        return;
      }
      if (payload.type === CMS_LIVE_TYPE_CHAT_MESSAGE || payload.type === CMS_LIVE_TYPE_CHAT_ROOM) {
        const room = resolveChatRoom(payload.room);
        if (!room) {
          return;
        }
        setRooms((current) => mergeChatRooms(current, [room]));
      }
    };
    applyLiveRawRef.current = (raw) => {
      applyMessage({ data: raw } as MessageEvent<string>);
    };

    const applyHttpBody = (data: unknown) => {
      const events = liveEventsFromBody(data);
      if (events.length === 0) {
        setHealth({ status: CMS_LIVE_DOWN, db: false });
        return;
      }
      events.forEach((event) => {
        applyMessage({ data: JSON.stringify(event) } as MessageEvent<string>);
      });
    };

    const runHttp = async (body?: string) => {
      if (stopped) {
        return;
      }
      const data = await requestCmsLiveHttp({ token, body });
      if (stopped) {
        return;
      }
      if (!data) {
        setHealth({ status: CMS_LIVE_DOWN, db: false });
        return;
      }
      applyHttpBody(data);
    };

    const startHttp = () => {
      if (stopped || transportRef.current === CMS_LIVE_TRANSPORT_HTTP) {
        return;
      }
      transportRef.current = CMS_LIVE_TRANSPORT_HTTP;
      socketRef.current = null;
      clearPing();
      void runHttp(pingBody());
      pingTimer = window.setInterval(() => {
        void runHttp(pingBody());
      }, CMS_LIVE_PING_MS);
    };

    const connect = () => {
      if (stopped || transportRef.current === CMS_LIVE_TRANSPORT_HTTP) {
        return;
      }
      setHealth({ status: CMS_LIVE_CONNECTING, db: false });
      const next = new WebSocket(toCmsLiveWsUrl(token));
      socket = next;
      socketRef.current = next;
      next.onmessage = applyMessage;
      next.onopen = () => {
        socketOpened = true;
        transportRef.current = CMS_LIVE_TRANSPORT_WS;
        delay = CMS_LIVE_RECONNECT_MS;
        clearPing();
        if (next.readyState === WebSocket.OPEN) {
          next.send(pingBody());
        }
        pingTimer = window.setInterval(() => {
          if (next.readyState === WebSocket.OPEN) {
            next.send(pingBody());
          }
        }, CMS_LIVE_PING_MS);
      };
      next.onerror = () => undefined;
      next.onclose = () => {
        clearPing();
        if (socketRef.current === next) {
          socketRef.current = null;
        }
        if (stopped) {
          return;
        }
        if (!socketOpened) {
          startHttp();
          return;
        }
        if (transportRef.current === CMS_LIVE_TRANSPORT_HTTP) {
          return;
        }
        setHealth({ status: CMS_LIVE_CONNECTING, db: false });
        retryTimer = window.setTimeout(() => {
          delay = Math.min(delay * NUMBER_TWO, CMS_LIVE_RECONNECT_MAX_MS);
          connect();
        }, delay);
      };
    };

    connect();
    return () => {
      stopped = true;
      clearPing();
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer);
      }
      socket?.close();
      setOnlineUsers([]);
      setSelfId(EMPTY_STRING);
    };
  }, [token, user?.name, user?.username]);

  const sendJson = (payload: unknown) => {
    if (transportRef.current === CMS_LIVE_TRANSPORT_HTTP) {
      void requestCmsLiveHttp({ token: token || EMPTY_STRING, body: JSON.stringify(payload) }).then(
        (data) => {
          liveEventsFromBody(data).forEach((event) => {
            applyLiveRawRef.current(JSON.stringify(event));
          });
        },
      );
      return;
    }
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    socket.send(JSON.stringify(payload));
  };

  const markRead = (id: string) => {
    if (!token) {
      return;
    }
    void markNotificationReadRequest(token, id);
    setItems((current) =>
      current.map((row) =>
        row.id === id ? { ...row, readAt: new Date().toISOString() } : row,
      ),
    );
    setUnread((current) => Math.max(0, current - 1));
  };

  const markAllRead = () => {
    items
      .filter((row) => !row.readAt)
      .forEach((row) => {
        markRead(row.id);
      });
  };

  const publishTasks = (nextTasks: CmsTask[], nextBoard: TaskBoardConfig) => {
    setTasks(nextTasks);
    setBoard(nextBoard);
    sendJson({ type: CMS_LIVE_TYPE_TASKS_UPDATE, tasks: nextTasks, board: nextBoard });
  };

  const createRoom = (userIds: string[], tag?: string): string => {
    const unique = [...new Set(userIds.filter((id) => id.length > 0))];
    const channel = tag ?? EMPTY_STRING;
    const current = roomsRef.current;
    const existing = channel
      ? current.find((room) => room.tag === channel)
      : current.find((room) => !room.tag && sameMembers(room.userIds, unique));
    if (existing) {
      const merged = [...new Set([...existing.userIds, ...unique])];
      if (merged.length !== existing.userIds.length) {
        const next = { ...existing, userIds: merged };
        roomsRef.current = current.map((room) => (room.id === existing.id ? next : room));
        setRooms((roomsNow) => roomsNow.map((room) => (room.id === existing.id ? next : room)));
      }
      sendJson({ type: CMS_LIVE_TYPE_CHAT_ROOM, userIds: merged, tag: channel });
      return existing.id;
    }
    const nextId = `${CMS_LIVE_LOCAL_ROOM_PREFIX}${Date.now()}`;
    const nextRoom: CmsChatRoom = {
      id: nextId,
      userIds: unique,
      tag: channel,
      messages: [],
    };
    roomsRef.current = [...current, nextRoom];
    setRooms((roomsNow) => {
      if (channel && roomsNow.some((room) => room.tag === channel)) {
        return roomsNow;
      }
      if (!channel && roomsNow.some((room) => !room.tag && sameMembers(room.userIds, unique))) {
        return roomsNow;
      }
      return [...roomsNow, nextRoom];
    });
    sendJson({ type: CMS_LIVE_TYPE_CHAT_ROOM, userIds: unique, tag: channel });
    return nextId;
  };

  const sendChat = (roomId: string, body: string) => {
    const room = rooms.find((item) => item.id === roomId) ?? roomsRef.current.find((item) => item.id === roomId);
    const local = roomId.startsWith(CMS_LIVE_LOCAL_ROOM_PREFIX);
    sendJson({
      type: CMS_LIVE_TYPE_CHAT_MESSAGE,
      roomId: local ? EMPTY_STRING : roomId,
      userIds: room?.userIds ?? [],
      tag: room?.tag ?? EMPTY_STRING,
      body,
    });
    const userId = selfId || user?.id || EMPTY_STRING;
    const name = user?.name || user?.username || EMPTY_STRING;
    const message = {
      id: `${CMS_LIVE_LOCAL_MSG_PREFIX}${Date.now()}`,
      userId,
      name,
      body,
      at: new Date().toISOString(),
    };
    setRooms((current) =>
      current.map((item) =>
        item.id === roomId ? { ...item, messages: [...item.messages, message] } : item,
      ),
    );
  };

  const setAvailability = (status: CmsPresenceStatus) => {
    saveStoredAvailability(status);
    availabilityRef.current = status;
    setAvailabilityState(status);
    const raw = presencePingBody({
      name: user?.name || user?.username || EMPTY_STRING,
      avatar: loadCmsProfile().avatarDataUrl || EMPTY_STRING,
      availability: status,
    });
    sendJson(JSON.parse(raw) as Record<string, unknown>);
  };

  return (
    <CmsLiveContext.Provider
      value={{
        health,
        items,
        unread,
        selfId,
        onlineUsers,
        tasks,
        board,
        rooms,
        availability,
        setAvailability,
        markRead,
        markAllRead,
        publishTasks,
        createRoom,
        sendChat,
      }}
    >
      {props.children}
    </CmsLiveContext.Provider>
  );
};

export const useCmsLive = (): CmsLiveContextValue => {
  const context = useContext(CmsLiveContext);
  if (!context) {
    return idleLive();
  }
  return context;
};
