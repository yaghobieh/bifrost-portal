import type { DragEvent, FC } from 'react';
import { Typography } from '@forgedevstack/bear';
import { EMPTY_STRING } from '@const/index';
import type { WidgetPaletteChipProps } from './WidgetPaletteChip.types';

export const WidgetPaletteChip: FC<WidgetPaletteChipProps> = (props) => {
  const { label, previewSrc, previewHtml, onClick, onDragStart } = props;
  const hasPreview = Boolean(previewSrc || previewHtml);

  const onDrag = (event: DragEvent<HTMLButtonElement>) => {
    if (onDragStart) {
      onDragStart(event);
    }
  };

  return (
    <button
      type="button"
      className="bifrost-cms-widget-chip"
      draggable={Boolean(onDragStart)}
      onDragStart={onDrag}
      onClick={onClick}
    >
      {hasPreview ? (
        <span className="bifrost-cms-widget-chip__thumb">
          {previewSrc ? (
            <img src={previewSrc} alt={label} className="bifrost-cms-widget-chip__img" />
          ) : (
            <span
              className="bifrost-cms-widget-chip__html"
              dangerouslySetInnerHTML={{ __html: previewHtml || EMPTY_STRING }}
            />
          )}
        </span>
      ) : null}
      <Typography variant="body2" className="mb-0 font-medium">
        {label}
      </Typography>
    </button>
  );
};
