import type { DocPageModel } from '@data/docs.types';
import { NUMBER_THREE, NUMBER_ZERO } from '@const/numbers.const';
import { ASK_AI_EMPTY } from '@const/strings.const';
import { fetchPublicDoc } from '@data/page.api';
import { searchNav } from '@data/docs.data';

const formatDoc = (doc: DocPageModel): string => {
  const first = doc.sections[NUMBER_ZERO];
  return `${doc.title}\n${doc.lead}\n${first?.paragraphs[NUMBER_ZERO] ?? ''}`;
};

export const answerFromNav = async (
  question: string,
  titleOf: (key: string) => string,
  signal?: AbortSignal,
): Promise<string> => {
  const hits = searchNav(question, titleOf);
  if (!hits.length) {
    return ASK_AI_EMPTY;
  }
  const picked = hits.slice(NUMBER_ZERO, NUMBER_THREE);
  const docs = await Promise.all(
    picked.map(async (hit) => {
      try {
        return await fetchPublicDoc(hit.slug, signal);
      } catch {
        return null;
      }
    }),
  );
  const parts = docs.filter((doc): doc is DocPageModel => Boolean(doc)).map(formatDoc);
  if (!parts.length) {
    return ASK_AI_EMPTY;
  }
  return parts.join('\n\n');
};
