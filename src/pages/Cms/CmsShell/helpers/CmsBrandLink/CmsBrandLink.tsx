import type { FC } from 'react';
import { Flex, Typography } from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { CMS_BRAND_LINK_TYPE } from './CmsBrandLink.const';
import type { CmsBrandLinkProps } from './CmsBrandLink.types';

export const CmsBrandLink: FC<CmsBrandLinkProps> = (props) => {
  const { src, alt, name, collapsed, href, label, logoSize } = props;
  const { navigate } = useNavigate();
  return (
    <button
      type={CMS_BRAND_LINK_TYPE}
      className="bifrost-cms__brand-link"
      aria-label={label}
      onClick={() => {
        navigate(href);
      }}
    >
      <Flex align="center" gap={2}>
        <img
          src={src}
          alt={alt}
          className="bifrost-cms__logo"
          width={logoSize}
          height={logoSize}
        />
        {collapsed ? null : (
          <Typography variant="h6" className="bifrost-cms__brand mb-0">
            {name}
          </Typography>
        )}
      </Flex>
    </button>
  );
};
