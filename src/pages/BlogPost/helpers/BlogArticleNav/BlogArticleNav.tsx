import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { BlogArticleNavProps } from '../../BlogPost.types';

export const BlogArticleNav: FC<BlogArticleNavProps> = (props) => {
  const {
    post,
    previousLabel,
    nextLabel,
    previousTitle,
    nextTitle,
    previousHref,
    nextHref,
    onOpen,
  } = props;
  const openPrev = () => {
    if (onOpen && post.prevSlug) {
      onOpen(post.prevSlug);
    }
  };
  const openNext = () => {
    if (onOpen && post.nextSlug) {
      onOpen(post.nextSlug);
    }
  };
  return (
    <>
      {post.tags.length > NUMBER_ZERO && (
        <div className="Bl-blog__tags">
          {post.tags.map((tag) => (
            <span key={tag} className="Bl-blog__tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="Bl-blog__art-nav">
        {previousTitle && onOpen && (
          <button type="button" className="Bl-blog__afn" onClick={openPrev}>
            <div className="Bl-blog__afn-lbl">{previousLabel}</div>
            <div className="Bl-blog__afn-title">{previousTitle}</div>
          </button>
        )}
        {previousTitle && !onOpen && (
          <Link to={previousHref} className="Bl-blog__afn">
            <div className="Bl-blog__afn-lbl">{previousLabel}</div>
            <div className="Bl-blog__afn-title">{previousTitle}</div>
          </Link>
        )}
        {nextTitle && onOpen && (
          <button type="button" className="Bl-blog__afn Bl-blog__afn--next" onClick={openNext}>
            <div className="Bl-blog__afn-lbl">{nextLabel}</div>
            <div className="Bl-blog__afn-title">{nextTitle}</div>
          </button>
        )}
        {nextTitle && !onOpen && (
          <Link to={nextHref} className="Bl-blog__afn Bl-blog__afn--next">
            <div className="Bl-blog__afn-lbl">{nextLabel}</div>
            <div className="Bl-blog__afn-title">{nextTitle}</div>
          </Link>
        )}
      </div>
    </>
  );
};
