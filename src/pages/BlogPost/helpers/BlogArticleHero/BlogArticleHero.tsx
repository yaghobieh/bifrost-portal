import type { FC } from 'react';
import { MIDDLE_DOT } from '@const/strings.const';
import { BLOG_CRUMB_SEP } from '@pages/BlogIndex/BlogIndex.const';
import type { BlogArticleHeroProps } from '../../BlogPost.types';

export const BlogArticleHero: FC<BlogArticleHeroProps> = (props) => {
  const { post, blogLabel, categoryLabel, readLabel } = props;
  const avClass = `Bl-blog__av Bl-blog__av--lg Bl-blog__av--${post.avatarTone}`;
  return (
    <>
      <p className="Bl-blog__crumb">
        {blogLabel}
        {BLOG_CRUMB_SEP}
        {categoryLabel}
        {BLOG_CRUMB_SEP}
        <b>{post.title}</b>
      </p>
      <div className="Bl-blog__art-cover" />
      <span className="Bl-blog__tag">{categoryLabel}</span>
      <h1 className="Bl-blog__art-title">{post.title}</h1>
      <div className="Bl-blog__art-meta">
        <span className={avClass}>{post.initials}</span>
        <div>
          <div className="Bl-blog__meta-name">{post.author}</div>
          <div className="Bl-blog__art-sub">
            {post.dateLabel}
            {MIDDLE_DOT}
            {readLabel}
          </div>
        </div>
      </div>
    </>
  );
};
