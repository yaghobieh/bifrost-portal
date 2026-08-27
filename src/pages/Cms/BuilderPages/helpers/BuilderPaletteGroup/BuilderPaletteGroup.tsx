import type { FC } from 'react';
import { AccordionItem, Flex } from '@forgedevstack/bear';
import type { BuilderPaletteGroupProps } from './BuilderPaletteGroup.types';

export const BuilderPaletteGroup: FC<BuilderPaletteGroupProps> = (props) => {
  const { id, label, children } = props;
  return (
    <AccordionItem id={id} title={label}>
      <Flex direction="column" gap={1}>
        {children}
      </Flex>
    </AccordionItem>
  );
};
