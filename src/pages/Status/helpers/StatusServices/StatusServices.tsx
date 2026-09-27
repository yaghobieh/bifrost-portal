import type { FC } from 'react';
import type { StatusServicesProps } from '../../Status.types';

export const StatusServices: FC<StatusServicesProps> = (props) => {
  const { title, rows } = props;
  return (
    <div className="Bl-status__services">
      <div className="Bl-status__svc-head">{title}</div>
      {rows.map((row) => (
        <div key={row.id} className="Bl-status__svc-row">
          <span className="Bl-status__svc-name">{row.name}</span>
          {row.latency ? <span className="Bl-status__svc-latency">{row.latency}</span> : null}
          <span className={`Bl-status__pill Bl-status__pill--${row.pillKind}`}>
            <span className="Bl-status__pill-dot" />
            {row.label}
          </span>
        </div>
      ))}
    </div>
  );
};
