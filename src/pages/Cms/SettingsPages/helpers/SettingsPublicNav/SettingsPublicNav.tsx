import type { FC } from 'react';
import { Button, Flex, Input, Switch, Typography } from '@forgedevstack/bear';
import { NUMBER_ONE, NUMBER_ZERO } from '@const/numbers.const';
import {
  addPublicNavItem,
  movePublicNavItem,
  removePublicNavItem,
  updatePublicNavItem,
} from '../../SettingsPages.utils';
import {
  SETTINGS_PUBLIC_NAV_BUTTON_TYPE,
  SETTINGS_PUBLIC_NAV_DELTA_DOWN,
  SETTINGS_PUBLIC_NAV_DELTA_UP,
} from './SettingsPublicNav.const';
import type { SettingsPublicNavProps } from './SettingsPublicNav.types';

export const SettingsPublicNav: FC<SettingsPublicNavProps> = (props) => {
  const {
    items,
    disabled,
    title,
    hint,
    labelTitle,
    hrefTitle,
    addLabel,
    removeLabel,
    moveUpLabel,
    moveDownLabel,
    visibleLabel,
    onChange,
  } = props;

  return (
    <Flex direction="column" gap={3} className="bifrost-cms-public-nav">
      <div>
        <Typography variant="h5" className="mb-1">
          {title}
        </Typography>
        <Typography variant="caption" className="bifrost-cms__muted mb-0 block">
          {hint}
        </Typography>
      </div>
      {items.map((item, index) => (
        <Flex key={item.id} direction="column" gap={2} className="bifrost-cms-public-nav__row">
          <Flex align="center" gap={2} className="bifrost-cms-public-nav__tools">
            <Button
              size="sm"
              variant="outline"
              type={SETTINGS_PUBLIC_NAV_BUTTON_TYPE}
              disabled={disabled || index === NUMBER_ZERO}
              onClick={() => {
                onChange(
                  movePublicNavItem({
                    items,
                    id: item.id,
                    delta: SETTINGS_PUBLIC_NAV_DELTA_UP,
                  }),
                );
              }}
            >
              {moveUpLabel}
            </Button>
            <Button
              size="sm"
              variant="outline"
              type={SETTINGS_PUBLIC_NAV_BUTTON_TYPE}
              disabled={disabled || index === items.length - NUMBER_ONE}
              onClick={() => {
                onChange(
                  movePublicNavItem({
                    items,
                    id: item.id,
                    delta: SETTINGS_PUBLIC_NAV_DELTA_DOWN,
                  }),
                );
              }}
            >
              {moveDownLabel}
            </Button>
            <Switch
              id={`bifrost-cms-public-nav-visible-${item.id}`}
              label={visibleLabel}
              checked={item.visible}
              onCheckedChange={(checked) => {
                onChange(
                  updatePublicNavItem({
                    items,
                    id: item.id,
                    patch: { visible: checked },
                  }),
                );
              }}
            />
            <Button
              size="sm"
              variant="outline"
              type={SETTINGS_PUBLIC_NAV_BUTTON_TYPE}
              disabled={disabled}
              onClick={() => {
                onChange(removePublicNavItem({ items, id: item.id }));
              }}
            >
              {removeLabel}
            </Button>
          </Flex>
          <Input
            id={`bifrost-cms-public-nav-label-${item.id}`}
            label={labelTitle}
            value={item.label}
            disabled={disabled}
            onChange={(event) => {
              onChange(
                updatePublicNavItem({
                  items,
                  id: item.id,
                  patch: { label: event.target.value },
                }),
              );
            }}
          />
          <Input
            id={`bifrost-cms-public-nav-href-${item.id}`}
            label={hrefTitle}
            value={item.href}
            disabled={disabled}
            onChange={(event) => {
              onChange(
                updatePublicNavItem({
                  items,
                  id: item.id,
                  patch: { href: event.target.value },
                }),
              );
            }}
          />
        </Flex>
      ))}
      <Button
        size="sm"
        variant="outline"
        type={SETTINGS_PUBLIC_NAV_BUTTON_TYPE}
        disabled={disabled}
        onClick={() => {
          onChange(addPublicNavItem(items));
        }}
      >
        {addLabel}
      </Button>
    </Flex>
  );
};
