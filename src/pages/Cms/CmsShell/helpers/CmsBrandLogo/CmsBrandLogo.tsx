import type { FC } from 'react';
import type { CmsBrandLogoProps } from './CmsBrandLogo.types';

export const CmsBrandLogo: FC<CmsBrandLogoProps> = (props) => {
  const { src, alt, logoSize } = props;
  return (
    <img
      src={src}
      alt={alt}
      className="bifrost-cms__logo"
      width={logoSize}
      height={logoSize}
    />
  );
};
