import type { FC } from 'react';
import { BearIcons, Button, Flex, Typography } from '@forgedevstack/bear';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import type { TranslationAiBannerProps } from './TranslationAiBanner.types';

export const TranslationAiBanner: FC<TranslationAiBannerProps> = (props) => {
  const { message, actionLabel, busy, onTranslateAll } = props;
  return (
    <Flex align="center" justify="between" gap={3} wrap="wrap" className="bifrost-cms-translations__banner">
      <Flex align="center" gap={2} className="bifrost-cms-translations__banner-copy">
        <BearIcons.StarIcon size={CMS_ICON_SIZE} className="bifrost-cms-translations__banner-icon" />
        <Typography variant="body2" className="mb-0">
          {message}
        </Typography>
      </Flex>
      <Button
        size="sm"
        className="bifrost-cms-translations__ai-btn"
        disabled={busy}
        icon={<BearIcons.StarIcon size={CMS_ICON_SIZE} />}
        onClick={onTranslateAll}
      >
        {actionLabel}
      </Button>
    </Flex>
  );
};
