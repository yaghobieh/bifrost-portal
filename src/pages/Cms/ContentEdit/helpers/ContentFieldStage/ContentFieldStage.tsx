import type { FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { EMPTY_STRING } from '@const/index';
import { CastValueInput } from '../CastPageFields/helpers/CastValueInput';
import type { ContentFieldStageProps } from './ContentFieldStage.types';

export const ContentFieldStage: FC<ContentFieldStageProps> = (props) => {
  const { fields, values, onValueChange, onDrop } = props;

  return (
    <Flex
      direction="column"
      gap={3}
      className="bifrost-cms-field-stage"
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      {fields.map((field) => (
        <CastValueInput
          key={field.id}
          field={field}
          value={values[field.name] ?? EMPTY_STRING}
          label={field.label || field.name}
          onValueChange={onValueChange}
        />
      ))}
    </Flex>
  );
};
