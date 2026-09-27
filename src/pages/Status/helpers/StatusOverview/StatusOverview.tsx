import type { FC } from 'react';
import { STATUS_DOWN, STATUS_PULSE_OK, STATUS_PULSE_VIOLET } from '../../Status.const';
import type { StatusOverviewProps } from '../../Status.types';

export const StatusOverview: FC<StatusOverviewProps> = (props) => {
  const {
    healthOk,
    healthLabel,
    healthValue,
    healthSub,
    serviceLabel,
    serviceValue,
    serviceHint,
    versionLabel,
    versionValue,
    updateBadge,
    showUpdate,
  } = props;
  const healthPulse = healthOk ? STATUS_PULSE_OK : STATUS_DOWN;
  return (
    <div className="Bl-status__cards">
      <div className="Bl-status__card">
        <div className="Bl-status__lbl">
          <span className={`Bl-status__pulse Bl-status__pulse--${healthPulse}`} />
          {healthLabel}
        </div>
        <div className="Bl-status__big">{healthValue}</div>
        <div className="Bl-status__sub">{healthSub}</div>
      </div>
      <div className="Bl-status__card">
        <div className="Bl-status__lbl">
          <span className={`Bl-status__pulse Bl-status__pulse--${STATUS_PULSE_VIOLET}`} />
          {serviceLabel}
        </div>
        <div className="Bl-status__big">{serviceValue}</div>
        <div className="Bl-status__sub">{serviceHint}</div>
      </div>
      <div className="Bl-status__card">
        <div className="Bl-status__lbl">{versionLabel}</div>
        <div className="Bl-status__big">{versionValue}</div>
        {showUpdate && <span className="Bl-status__badge">{updateBadge}</span>}
      </div>
    </div>
  );
};
