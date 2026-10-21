import { useState, type FC, type FormEvent } from 'react';
import { EMPTY_STRING } from '@const/strings.const';
import type { StatusSubscribeProps } from '../../Status.types';

export const StatusSubscribe: FC<StatusSubscribeProps> = (props) => {
  const { title, lead, placeholder, action, done } = props;
  const [email, setEmail] = useState(EMPTY_STRING);
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email) {
      return;
    }
    setSent(true);
  };

  return (
    <div className="Bl-status__subscribe">
      <div>
        <div className="Bl-status__sub-title">{title}</div>
        <div className="Bl-status__sub-lead">{lead}</div>
      </div>
      <form className="Bl-status__form" onSubmit={onSubmit}>
        <input
          className="Bl-status__input"
          type="email"
          value={email}
          placeholder={placeholder}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" className="Bl-status__sub-btn">
          {sent ? done : action}
        </button>
      </form>
    </div>
  );
};
