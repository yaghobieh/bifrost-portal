import type { FC } from 'react';
import { Flex, Typography } from '@forgedevstack/bear';
import { CMS_LOGIN_BRAND_MARK_SIZE_PX } from '../../CmsLogin.const';
import { CmsLoginMark } from '../CmsLoginMark';
import type { CmsLoginBrandProps } from './CmsLoginBrand.types';

export const CmsLoginBrand: FC<CmsLoginBrandProps> = (props) => {
  const { brand, headline, body, quote, quoteBy } = props;
  return (
    <div className="bifrost-cms-login__brand">
      <span className="bifrost-cms-login__glow" />
      <Flex align="center" gap={2} className="bifrost-cms-login__brand-mark">
        <CmsLoginMark size={CMS_LOGIN_BRAND_MARK_SIZE_PX} title={brand} />
        <Typography variant="h6" className="bifrost-cms-login__brand-word mb-0">
          {brand}
        </Typography>
      </Flex>
      <div className="bifrost-cms-login__brand-mid">
        <Typography variant="h2" className="bifrost-cms-login__headline mb-2 text-3xl font-bold text-white leading-tight">
          {headline || 'Content that holds still while everything around it changes.'}
        </Typography>
        <Typography variant="body2" className="bifrost-cms-login__brand-body mb-0 text-gray-300 leading-relaxed">
          {body || 'One structured source of content, delivered through REST and GraphQL to your site, app, and anything you build next.'}
        </Typography>
      </div>
      <div className="anchor-login-foot mt-auto pt-6 flex gap-6 text-xs text-gray-400">
        <span>SOC 2 Type II</span>
        <span>99.98% uptime</span>
        <span>v4.2</span>
      </div>
    </div>
  );
};
