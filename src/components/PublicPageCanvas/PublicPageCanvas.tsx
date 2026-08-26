import { useEffect, type FC } from 'react';
import { useNucleus } from '@forgedevstack/synapse';
import { NUMBER_ZERO } from '@const/numbers.const';
import { EMPTY_STRING } from '@const/strings.const';
import { mediaNucleus } from '@sdk/index';
import { StageCanvas, readCanvas } from '@components/StageCanvas';
import type { PublicPageCanvasProps } from './PublicPageCanvas.types';

export const PublicPageCanvas: FC<PublicPageCanvasProps> = (props) => {
  const { payload } = props;
  const { cloudName, loadConfig } = useNucleus(mediaNucleus);
  const nodes = readCanvas(payload);

  useEffect(() => {
    void loadConfig(EMPTY_STRING);
  }, [loadConfig]);

  if (nodes.length === NUMBER_ZERO) {
    return null;
  }
  return (
    <div className="Bp-stage">
      <StageCanvas nodes={nodes} cloudName={cloudName} />
    </div>
  );
};
