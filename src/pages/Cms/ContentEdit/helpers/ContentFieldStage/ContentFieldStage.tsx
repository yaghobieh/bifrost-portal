import type { FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { EMPTY_STRING } from '@const/index';
import { CastValueInput } from '../CastPageFields/helpers/CastValueInput';
import { FieldAttachMenu } from '../FieldAttachMenu';
import type { ContentFieldStageProps } from './ContentFieldStage.types';

export const ContentFieldStage: FC<ContentFieldStageProps> = (props) => {
  const {
    fields,
    values,
    onValueChange,
    onDrop,
    attachLabel,
    hideLabel,
    roleLabels,
    onAttach,
    onHideRole,
  } = props;

  return (
    <Flex
      direction="column"
      gap={3}
      className="bifrost-cms-field-stage"
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      {fields.map((field) => (
        <FieldAttachMenu
          key={field.id}
          fieldName={field.name}
          attachLabel={attachLabel}
          hideLabel={hideLabel}
          roleLabels={roleLabels}
          onAttach={onAttach}
          onHideRole={onHideRole}
        >
          <CastValueInput
            field={field}
            value={values[field.name] ?? EMPTY_STRING}
            label={field.label || field.name}
            onValueChange={onValueChange}
          />
        </FieldAttachMenu>
      ))}
    </Flex>
  );
};
