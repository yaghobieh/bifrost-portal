import type { DocPageModel } from '@data/docs.types';
import { NUMBER_THREE, NUMBER_ZERO } from '@const/numbers.const';
import { ASK_AI_EMPTY } from '@const/strings.const';
import { searchDocs } from '@data/docs.data';

export const answerFromDocs = (
  question: string,
  docsBySlug: Record<string, DocPageModel>,
): string => {
  const hits = searchDocs(docsBySlug, question);
  if (!hits.length) {
    return ASK_AI_EMPTY;
  }
  const parts = hits.slice(NUMBER_ZERO, NUMBER_THREE).map((hit) => {
    const doc = docsBySlug[hit.slug];
    const first = doc.sections[NUMBER_ZERO];
    return `${doc.title}\n${doc.lead}\n${first?.paragraphs[NUMBER_ZERO] ?? ''}`;
  });
  return parts.join('\n\n');
};
