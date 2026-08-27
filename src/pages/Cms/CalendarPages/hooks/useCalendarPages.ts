import { useEffect, useState } from 'react';
import type { CalendarEvent, CalendarMode } from '@forgedevstack/calendar';
import { useBearMode } from '@forgedevstack/bear';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING } from '@const/index';
import {
  createMeetingRequest,
  fetchCrewUsers,
  fetchMeetings,
  updateMeetingRequest,
} from '@sdk/modules/cms';
import type { CrewUser } from '../../CrewPages/CrewPages.const';
import { loadCmsThemeColors } from '../../SettingsPages';
import {
  CALENDAR_COL_PEOPLE,
  CALENDAR_COL_START,
  CALENDAR_COL_TITLE,
  CALENDAR_DEFAULT_DURATION_MS,
  CALENDAR_EMPTY,
  calendarThemeFrom,
} from '../CalendarPages.const';
import type { MeetingRow } from '../CalendarPages.types';
import { eventToInput, toCalendarEvents, toCalendarPeople } from '../CalendarPages.utils';

/**
 * Loads crew and meetings, then exposes draft create + persist handlers for the Calendar page.
 */
export const useCalendarPages = () => {
  const { t } = useI18n();
  const { token } = useAuth();
  const { mode } = useBearMode();
  const colors = loadCmsThemeColors();
  const calendarMode: CalendarMode = mode === 'dark' ? 'dark' : 'light';
  const [users, setUsers] = useState<CrewUser[]>([]);
  const [meetings, setMeetings] = useState<CalendarEvent[]>([]);
  const [draftTitle, setDraftTitle] = useState(CALENDAR_EMPTY);
  const [draftUserIds, setDraftUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;
    void Promise.all([fetchCrewUsers(token), fetchMeetings(token)]).then(
      ([nextUsers, nextMeetings]) => {
        if (nextUsers) setUsers(nextUsers);
        if (nextMeetings) setMeetings(toCalendarEvents(nextMeetings));
      },
    );
  }, [token]);

  const persistEvent = async (event: CalendarEvent) => {
    if (!token) return;
    const input = eventToInput(event);
    if (event.id && meetings.some((item) => item.id === event.id)) {
      const updated = await updateMeetingRequest(token, event.id, input);
      if (updated) {
        setMeetings((current) =>
          current.map((item) => (item.id === updated.id ? toCalendarEvents([updated])[0] : item)),
        );
      }
      return;
    }
    const created = await createMeetingRequest(token, input);
    if (created) {
      setMeetings((current) => [...current, ...toCalendarEvents([created])]);
    }
  };

  const toggleUser = (id: string) => {
    setDraftUserIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const onGenerate = async () => {
    if (!token || !draftTitle.trim()) return;
    const start = new Date();
    const created = await createMeetingRequest(token, {
      title: draftTitle.trim(),
      description: EMPTY_STRING,
      startAt: start.toISOString(),
      endAt: new Date(start.getTime() + CALENDAR_DEFAULT_DURATION_MS).toISOString(),
      meetingUrl: EMPTY_STRING,
      peopleIds: draftUserIds,
    });
    if (created) {
      setMeetings((current) => [...current, ...toCalendarEvents([created])]);
      setDraftTitle(CALENDAR_EMPTY);
      setDraftUserIds([]);
    }
  };

  const people = toCalendarPeople(users);
  const rows: MeetingRow[] = meetings.map((meeting) => ({
    id: meeting.id,
    title: meeting.title,
    start: new Date(meeting.start).toLocaleString(),
    people: (meeting.peopleIds ?? []).length,
  }));
  const accent = colors.accent || colors.primary;
  const calendarTheme = calendarThemeFrom(accent, calendarMode);
  const columns = [
    { id: CALENDAR_COL_TITLE, header: t.cmsCalendar.titleLabel, accessor: CALENDAR_COL_TITLE },
    { id: CALENDAR_COL_START, header: t.cmsCalendar.start, accessor: CALENDAR_COL_START },
    { id: CALENDAR_COL_PEOPLE, header: t.cmsCalendar.taggedUsers, accessor: CALENDAR_COL_PEOPLE },
  ];

  return {
    t,
    users,
    meetings,
    draftTitle,
    setDraftTitle,
    draftUserIds,
    people,
    rows,
    calendarMode,
    calendarTheme,
    columns,
    persistEvent,
    toggleUser,
    onGenerate,
  };
};
