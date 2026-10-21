import type { FC } from 'react';
import type { StatusIncidentsProps } from '../../Status.types';

export const StatusIncidents: FC<StatusIncidentsProps> = (props) => {
  const { title, resolved, open, empty, rows } = props;
  return (
    <div className="Bl-status__incidents">
      <div className="Bl-status__inc-head">{title}</div>
      {!rows.length && <p className="Bl-status__inc-empty">{empty}</p>}
      {rows.map((row) => (
        <div key={row.id} className="Bl-status__inc-row">
          <span className={`Bl-status__inc-badge${row.resolved ? '' : ' Bl-status__inc-badge--open'}`}>
            {row.resolved ? resolved : open}
          </span>
          <div>
            <div className="Bl-status__inc-title">{row.title}</div>
            <div className="Bl-status__inc-date">{row.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
