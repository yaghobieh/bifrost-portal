import type { FC } from 'react';
import type { CmsNavOverlayProps } from './CmsNavOverlay.types';

export const CmsNavOverlay: FC<CmsNavOverlayProps> = (props) => {
  const { label, onClose } = props;
  return (
    <button
      type="button"
      className="bifrost-cms__nav-overlay"
      aria-label={label}
      onClick={onClose}
    />
  );
};
