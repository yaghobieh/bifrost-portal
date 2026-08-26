export type CmsMeeting = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  meetingUrl: string;
  createdBy: string;
  peopleIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type CmsMeetingInput = {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  meetingUrl: string;
  peopleIds: string[];
};

export type CmsMeetingListResponse = {
  meetings?: CmsMeeting[];
};

export type CmsMeetingResponse = {
  meeting?: CmsMeeting;
};
