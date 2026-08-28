import type { DragEvent, FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { DRAG_FIELD_MIME, EMPTY_STRING } from '@const/index';
import { CastValueInput } from '../CastPageFields/helpers/CastValueInput';
import { FieldAttachMenu } from '../FieldAttachMenu';
import { DRAG_FIELD_EFFECT } from './ContentFieldStage.const';
import type { ContentFieldStageProps } from './ContentFieldStage.types';

export const ContentFieldStage: FC<ContentFieldStageProps> = (props) => {
  const {
    fields,
    values,
    onValueChange,
    onDropAt,
    attachLabel,
    hideLabel,
    roleLabels,
    reorderLabel,
    onAttach,
    onHideRole,
  } = props;

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Flex direction="column" gap={3} className="bifrost-cms-field-stage">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bifrost-cms-field-stage__slot"
          onDragOver={onDragOver}
          onDrop={(event) => onDropAt(index, event)}
        >
          <FieldAttachMenu
            fieldName={field.name}
            attachLabel={attachLabel}
            hideLabel={hideLabel}
            roleLabels={roleLabels}
            onAttach={onAttach}
            onHideRole={onHideRole}
          >
            <div
              className="bifrost-cms-field-stage__item"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(DRAG_FIELD_MIME, String(index));
                event.dataTransfer.effectAllowed = DRAG_FIELD_EFFECT;
              }}
            >
              <button type="button" className="bifrost-cms-field-stage__handle" aria-label={reorderLabel}>
                {reorderLabel}
              </button>
              <CastValueInput
                field={field}
                value={values[field.name] ?? EMPTY_STRING}
                label={field.label || field.name}
                onValueChange={onValueChange}
              />
            </div>
          </FieldAttachMenu>
        </div>
      ))}
      <div
        className="bifrost-cms-field-stage__tail"
        onDragOver={onDragOver}
        onDrop={(event) => onDropAt(fields.length, event)}
      />
    </Flex>
  );
};
