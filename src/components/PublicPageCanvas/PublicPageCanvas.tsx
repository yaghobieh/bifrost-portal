import type { FC } from 'react';
import { NUMBER_ZERO } from '@const/numbers.const';
import { StageCanvas, readCanvas } from '@components/StageCanvas';
import type { PublicPageCanvasProps } from './PublicPageCanvas.types';

export const PublicPageCanvas: FC<PublicPageCanvasProps> = (props) => {
  const { payload } = props;
  const nodes = readCanvas(payload);
  if (nodes.length === NUMBER_ZERO) {
    return null;
  }
  return (
    <div className="Bp-stage">
      <StageCanvas nodes={nodes} />
    </div>
  );
};
