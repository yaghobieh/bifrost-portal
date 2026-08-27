import type { FC } from 'react';
import { Avatar, Badge, BearIcons, Button, Flex, Input, Select, Typography } from '@forgedevstack/bear';
import { CMS_AVATAR_INITIALS_LENGTH, CMS_ICON_SIZE, NUMBER_ZERO } from '@const/numbers.const';
import { CMS_KEY_ENTER } from '@pages/Cms/CmsShell/CmsShell.const';
import { isChatPresent, readPresenceStatus } from '@pages/Cms/CmsShell/CmsLive.utils';
import { CREW_JUMP_INPUT_ID, CREW_NEW_ROOM_INPUT_ID } from '@pages/Cms/CmsShell/CmsCrewChat/CmsCrewChat.const';
import type { CrewChatSidebarProps } from '@pages/Cms/CmsShell/CmsCrewChat/CmsCrewChat.types';
import {
  initialsFromName,
  lastMessageMine,
  lastMessagePreview,
  matchesJump,
  trailingOtherCount,
} from '@pages/Cms/CmsShell/CmsCrewChat/CmsCrewChat.utils';
import { CREW_STATUS_SELECT_ID } from './CrewChatSidebar.const';
import { crewDotClass, crewItemClass, crewPresenceCopy, crewStatusOptions, crewUnreadCount } from './CrewChatSidebar.utils';

