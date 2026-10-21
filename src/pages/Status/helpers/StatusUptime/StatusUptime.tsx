import type { FC } from 'react';
import type { StatusUptimeProps } from '../../Status.types';

export const StatusUptime: FC<StatusUptimeProps> = (props) => {
  const { title, percent, ago, today, bars } = props;
  return (
    <div className="Bl-status__uptime">
      <div className="Bl-status__uptime-head">
        <span className="Bl-status__uptime-title">{title}</span>
        <span className="Bl-status__uptime-pct">{percent}</span>
      </div>
      <div className="Bl-status__bars">
        {bars.map((kind, index) => (
          <span key={index} className={`Bl-status__bar Bl-status__bar--${kind}`} />
        ))}
      </div>
      <div className="Bl-status__uptime-foot">
        <span>{ago}</span>
        <span>{today}</span>
      </div>
    </div>
  );
};
