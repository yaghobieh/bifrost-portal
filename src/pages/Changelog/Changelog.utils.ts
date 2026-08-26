import type { CmsPageItem } from '@data/pages.types';
import { mapSitePage } from '@data/pages.mapper';
import type { ChangelogPageModel } from './Changelog.types';

export const changelogFromItem = (item: CmsPageItem | null): ChangelogPageModel | null => {
  if (!item) {
    return null;
  }
  const page = mapSitePage(item.slug, item.title, item.payload);
  return {
    title: page.title,
    lead: page.lead,
    body: page.body,
  };
};