export const CrewChatSidebar: FC<CrewChatSidebarProps> = (props) => {
  const {
    title,
    jumpQuery,
    jumpPlaceholder,
    channelsLabel,
    directLabel,
    newRoomLabel,
    newRoomOpen,
    newRoomValue,
    hashPrefix,
    channels,
    directRooms,
    leftoverPeople,
    people,
    selectedPeopleIds,
    createRoomLabel,
    addPeopleLabel,
    emptyPeopleLabel,
    roomsEmptyLabel,
    activeRoomId,
    currentUserId,
    onlineUsers,
    emptyPreview,
    onlineLabel,
    offlineLabel,
    statusOnlineLabel,
    statusAwayLabel,
    statusBusyLabel,
    statusNotThereLabel,
    availability,
    onAvailability,
    onJump,
    onToggleNewRoom,
    onNewRoomChange,
    onTogglePerson,
    onCreateRoom,
    onOpenChannel,
    onOpenRoom,
    onOpenUser,
    roomTitleFor,
  } = props;
  const visibleChannels = channels.filter((row) => matchesJump(row.tag, jumpQuery));
  const visibleRooms = directRooms.filter((room) => matchesJump(roomTitleFor(room), jumpQuery));
  const visiblePeople = leftoverPeople.filter((person) => matchesJump(person.name, jumpQuery));
  const statusOptions = crewStatusOptions({
    online: statusOnlineLabel,
    away: statusAwayLabel,
    busy: statusBusyLabel,
    notThere: statusNotThereLabel,
  });

  return (
    <Flex direction="column" gap={2} className="bifrost-cms-crew__nav">
      <Flex align="center" justify="between" gap={2}>
        <Typography variant="h4" className="mb-0">
          {title}
        </Typography>
        <Button size="sm" variant="ghost" onClick={onToggleNewRoom} aria-label={newRoomLabel}>
          <BearIcons.PlusIcon size={CMS_ICON_SIZE} />
        </Button>
      </Flex>
      <Select
        id={CREW_STATUS_SELECT_ID}
        size="sm"
        fullWidth
        value={availability}
        options={statusOptions}
        onChange={(value) => onAvailability(readPresenceStatus(value))}
      />
      {newRoomOpen && (
        <Flex direction="column" gap={2} className="bifrost-cms-crew__create">
          <Input
            id={CREW_NEW_ROOM_INPUT_ID}
            value={newRoomValue}
            placeholder={newRoomLabel}
            size="sm"
            fullWidth
            onChange={(event) => onNewRoomChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== CMS_KEY_ENTER) {
                return;
              }
              event.preventDefault();
              onCreateRoom();
            }}
          />
          <Typography variant="caption" className="bifrost-cms-crew__section mb-0">
            {addPeopleLabel}
          </Typography>
          {people.length === NUMBER_ZERO ? (
            <Typography variant="caption" className="bifrost-cms__muted mb-0">
              {emptyPeopleLabel}
            </Typography>
          ) : (
            <Flex wrap="wrap" gap={1}>
              {people.map((person) => {
                const selected = selectedPeopleIds.includes(person.id);
                return (
                  <Button
                    key={person.id}
                    type="button"
                    size="sm"
                    variant={selected ? 'ink' : 'outline'}
                    onClick={() => onTogglePerson(person.id)}
                  >
                    {person.name}
                  </Button>
                );
              })}
            </Flex>
          )}
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={onCreateRoom}
            disabled={!newRoomValue.trim()}
          >
            {createRoomLabel}
          </Button>
        </Flex>
      )}
      <Input
        id={CREW_JUMP_INPUT_ID}
        value={jumpQuery}
        placeholder={jumpPlaceholder}
        size="sm"
        fullWidth
        prefix={<BearIcons.SearchIcon size={CMS_ICON_SIZE} />}
        onChange={(event) => onJump(event.target.value)}
      />
      <Typography variant="caption" className="bifrost-cms-crew__section mb-0">
        {channelsLabel}
      </Typography>
      <Flex direction="column" gap={1}>
        {visibleChannels.map((row) => {
          const active = Boolean(row.room && row.room.id === activeRoomId);
          let channelUnread = NUMBER_ZERO;
          if (row.room) {
            channelUnread = trailingOtherCount(row.room, currentUserId);
          }
          const unread = crewUnreadCount({
            active,
            count: channelUnread,
          });
          return (
            <Button
              key={row.tag}
              type="button"
              variant="ghost"
              className={crewItemClass({ active, person: false })}
              onClick={() => onOpenChannel(row.tag)}
            >
              <Flex align="center" justify="between" gap={2} className="bifrost-cms-crew__item-inner">
                <Typography variant="body2" className="mb-0">
                  {hashPrefix}
                  {row.tag}
                </Typography>
                {unread > NUMBER_ZERO && <Badge variant="info">{unread}</Badge>}
              </Flex>
            </Button>
          );
        })}
        {visibleChannels.length === NUMBER_ZERO && (
          <Typography variant="caption" className="bifrost-cms__muted mb-0">
            {roomsEmptyLabel}
          </Typography>
        )}
      </Flex>
      <Typography variant="caption" className="bifrost-cms-crew__section mb-0">
        {directLabel}
      </Typography>
      <Flex direction="column" gap={1}>
        {visibleRooms.map((room) => {
          const name = roomTitleFor(room);
          const live = room.userIds.some(
            (id) => id !== currentUserId && onlineUsers.some((user) => user.id === id && isChatPresent(user)),
          );
          const sent = lastMessageMine(room, currentUserId);
          const active = room.id === activeRoomId;
          const unread = crewUnreadCount({
            active,
            count: trailingOtherCount(room, currentUserId),
          });
          return (
            <Button
              key={room.id}
              type="button"
              variant="ghost"
              className={crewItemClass({ active, person: true })}
              onClick={() => onOpenRoom(room.id)}
            >
              <Flex align="center" gap={2} className="bifrost-cms-crew__item-inner">
                <Flex className="bifrost-cms-crew__avatar-wrap">
                  <Avatar initials={initialsFromName(name, CMS_AVATAR_INITIALS_LENGTH)} size="sm" />
                  <Flex className={crewDotClass(live)} />
                </Flex>
                <Flex direction="column" className="bifrost-cms-crew__person-copy">
                  <Typography variant="body2" className="mb-0">
                    {name}
                  </Typography>
                  <Typography variant="caption" className="bifrost-cms__muted mb-0">
                    {lastMessagePreview(room) || emptyPreview}
                  </Typography>
                </Flex>
                {sent && <BearIcons.CheckIcon size={CMS_ICON_SIZE} />}
                {unread > NUMBER_ZERO && <Badge variant="info">{unread}</Badge>}
              </Flex>
            </Button>
          );
        })}
        {visiblePeople.map((person) => (
          <Button
            key={person.id}
            type="button"
            variant="ghost"
            className={crewItemClass({ active: false, person: true })}
            onClick={() => onOpenUser(person.id)}
          >
            <Flex align="center" gap={2} className="bifrost-cms-crew__item-inner">
              <Flex className="bifrost-cms-crew__avatar-wrap">
                <Avatar initials={initialsFromName(person.name, CMS_AVATAR_INITIALS_LENGTH)} size="sm" />
                <Flex className={crewDotClass(person.online)} />
              </Flex>
              <Flex direction="column" className="bifrost-cms-crew__person-copy">
                <Typography variant="body2" className="mb-0">
                  {person.name}
                </Typography>
                <Typography variant="caption" className="bifrost-cms__muted mb-0">
                  {crewPresenceCopy({
                    online: person.online,
                    onlineLabel,
                    offlineLabel,
                  })}
                </Typography>
              </Flex>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};
