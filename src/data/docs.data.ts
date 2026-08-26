import { NAV_GROUPS } from '@const/nav.const';
import type { DocSearchHit } from './docs.types';

export const searchNav = (
  query: string,
  titleOf: (key: string) => string,
): DocSearchHit[] => {
  const items = NAV_GROUPS.flatMap((group) => group.items);
  const q = query.trim().toLowerCase();
  return items
    .filter((item) => {
      if (!q) return true;
      const title = titleOf(item.titleKey).toLowerCase();
      return title.includes(q) || item.slug.includes(q);
    })
    .map((item) => ({ slug: item.slug, title: titleOf(item.titleKey) }));
};
