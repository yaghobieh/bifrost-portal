import type { FC } from 'react';
import { Link } from '@forgedevstack/forge-compass/react';
import { Button, Flex, Typography } from '@forgedevstack/bear';
import { NUMBER_ZERO } from '@const/numbers.const';
import type { BlogCubesProps } from './BlogCubes.types';

export const BlogCubes: FC<BlogCubesProps> = (props) => {
  const { posts, copied, empty, viewsLabel, shareLabel, copiedLabel, onShare } = props;
  if (posts.length === NUMBER_ZERO) {
    return <Typography variant="body2">{empty}</Typography>;
  }
  return (
    <div className="Bl-blog__cubes">
      {posts.map((post) => (
        <article key={post.id} className="Bl-blog__cube">
          <Link to={post.href} className="Bl-blog__cube-link">
            <Typography variant="h4">{post.title}</Typography>
            <Typography variant="body2">{post.excerpt}</Typography>
          </Link>
          <Flex justify="between" align="center" gap={2}>
            <Typography variant="caption">
              {viewsLabel.replace('{count}', String(post.views))}
            </Typography>
            <Button size="sm" variant="outline" onClick={() => void onShare(post.href)}>
              {copied === post.href ? copiedLabel : shareLabel}
            </Button>
          </Flex>
        </article>
      ))}
    </div>
  );
};
