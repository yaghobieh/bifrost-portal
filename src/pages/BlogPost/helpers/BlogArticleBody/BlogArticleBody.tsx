import type { FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { BLOG_SEED_MARKETING } from '@pages/BlogIndex/BlogIndex.const';
import {
  BLOG_ARTICLE_CODE_FROM,
  BLOG_ARTICLE_CODE_IMPORT,
  BLOG_ARTICLE_CODE_LANG,
  BLOG_ARTICLE_CODE_PAGE_ATTR,
  BLOG_ARTICLE_CODE_PATTERN,
  BLOG_ARTICLE_CODE_PATTERN_ATTR,
  BLOG_ARTICLE_CODE_PKG,
  BLOG_ARTICLE_COMPONENT,
} from '../../BlogPost.const';
import type { BlogArticleBodyProps } from '../../BlogPost.types';

const CalloutIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 5.5V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="11.2" r="0.7" fill="currentColor" />
  </svg>
);

export const BlogArticleBody: FC<BlogArticleBodyProps> = (props) => {
  const { post } = props;
  const { t } = useLingo();
  if (post.seedId === BLOG_SEED_MARKETING) {
    return (
      <div className="Bl-blog__art-body">
        <p className="Bl-blog__art-p">{t('blog.posts.marketing.p1')}</p>
        <h2 className="Bl-blog__art-h2">{t('blog.posts.marketing.hWhy')}</h2>
        <p className="Bl-blog__art-p">{t('blog.posts.marketing.pWhy')}</p>
        <div className="Bl-blog__callout">
          <CalloutIcon />
          <p>
            <b>{t('blog.posts.marketing.calloutLead')}</b> {t('blog.posts.marketing.calloutBody')}
          </p>
        </div>
        <h2 className="Bl-blog__art-h2">{t('blog.posts.marketing.hWire')}</h2>
        <p className="Bl-blog__art-p">
          {t('blog.posts.marketing.pWireBefore')}{' '}
          <code>{t('blog.posts.marketing.reuseVia')}</code>{' '}
          {t('blog.posts.marketing.pWireAfter')}
        </p>
        <div className="Bl-blog__code">
          <div className="Bl-blog__code-head">{BLOG_ARTICLE_CODE_LANG}</div>
          <pre>
            <span className="Bl-blog__tkw">{BLOG_ARTICLE_CODE_IMPORT}</span>
            {` { ${BLOG_ARTICLE_COMPONENT} } `}
            <span className="Bl-blog__tkw">{BLOG_ARTICLE_CODE_FROM}</span>{' '}
            <span className="Bl-blog__tst">{BLOG_ARTICLE_CODE_PKG}</span>
            {`;\n\n`}
            <span className="Bl-blog__tfn">{`<${BLOG_ARTICLE_COMPONENT}`}</span>
            {` ${BLOG_ARTICLE_CODE_PATTERN_ATTR}`}
            <span className="Bl-blog__tst">{BLOG_ARTICLE_CODE_PATTERN}</span>
            {` ${BLOG_ARTICLE_CODE_PAGE_ATTR} `}
            <span className="Bl-blog__tfn">{'/>'}</span>
          </pre>
        </div>
        <p className="Bl-blog__art-p">{t('blog.posts.marketing.pClose')}</p>
      </div>
    );
  }
  if (post.bodyHtml) {
    return <article className="Bl-blog__art-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />;
  }
  return <p className="Bl-blog__art-p">{post.excerpt}</p>;
};
