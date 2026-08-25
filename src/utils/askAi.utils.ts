import { DOC_PAGES, searchDocs } from '@data/docs.data';

export const answerFromDocs = (question: string): string => {
  const hits = searchDocs(question);
  if (!hits.length) {
    return 'No matching docs yet. Try installation, MCP, plugins, Cloud or local, agents, or the API Explorer.';
  }
  const parts = hits.slice(0, 3).map((hit) => {
    const doc = DOC_PAGES[hit.slug];
    const first = doc.sections[0];
    return `${doc.title}\n${doc.lead}\n${first?.paragraphs[0] ?? ''}`;
  });
  return parts.join('\n\n');
};
