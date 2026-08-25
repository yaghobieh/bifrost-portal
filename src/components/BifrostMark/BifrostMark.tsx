import { useId, type FC } from 'react';
import { LINK_MARK_PX, LOCKUP_MARK_PX, MARK_SIZE_PX, NAV_MARK_PX } from '@const/numbers.const';
import { BRIDGE_BLUE_HEX, BRIDGE_VIOLET_HEX, PINK_HEX } from '@const/strings.const';
import type { BifrostMarkProps } from './BifrostMark.types';

export const BifrostMark: FC<BifrostMarkProps> = (props) => {
  const reactId = useId().replace(/:/g, '');
  const sizeMap = {
    nav: NAV_MARK_PX,
    mark: MARK_SIZE_PX,
    lockup: LOCKUP_MARK_PX,
    link: LINK_MARK_PX,
  };
  const size = sizeMap[props.size ?? 'nav'];
  const gradId = `bpGrad-${reactId}`;
  const cutId = `bpCut-${reactId}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="4" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRIDGE_BLUE_HEX} />
          <stop offset="0.5" stopColor={BRIDGE_VIOLET_HEX} />
          <stop offset="1" stopColor={PINK_HEX} />
        </linearGradient>
        <clipPath id={cutId}>
          <rect x="0" y="0" width="64" height="41" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cutId})`}>
        <circle cx="32" cy="41" r="26" fill="none" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinecap="round" />
        <circle cx="32" cy="41" r="17" fill="none" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinecap="round" opacity="0.88" />
        <circle cx="32" cy="41" r="8" fill="none" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinecap="round" opacity="0.74" />
      </g>
    </svg>
  );
};
