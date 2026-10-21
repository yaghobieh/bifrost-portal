export type CmsChatRole = 'user' | 'assistant';

export type CmsChatAction = {
  action: 'create_page' | 'create_article' | 'update_content';
  data: Record<string, unknown>;
};

export type CmsChatUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type CmsChatMessage = {
  id: string;
  role: CmsChatRole;
  text: string;
  action?: CmsChatAction | null;
  usage?: CmsChatUsage | null;
  actionApplied?: boolean;
};

export type CmsChatCompleteResult = {
  ok: boolean;
  text: string;
  action?: CmsChatAction | null;
  usage?: CmsChatUsage | null;
  model?: string;
  status: number;
};

export type CmsChatProps = {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  side: 'left' | 'right';
  crewAvailable: boolean;
  onOpenCrew: () => void;
};
