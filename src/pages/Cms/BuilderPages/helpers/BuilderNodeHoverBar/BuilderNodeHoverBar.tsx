import type { FC, MouseEvent } from 'react';
import { Button, Flex } from '@forgedevstack/bear';
import type { BuilderNodeHoverBarProps } from './BuilderNodeHoverBar.types';

export const BuilderNodeHoverBar: FC<BuilderNodeHoverBarProps> = (props) => {
  const { duplicateLabel, deleteLabel, onDuplicate, onDelete } = props;
  const stopDuplicate = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDuplicate();
  };
  const stopDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };
  return (
    <Flex gap={1} className="bifrost-cms-canvas-node__hover">
      <Button type="button" size="sm" variant="outline" onClick={stopDuplicate}>
        {duplicateLabel}
      </Button>
      <Button type="button" size="sm" variant="danger" onClick={stopDelete}>
        {deleteLabel}
      </Button>
    </Flex>
  );
};
