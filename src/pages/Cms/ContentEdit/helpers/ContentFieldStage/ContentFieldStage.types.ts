import type { DragEvent } from 'react';
import type { CastField } from '@pages/Cms/CastPages/CastPages.types';

export type ContentFieldStageProps = {
  fields: CastField[];
  values: Record<string, string>;
  onValueChange: (name: string, value: string) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
};
