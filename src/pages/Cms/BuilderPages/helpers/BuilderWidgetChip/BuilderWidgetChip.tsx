import type { FC, ReactNode } from 'react';
import { BearIcons, Button } from '@forgedevstack/bear';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import type { BuilderWidgetChipProps } from './BuilderWidgetChip.types';

export const paletteGroupIcon = (group: string): ReactNode => {
  if (group === 'hero') {
    return <BearIcons.MonitorIcon size={CMS_ICON_SIZE} />;
  }
  if (group === 'auth') {
    return <BearIcons.LockIcon size={CMS_ICON_SIZE} />;
  }
  if (group === 'media') {
    return <BearIcons.ImageIcon size={CMS_ICON_SIZE} />;
  }
  if (group === 'form') {
    return <BearIcons.ClipboardIcon size={CMS_ICON_SIZE} />;
  }
  if (group === 'layout') {
    return <BearIcons.GridIcon size={CMS_ICON_SIZE} />;
  }
  if (group === 'conversion') {
    return <BearIcons.StarIcon size={CMS_ICON_SIZE} />;
  }
  if (group === 'footer') {
    return <BearIcons.MenuIcon size={CMS_ICON_SIZE} />;
  }
  return <BearIcons.PackageIcon size={CMS_ICON_SIZE} />;
};

export const BuilderWidgetChip: FC<BuilderWidgetChipProps> = (props) => {
  const { label, icon, draggable, onClick, onDragStart } = props;
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      icon={icon}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};
