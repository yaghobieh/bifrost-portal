import type { FC } from 'react';
import { ColorSwatch, Flex } from '@forgedevstack/bear';
import type { BuilderColorSwatchesProps } from './BuilderColorSwatches.types';

export const BuilderColorSwatches: FC<BuilderColorSwatchesProps> = (props) => {
  const { colors, selected, onPick } = props;
  return (
    <Flex gap={2} wrap="wrap">
      {colors.map((swatch) => (
        <ColorSwatch
          key={swatch.id}
          color={swatch.value}
          label={swatch.label}
          selected={selected === swatch.value}
          size="md"
          rounded={false}
          onClick={() => onPick(swatch.value)}
        />
      ))}
    </Flex>
  );
};
