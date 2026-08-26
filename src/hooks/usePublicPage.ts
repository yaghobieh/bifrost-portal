import { useEffect, useState } from 'react';
import { fetchPublicPage } from '@data/page.api';
import type { CmsPageItem } from '@data/pages.types';
import type { UsePublicPageResult } from './usePublicPage.types';

export const usePublicPage = (slug: string): UsePublicPageResult => {
  const [item, setItem] = useState<CmsPageItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setItem(null);
    fetchPublicPage(slug)
      .then((next) => {
        if (!active) {
          return;
        }
        setItem(next);
        setLoading(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { item, loading };
};
