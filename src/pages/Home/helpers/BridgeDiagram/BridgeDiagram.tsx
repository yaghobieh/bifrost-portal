import { useId, type FC } from 'react';
import { useLingo } from '@forgedevstack/lingo';
import { BRIDGE_BLUE_HEX, BRIDGE_VIOLET_HEX, PINK_HEX } from '@const/strings.const';

export const BridgeDiagram: FC = () => {
  const { t } = useLingo();
  const reactId = useId().replace(/:/g, '');
  const gradId = `spanG-${reactId}`;
  return (
    <div className="Bl-bridge__diagram">
      <div className="Bl-node">
        <div className="Bl-node__lbl">{t('landing.bridgeSourceLbl')}</div>
        <div className="Bl-node__val">{t('landing.bridgeSourceVal')}</div>
      </div>
      <div className="Bl-span">
        <svg viewBox="0 0 300 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="300" y2="0">
              <stop offset="0" stopColor={BRIDGE_BLUE_HEX} />
              <stop offset="0.5" stopColor={BRIDGE_VIOLET_HEX} />
              <stop offset="1" stopColor={PINK_HEX} />
            </linearGradient>
          </defs>
          <path d="M0 45 Q 75 5 150 30 T 300 15" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M0 50 Q 75 15 150 36 T 300 25" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />
        </svg>
      </div>
      <div className="Bl-targets">
        <div className="Bl-target">
          <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg>
          {t('landing.targetWeb')}
        </div>
        <div className="Bl-target">
          <svg viewBox="0 0 16 16" fill="none"><rect x="5" y="2" width="6" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.3" /></svg>
          {t('landing.targetApp')}
        </div>
        <div className="Bl-target">
          <svg viewBox="0 0 16 16" fill="none"><path d="M2 5L8 2L14 5L8 8L2 5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
          {t('landing.targetDocs')}
        </div>
        <div className="Bl-target">
          <svg viewBox="0 0 16 16" fill="none"><path d="M2 4.5H14V11.5H2V4.5Z" stroke="currentColor" strokeWidth="1.2" /><path d="M2 5L8 9L14 5" stroke="currentColor" strokeWidth="1.2" /></svg>
          {t('landing.targetEmail')}
        </div>
      </div>
    </div>
  );
};
