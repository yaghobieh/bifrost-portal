import type { FC } from 'react';
import { Card, Flex, Typography } from '@forgedevstack/bear';
import type { ContentTemplateCubesProps } from './ContentTemplateCubes.types';

export const ContentTemplateCubes: FC<ContentTemplateCubesProps> = (props) => {
  const { cubes, onSelect } = props;
  return (
    <div className="bifrost-cms-template-cubes">
      {cubes.map((cube) => (
        <button
          key={cube.kind}
          type="button"
          className="bifrost-cms-template-cubes__hit"
          onClick={() => onSelect(cube.kind)}
        >
          <Card padding="md" className="bifrost-cms-template-cubes__card">
            <Flex direction="column" gap={2} className="bifrost-cms-page-start__inner">
              <Typography variant="h3" className="bifrost-cms-template-cubes__count mb-0">
                {cube.count}
              </Typography>
              <Typography variant="h4" className="mb-0">
                {cube.title}
              </Typography>
              <Typography variant="caption" className="bifrost-cms__muted mb-0">
                {cube.countLabel}
              </Typography>
            </Flex>
          </Card>
        </button>
      ))}
    </div>
  );
};
