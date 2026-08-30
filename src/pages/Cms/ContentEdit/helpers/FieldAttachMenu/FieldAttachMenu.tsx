import { useState, type FC, type MouseEvent } from 'react';
import { NUMBER_ZERO } from '@const/numbers.const';
import { FIELD_MENU_HIDE, FIELD_ROLES } from './FieldAttachMenu.const';
import type { FieldAttachMenuProps } from './FieldAttachMenu.types';

export const FieldAttachMenu: FC<FieldAttachMenuProps> = (props) => {
  const { fieldName, attachLabel, hideLabel, roleLabels, onAttach, onHideRole, children } = props;
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(NUMBER_ZERO);
  const [top, setTop] = useState(NUMBER_ZERO);

  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLeft(event.clientX);
    setTop(event.clientY);
    setOpen(true);
  };

  return (
    <div className="bifrost-cms-field-attach" onContextMenu={onContextMenu}>
      {children}
      {open && (
        <div
          className="bifrost-cms-field-attach__menu"
          style={{ left, top }}
        >
          <button
            type="button"
            className="bifrost-cms-field-attach__item"
            onClick={() => {
              onAttach(fieldName);
              setOpen(false);
            }}
          >
            {attachLabel}
          </button>
          <div className="bifrost-cms-field-attach__sub">{hideLabel}</div>
          {FIELD_ROLES.map((role) => (
            <button
              key={`${FIELD_MENU_HIDE}-${role}`}
              type="button"
              className="bifrost-cms-field-attach__item"
              onClick={() => {
                onHideRole(fieldName, role);
                setOpen(false);
              }}
            >
              {roleLabels[role] || role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
