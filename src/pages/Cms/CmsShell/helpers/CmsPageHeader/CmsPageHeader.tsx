import type { FC } from 'react';
import { Card, Flex, Typography } from '@forgedevstack/bear';
import { CMS_CARD_PADDING } from '../../CmsShell.const';
import type { CmsPageHeaderProps } from './CmsPageHeader.types';

export const CmsPageHeader: FC<CmsPageHeaderProps> = (props) => {
  const { title, subtitle, actionTitle, actionBody, extra, actions } = props;
  const showCard = Boolean(actionTitle || actionBody || extra || actions);
  return (
    <Flex direction="column" gap={4} className="bifrost-cms-page-header">
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
      {showCard && (
        <Card variant="elevated" padding={CMS_CARD_PADDING} className="bifrost-cms-page-header__action">
          <Flex justify="between" align="center" gap={3} className="flex-wrap">
            <div>
              {actionTitle && (
                <Typography variant="h4" className="mb-1">
                  {actionTitle}
                </Typography>
              )}
              {actionBody && (
                <Typography variant="body2" className="bifrost-cms-page-header__sub mb-0">
                  {actionBody}
                </Typography>
              )}
            </div>
            <Flex align="center" gap={2} className="flex-wrap">
              {actions}
              {extra}
            </Flex>
          </Flex>
        </Card>
      )}
    </Flex>
  );
};
