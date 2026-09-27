import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { NUMBER_ZERO } from '@const/numbers.const';
import { padRank } from '../../BlogIndex.utils';
import type { BlogViewedListProps } from './BlogViewedList.types';

const EyeIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path
      d="M1.5 8C1.5 8 4.5 3 8 3C11.5 3 14.5 8 14.5 8C14.5 8 11.5 13 8 13C4.5 13 1.5 8 1.5 8Z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const BlogViewedList: FC<BlogViewedListProps> = (props) => {
  const { posts, empty, onOpen } = props;
  if (posts.length === NUMBER_ZERO) {
    return <p className="Bl-blog__empty">{empty}</p>;
  }
  return (
    <div className="Bl-blog__viewed">
      {posts.map((post, index) => {
        const inner = (
          <>
            <span className="Bl-blog__rank">{padRank(index)}</span>
            <span className="Bl-blog__viewed-title">{post.title}</span>
            <span className="Bl-blog__viewed-views">
              <EyeIcon />
              {post.viewsShort}
            </span>
          </>
        );
        if (onOpen) {
          return (
            <button
              key={post.id}
              type="button"
              className="Bl-blog__viewed-row Bl-blog__viewed-row--btn"
              onClick={() => onOpen(post.slug)}
            >
              {inner}
            </button>
          );
        }
        return (
          <Link key={post.id} to={post.href} className="Bl-blog__viewed-row">
            {inner}
          </Link>
        );
      })}
    </div>
  );
};
