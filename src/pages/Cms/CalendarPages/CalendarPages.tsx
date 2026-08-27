import type { FC } from 'react';
import { Calendar } from '@forgedevstack/calendar';
import { Button, Card, Dropdown, Flex, Input, Typography } from '@forgedevstack/bear';
import { CmsGridTable, CmsShell, CMS_NAV_IDS } from '@pages/Cms/CmsShell';
import {
  CALENDAR_PAGE_ID,
  CALENDAR_TITLE_INPUT_ID,
  CALENDAR_VIEW_WEEK,
} from './CalendarPages.const';
import { CalendarDraftUsers } from './helpers/CalendarDraftUsers';
import { useCalendarPages } from './hooks';

export const CalendarPages: FC = () => {
  const {
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
  } = useCalendarPages();

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.CALENDAR}>
      <Flex direction="column" gap={4} id={CALENDAR_PAGE_ID}>
        <Flex direction="column" gap={1}>
          <Typography variant="h2">{t.cmsCalendar.title}</Typography>
          <Typography variant="body2">{t.cmsCalendar.subtitle}</Typography>
        </Flex>
        <Card padding="md">
          <Flex direction="column" gap={2}>
            <Typography variant="h4">{t.cmsCalendar.generateMeeting}</Typography>
            <Typography variant="caption">{t.cmsCalendar.notifyHint}</Typography>
            <Flex gap={2} align="end" wrap="wrap">
              <Input
                id={CALENDAR_TITLE_INPUT_ID}
                label={t.cmsCalendar.titleLabel}
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
              />
              <Dropdown
                searchable
                closeOnSelect={false}
                placement="bottom-start"
                trigger={
                  <Button size="sm" variant="outline">
                    {t.cmsCalendar.addUser}
                  </Button>
                }
                items={users.map((user) => ({
                  key: user.id,
                  label: user.name || user.username || user.email,
                  selected: draftUserIds.includes(user.id),
                  onClick: () => toggleUser(user.id),
                }))}
              />
              <Button variant="primary" onClick={() => void onGenerate()} disabled={!draftTitle.trim()}>
                {t.cmsCalendar.create}
              </Button>
            </Flex>
            <CalendarDraftUsers ids={draftUserIds} users={users} />
          </Flex>
        </Card>
        <Card padding="md">
          <Calendar
            defaultView={CALENDAR_VIEW_WEEK}
            events={meetings}
            people={people}
            mode={calendarMode}
            theme={calendarTheme}
            onEventCreate={(event) => void persistEvent(event)}
            onEventChange={(event) => void persistEvent(event)}
            layout="contained"
          />
        </Card>
        <Card padding="md">
          <Flex direction="column" gap={2}>
            <Typography variant="h4">{t.cmsCalendar.meetings}</Typography>
            <CmsGridTable data={rows} columns={columns} emptyContent={t.cmsCalendar.empty} />
          </Flex>
        </Card>
      </Flex>
    </CmsShell>
  );
};
