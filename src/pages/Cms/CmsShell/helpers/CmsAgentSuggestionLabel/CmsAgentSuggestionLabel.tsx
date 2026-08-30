import { AGENT_TEMPLATE_IDS } from '../../cmsAgent.const';
import type { CmsAgentSuggestionLabelParams } from './CmsAgentSuggestionLabel.types';

export const cmsAgentSuggestionLabel = (params: CmsAgentSuggestionLabelParams): string => {
  const { id, t } = params;
  const labels: Record<string, string> = {
    [AGENT_TEMPLATE_IDS.LANDING]: t.cmsShell.agentSuggestLanding,
    [AGENT_TEMPLATE_IDS.DOCS]: t.cmsShell.agentSuggestDocs,
    [AGENT_TEMPLATE_IDS.BLANK]: t.cmsShell.agentSuggestBlank,
  };
  const label = labels[id];
  if (label) {
    return label;
  }
  return id;
};
