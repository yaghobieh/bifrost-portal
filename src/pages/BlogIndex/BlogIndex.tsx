import { useEffect, useState, type FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { Typography } from '@forgedevstack/bear';
import { PortalNav } from '@components/PortalNav';
import { ROUTES } from '@const/routes.const';
import { EMPTY_STRING } from '@const/strings.const';
import { fetchPublicBlogPosts } from '@data/blog.api';
import { fetchPublicNav } from '@components/PortalNav/PortalNav.utils';
import { BlogCubes } from './helpers/BlogCubes';
import { toBlogCube } from './BlogIndex.utils';
import type { BlogCubePost } from './BlogIndex.types';

export const BlogIndex: FC = () => {
  const { t } = useLingo();
  const [newest, setNewest] = useState<BlogCubePost[]>([]);
  const [viewed, setViewed] = useState<BlogCubePost[]>([]);
  const [copied, setCopied] = useState(EMPTY_STRING);

  useEffect(() => {
    void Promise.all([fetchPublicNav(), fetchPublicBlogPosts()]).then(([chrome, items]) => {
      const cubes = items.map((item) => toBlogCube(item, chrome.blogPath));
      setNewest(
        [...cubes].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
      );
      setViewed([...cubes].sort((left, right) => right.views - left.views));
    });
  }, []);

  const onShare = async (href: string) => {
    const url = `${window.location.origin}${href}`;
    if (navigator.share) {
      await navigator.share({ url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(href);
  };

  return (
    <div className="Bl">
      <PortalNav showProductLink />
      <main className="Bl-blog">
        <Typography variant="h1">{t('blog.title')}</Typography>
        <section className="Bl-blog__section">
          <Typography variant="h2">{t('blog.newest')}</Typography>
          <BlogCubes
            posts={newest}
            copied={copied}
            onShare={onShare}
            empty={t('blog.empty')}
            viewsLabel={t('blog.views')}
            shareLabel={t('blog.share')}
            copiedLabel={t('blog.shareCopied')}
          />
        </section>
        <section className="Bl-blog__section">
          <Typography variant="h2">{t('blog.mostViewed')}</Typography>
          <BlogCubes
            posts={viewed}
            copied={copied}
            onShare={onShare}
            empty={t('blog.empty')}
            viewsLabel={t('blog.views')}
            shareLabel={t('blog.share')}
            copiedLabel={t('blog.shareCopied')}
          />
        </section>
      </main>
    </div>
  );
};
