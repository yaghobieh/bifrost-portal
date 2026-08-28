import type { FC } from 'react';
import { Button, Flex, Input, Switch, Typography } from '@forgedevstack/bear';
import type { ContentEditSettingsProps } from './ContentEditSettings.types';

export const ContentEditSettings: FC<ContentEditSettingsProps> = (props) => {
  const {
    status,
    statusOrder,
    slug,
    routePrefix,
    homepage,
    statusLabel,
    routeLabel,
    homepageLabel,
    homepageHint,
    visibilityHint,
    slugInputId,
    onStatus,
    onSlug,
    onHomepage,
  } = props;
  return (
    <aside className="bifrost-cms-edit__settings">
      <Flex direction="column" gap={4}>
        <div>
          <Typography variant="caption" className="bifrost-cms-edit__set-label mb-1">
            {statusLabel}
          </Typography>
          <Flex gap={1} className="flex-wrap">
            {statusOrder?.map((value) => (
              <Button
                key={value}
                size="sm"
                variant={status === value ? 'primary' : 'outline'}
                onClick={() => onStatus(value)}
              >
                {value}
              </Button>
            ))}
          </Flex>
        </div>
        <div>
          <Typography variant="caption" className="bifrost-cms-edit__set-label mb-1">
            {routeLabel}
          </Typography>
          <div className="bifrost-cms-edit__route">
            <span className="bifrost-cms-edit__route-prefix">{routePrefix}</span>
            <Input
              id={slugInputId}
              value={slug}
              onChange={(event) => onSlug(event.target.value)}
            />
          </div>
        </div>
        <Switch
          label={homepageLabel}
          checked={homepage}
          onCheckedChange={onHomepage}
        />
        <Typography variant="caption" className="bifrost-cms__muted mb-0">
          {homepageHint}
        </Typography>
        <Typography variant="caption" className="bifrost-cms__muted mb-0">
          {visibilityHint}
        </Typography>
      </Flex>
    </aside>
  );
};
