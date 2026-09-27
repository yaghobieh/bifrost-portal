import type { FC, ReactNode } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { PublicBlogPost } from '../../BlogIndex.types';
import type { BlogPostGridProps } from './BlogPostGrid.types';

const CardInner = (props: { post: PublicBlogPost; categoryLabel: string }): ReactNode => {
  const { post, categoryLabel } = props;
  const coverClass = `Bl-blog__card-cover Bl-blog__cover--${post.coverTone}`;
  const avClass = `Bl-blog__av Bl-blog__av--sm Bl-blog__av--${post.avatarTone}`;
  return (
    <>
      <div className={coverClass} />
      <span className="Bl-blog__card-tag">{categoryLabel}</span>
      <h3 className="Bl-blog__card-title">{post.title}</h3>
      <p className="Bl-blog__card-excerpt">{post.excerpt}</p>
      <div className="Bl-blog__meta">
        <span className={avClass}>{post.initials}</span>
        <span className="Bl-blog__meta-name">{post.author}</span>
        <span className="Bl-blog__dot" />
        <span className="Bl-blog__meta-date">{post.dateShort}</span>
      </div>
    </>
  );
};

export const BlogPostGrid: FC<BlogPostGridProps> = (props) => {
  const { posts, empty, labelFor, onOpen } = props;
  if (posts.length === NUMBER_ZERO) {
    return <p className="Bl-blog__empty">{empty}</p>;
  }
  return (
    <div className="Bl-blog__grid">
      {posts.map((post) => {
        if (onOpen) {
          return (
            <button
              key={post.id}
              type="button"
              className="Bl-blog__card Bl-blog__card--btn"
              onClick={() => onOpen(post.slug)}
            >
              <CardInner post={post} categoryLabel={labelFor(post.category)} />
            </button>
          );
        }
        return (
          <Link key={post.id} to={post.href} className="Bl-blog__card">
            <CardInner post={post} categoryLabel={labelFor(post.category)} />
          </Link>
        );
      })}
    </div>
  );
};
