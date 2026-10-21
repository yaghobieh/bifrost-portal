import { useState, type FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { BlogIndexPage } from '@pages/BlogIndex';
import { BlogPostPage } from '@pages/BlogPost';
import { StatusView } from '@pages/Status';
import { SEED_POSTS } from '@pages/BlogIndex/BlogIndex.const';
import { NUMBER_ZERO } from '@const/numbers.const';
import { DEMO_TAB } from './Demo.const';
import type { DemoTabId } from './Demo.types';
import { DemoTabs } from './helpers/DemoTabs';

export const Demo: FC = () => {
  const { t } = useLingo();
  const featuredSlug = SEED_POSTS[NUMBER_ZERO].slug;
  const [tab, setTab] = useState<DemoTabId>(DEMO_TAB.INDEX);
  const [articleSlug, setArticleSlug] = useState(featuredSlug);

  const onOpenPost = (slug: string) => {
    setArticleSlug(slug);
    setTab(DEMO_TAB.ARTICLE);
  };

  return (
    <div className="Bl">
      <DemoTabs
        active={tab}
        onSelect={setTab}
        labels={{
          [DEMO_TAB.INDEX]: t('demo.tabIndex'),
          [DEMO_TAB.ARTICLE]: t('demo.tabArticle'),
          [DEMO_TAB.STATUS]: t('demo.tabStatus'),
        }}
      />
      {tab === DEMO_TAB.INDEX && <BlogIndexPage embedded preview onOpenPost={onOpenPost} />}
      {tab === DEMO_TAB.ARTICLE && (
        <BlogPostPage embedded previewSlug={articleSlug} onOpenPost={onOpenPost} />
      )}
      {tab === DEMO_TAB.STATUS && <StatusView embedded />}
    </div>
  );
};
