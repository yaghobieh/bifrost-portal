import { useEffect, type FC } from 'react';
import { STAGE_SCRIPT_ATTR } from '@const/strings.const';
import type { BuilderStageRuntimeProps } from './BuilderStageRuntime.types';

const SCRIPT_TAG = 'script';

const clearStageScripts = () => {
  document.querySelectorAll(`[${STAGE_SCRIPT_ATTR}]`).forEach((node) => {
    node.remove();
  });
};

export const BuilderStageRuntime: FC<BuilderStageRuntimeProps> = (props) => {
  const { css, js, scripts } = props;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      clearStageScripts();
      for (const src of scripts) {
        if (cancelled) {
          return;
        }
        await new Promise<void>((resolve) => {
          const el = document.createElement(SCRIPT_TAG);
          el.src = src;
          el.async = false;
          el.setAttribute(STAGE_SCRIPT_ATTR, src);
          el.onload = () => resolve();
          el.onerror = () => resolve();
          document.body.appendChild(el);
        });
      }
      if (cancelled || !js.trim()) {
        return;
      }
      const inline = document.createElement(SCRIPT_TAG);
      inline.setAttribute(STAGE_SCRIPT_ATTR, 'inline');
      inline.textContent = js;
      document.body.appendChild(inline);
    };
    void run();
    return () => {
      cancelled = true;
      clearStageScripts();
    };
  }, [js, scripts]);

  if (!css) {
    return null;
  }
  return <style>{css}</style>;
};
