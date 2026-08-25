import { useId, type FC } from 'react';
import { NUMBER_ONE_HUNDRED_FORTY, NUMBER_TWO_HUNDRED_TWENTY } from '@const/numbers.const';
import { BRIDGE_BLUE_HEX, BRIDGE_VIOLET_HEX, PINK_HEX } from '@const/strings.const';

export const HeroArcs: FC = () => {
  const reactId = useId().replace(/:/g, '');
  const gradId = `heroarc-${reactId}`;
  return (
    <svg width={NUMBER_TWO_HUNDRED_TWENTY} height={NUMBER_ONE_HUNDRED_FORTY} viewBox="0 0 64 41">
      <defs>
        <linearGradient id={gradId} x1="4" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={BRIDGE_BLUE_HEX} />
          <stop offset="0.5" stopColor={BRIDGE_VIOLET_HEX} />
          <stop offset="1" stopColor={PINK_HEX} />
        </linearGradient>
      </defs>
      <circle className="Bl-arc Bl-arc--1" cx="32" cy="41" r="26" fill="none" stroke={`url(#${gradId})`} strokeWidth="3.4" strokeLinecap="round" pathLength="100" />
      <circle className="Bl-arc Bl-arc--2" cx="32" cy="41" r="17" fill="none" stroke={`url(#${gradId})`} strokeWidth="3.4" strokeLinecap="round" pathLength="100" opacity="0.88" />
      <circle className="Bl-arc Bl-arc--3" cx="32" cy="41" r="8" fill="none" stroke={`url(#${gradId})`} strokeWidth="3.4" strokeLinecap="round" pathLength="100" opacity="0.74" />
    </svg>
  );
};
