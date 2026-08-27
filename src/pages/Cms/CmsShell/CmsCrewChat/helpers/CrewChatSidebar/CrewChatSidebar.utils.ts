import { NUMBER_ZERO } from '@const/numbers.const';
import {
  CMS_PRESENCE_AWAY,
  CMS_PRESENCE_BUSY,
  CMS_PRESENCE_NOT_THERE,
  CMS_PRESENCE_ONLINE,
} from '@pages/Cms/CmsShell/CmsLive.const';
import type { CrewStatusOption } from './CrewChatSidebar.types';

export const crewStatusOptions = (params: {
  online: string;
  away: string;
  busy: string;
  notThere: string;
}): CrewStatusOption[] => {
  const { online, away, busy, notThere } = params;
  return [
    { value: CMS_PRESENCE_ONLINE, label: online },
    { value: CMS_PRESENCE_AWAY, label: away },
    { value: CMS_PRESENCE_BUSY, label: busy },
    { value: CMS_PRESENCE_NOT_THERE, label: notThere },
  ];
};

export const crewItemClass = (params: { active: boolean; person: boolean }): string => {
  const { active, person } = params;
  let base = 'bifrost-cms-crew__item';
  if (person) {
    base = 'bifrost-cms-crew__item bifrost-cms-crew__person';
  }
  if (active) {
    return `${base} bifrost-cms-crew__item--active`;
  }
  return base;
};

export const crewDotClass = (on: boolean): string => {
  if (on) {
    return 'bifrost-cms-crew__dot bifrost-cms-crew__dot--on';
  }
  return 'bifrost-cms-crew__dot';
};

export const crewPresenceCopy = (params: { online: boolean; onlineLabel: string; offlineLabel: string }): string => {
  const { online, onlineLabel, offlineLabel } = params;
  if (online) {
    return onlineLabel;
  }
  return offlineLabel;
};

export const crewMessagePreview = (preview: string, empty: string): string => {
  if (preview) {
    return preview;
  }
  return empty;
};

export const crewPersonVariant = (selected: boolean): 'ink' | 'outline' => {
  if (selected) {
    return 'ink';
  }
  return 'outline';
};

export const crewUnreadCount = (params: { active: boolean; count: number }): number => {
  const { active, count } = params;
  if (active) {
    return NUMBER_ZERO;
  }
  return count;
};
