import { useEffect, useState, type FC } from 'react';
import { useParams } from '@forgedevstack/forge-compass/react';
import { useLingo } from '@forgedevstack/lingo';
import { PortalNav } from '@components/PortalNav';
import { PUBLIC_NAV_IDS, ROUTES } from '@const/routes.const';
import { EMPTY_STRING } from '@const/strings.const';
import { fetchPublicBlogPost, fetchPublicBlogPosts } from '@data/blog.api';
import { fetchPublicNav } from '@components/PortalNav/PortalNav.utils';
import {
  attachNeighbors,
  categoryLabel,
  findPostBySlug,
  hydrateSeedPosts,
  mapLivePost,
} from '@pages/BlogIndex/BlogIndex.utils';
import type { PublicBlogPost } from '@pages/BlogIndex/BlogIndex.types';
import { NUMBER_ZERO } from '@const/numbers.const';
import { neighborHref, neighborOf, neighborTitle } from './BlogPost.utils';
import type { BlogPostProps } from './BlogPost.types';
import { BlogArticleHero } from './helpers/BlogArticleHero';
import { BlogArticleBody } from './helpers/BlogArticleBody';
import { BlogArticleNav } from './helpers/BlogArticleNav';

export const BlogPostPage: FC<BlogPostProps> = (props) => {
  const { embedded, previewSlug, onOpenPost } = props;
  const { t } = useLingo();
  const params = useParams<{ slug?: string }>();
  const routeSlug = params.slug || EMPTY_STRING;
  const slug = previewSlug || routeSlug;
  const [live, setLive] = useState<PublicBlogPost | null>(null);
  const [feed, setFeed] = useState<PublicBlogPost[]>([]);

  const seed = hydrateSeedPosts({
    translate: t,
    blogPath: ROUTES.BLOG,
    viewsTemplate: t('blog.views'),
  });
  const seeded = findPostBySlug(attachNeighbors(seed), slug);

  useEffect(() => {
    if (previewSlug) {
      return;
    }
    if (!slug) {
      return;
    }
    void Promise.all([fetchPublicNav(), fetchPublicBlogPost(slug), fetchPublicBlogPosts()]).then(
      ([chrome, item, items]) => {
        const mapped = items.map((entry, index) =>
          mapLivePost({
            item: entry,
            blogPath: chrome.blogPath,
            viewsTemplate: t('blog.views'),
            index,
          }),
        );
        const withNeighbors = attachNeighbors(mapped);
        setFeed(withNeighbors);
        if (!item) {
          setLive(null);
          return;
        }
        const fromFeed = findPostBySlug(withNeighbors, item.slug);
        if (fromFeed) {
          setLive(fromFeed);
          return;
        }
        setLive(
          mapLivePost({
            item,
            blogPath: chrome.blogPath,
            viewsTemplate: t('blog.views'),
            index: NUMBER_ZERO,
          }),
        );
      },
    );
  }, [previewSlug, slug, t]);

  const post = previewSlug ? seeded : live;
  const neighbors = previewSlug ? attachNeighbors(seed) : feed;
  const previous = post ? neighborOf(neighbors, post.prevSlug) : null;
  const next = post ? neighborOf(neighbors, post.nextSlug) : null;

  const article = !post ? (
    <>
      <PortalNav showProductLink activeId={PUBLIC_NAV_IDS.BLOG} />
      <main className="Bl-blog Bl-blog--post">
        <h1 className="Bl-blog__art-title">{t('blog.empty')}</h1>
      </main>
    </>
  ) : (
    <>
      <PortalNav showProductLink activeId={PUBLIC_NAV_IDS.BLOG} />
      <main className="Bl-blog Bl-blog--post">
        <BlogArticleHero
          post={post}
          blogLabel={t('nav.blog')}
          categoryLabel={categoryLabel(t, post.category)}
          readLabel={t('blog.readTime').replace('{count}', String(post.readMins))}
        />
        <BlogArticleBody post={post} />
        <BlogArticleNav
          post={post}
          previousLabel={t('blog.previous')}
          nextLabel={t('blog.next')}
          previousTitle={neighborTitle(previous)}
          nextTitle={neighborTitle(next)}
          previousHref={neighborHref(previous)}
          nextHref={neighborHref(next)}
          onOpen={onOpenPost}
        />
      </main>
    </>
  );

  if (embedded) {
    return article;
  }
  return <div className="Bl">{article}</div>;
};

export const BlogPost: FC = () => <BlogPostPage />;
