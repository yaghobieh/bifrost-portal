import type { FC } from 'react';
import { Flex, Typography } from '@forgedevstack/bear';
import type { CmsPageHeaderProps } from './CmsPageHeader.types';

export const CmsPageHeader: FC<CmsPageHeaderProps> = (props) => {
  const { title, subtitle, extra, actions } = props;
  return (
    <Flex direction="column" gap={4} className="bifrost-cms-page-header">
      <Flex justify="between" align="end" className="gap-3 flex-wrap">
        <div>
          <Typography variant="h2" className="bifrost-cms-page-header__title">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" className="bifrost-cms-page-header__sub">
              {subtitle}
            </Typography>
          )}
        </div>
        {actions}
      </Flex>
      {extra}
    </Flex>
  );
};
