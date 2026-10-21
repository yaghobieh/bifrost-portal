import { useEffect, useState, type FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { PortalNav } from '@components/PortalNav';
import { PUBLIC_NAV_IDS, ROUTES } from '@const/routes.const';
import { EMPTY_STRING } from '@const/strings.const';
import { fetchPublicBlogPosts } from '@data/blog.api';
import { fetchPublicNav } from '@components/PortalNav/PortalNav.utils';
import { BLOG_CHIP_IDS, BLOG_FILTER_ALL } from './BlogIndex.const';
import {
  attachNeighbors,
  categoryLabel,
  hydrateSeedPosts,
  mapLivePost,
  pickFeatured,
  pickNewest,
  pickViewed,
} from './BlogIndex.utils';
import type { BlogIndexProps, PublicBlogPost } from './BlogIndex.types';
import { BlogCategoryChips } from './helpers/BlogCategoryChips';
import { BlogFeaturedPost } from './helpers/BlogFeaturedPost';
import { BlogPostGrid } from './helpers/BlogPostGrid';
import { BlogViewedList } from './helpers/BlogViewedList';

export const BlogIndexPage: FC<BlogIndexProps> = (props) => {
  const { embedded, preview, onOpenPost } = props;
  const { t } = useLingo();
  const [live, setLive] = useState<PublicBlogPost[]>([]);
  const [category, setCategory] = useState(BLOG_FILTER_ALL);

  const seed = hydrateSeedPosts({
    translate: t,
    blogPath: ROUTES.BLOG,
    viewsTemplate: t('blog.views'),
  });

  useEffect(() => {
    if (preview) {
      return;
    }
    void Promise.all([fetchPublicNav(), fetchPublicBlogPosts()]).then(([chrome, items]) => {
      const mapped = items.map((item, index) =>
        mapLivePost({
          item,
          blogPath: chrome.blogPath,
          viewsTemplate: t('blog.views'),
          index,
        }),
      );
      setLive(attachNeighbors(mapped));
    });
  }, [preview, t]);

  const posts = preview ? seed : live;
  const featured = pickFeatured(posts, category);
  const featuredId = featured ? featured.id : EMPTY_STRING;
  const newest = pickNewest(posts, category, featuredId);
  const viewed = pickViewed(posts, category);
  const labelFor = (id: string) => categoryLabel(t, id);
  const readLabel = featured ? t('blog.readTime').replace('{count}', String(featured.readMins)) : EMPTY_STRING;

  const main = (
    <>
      <PortalNav showProductLink activeId={PUBLIC_NAV_IDS.BLOG} />
      <main className="Bl-blog">
        <header className="Bl-blog__header">
          <p className="Bl-blog__eyebrow">{t('blog.eyebrow')}</p>
          <h1 className="Bl-blog__title">{t('blog.title')}</h1>
          <p className="Bl-blog__lead">{t('blog.lead')}</p>
        </header>
        <BlogCategoryChips ids={BLOG_CHIP_IDS} active={category} labelFor={labelFor} onSelect={setCategory} />
        {featured && (
          <BlogFeaturedPost
            post={featured}
            brand={t('brand')}
            readLabel={readLabel}
            onOpen={onOpenPost}
          />
        )}
        <h2 className="Bl-blog__sec">{t('blog.newest')}</h2>
        <BlogPostGrid posts={newest} empty={t('blog.empty')} labelFor={labelFor} onOpen={onOpenPost} />
        <h2 className="Bl-blog__sec">{t('blog.mostViewed')}</h2>
        <BlogViewedList posts={viewed} empty={t('blog.empty')} onOpen={onOpenPost} />
      </main>
    </>
  );

  if (embedded) {
    return main;
  }
  return <div className="Bl">{main}</div>;
};

export const BlogIndex: FC = () => <BlogIndexPage />;
