import type { FC, ReactNode } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { MIDDLE_DOT } from '@const/strings.const';
import type { BlogFeaturedPostProps } from './BlogFeaturedPost.types';

const Meta = (props: { post: BlogFeaturedPostProps['post']; readLabel: string }): ReactNode => {
  const { post, readLabel } = props;
  const avClass = `Bl-blog__av Bl-blog__av--${post.avatarTone}`;
  return (
    <div className="Bl-blog__meta">
      <span className={avClass}>{post.initials}</span>
      <span className="Bl-blog__meta-name">{post.author}</span>
      <span className="Bl-blog__dot" />
      <span className="Bl-blog__meta-date">
        {post.dateLabel}
        {MIDDLE_DOT}
        {readLabel}
      </span>
    </div>
  );
};

const FeaturedInner = (props: BlogFeaturedPostProps): ReactNode => {
  const { post, brand, readLabel } = props;
  return (
    <>
      <div className="Bl-blog__cover Bl-blog__cover--featured">
        <span className="Bl-blog__cover-mark">{brand}</span>
      </div>
      <div>
        <span className="Bl-blog__tag">{post.category}</span>
        <h2 className="Bl-blog__featured-title">{post.title}</h2>
        <p className="Bl-blog__featured-excerpt">{post.excerpt}</p>
        <Meta post={post} readLabel={readLabel} />
      </div>
    </>
  );
};

export const BlogFeaturedPost: FC<BlogFeaturedPostProps> = (props) => {
  const { post, onOpen } = props;
  if (onOpen) {
    return (
      <button type="button" className="Bl-blog__featured Bl-blog__featured--btn" onClick={() => onOpen(post.slug)}>
        <FeaturedInner {...props} />
      </button>
    );
  }
  return (
    <Link to={post.href} className="Bl-blog__featured">
      <FeaturedInner {...props} />
    </Link>
  );
};
