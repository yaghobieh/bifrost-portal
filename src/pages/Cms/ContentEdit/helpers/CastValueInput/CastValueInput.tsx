import type { FC } from 'react';
import { Input, Select } from '@forgedevstack/bear';
import { isStringValue } from '@utils';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import {
  CAST_PAGE_VALUE_PREFIX,
  CAST_TEXTAREA_ROWS,
  CAST_VALUE_INPUT_TYPE,
} from '../CastPageFields/CastPageFields.const';
import { parseCastSelectOptions, isCastLongText } from '../CastPageFields/CastPageFields.utils';
import type { CastValueInputProps } from './CastValueInput.types';

export const CastValueInput: FC<CastValueInputProps> = (props) => {
  const { field, value, label, onValueChange } = props;
  const fieldId = `${CAST_PAGE_VALUE_PREFIX}${field.id}`;
  const isLongText = isCastLongText(field.type);

  if (field.type === CAST_FIELD_TYPE.SELECT) {
    return (
      <Select
        id={fieldId}
        options={parseCastSelectOptions(field.options)}
        value={value}
        size="sm"
        fullWidth
        onChange={(next) => {
          if (isStringValue(next)) {
            onValueChange(field.name, next);
          }
        }}
      />
    );
  }

  if (isLongText) {
    return (
      <Input
        id={fieldId}
        label={label}
        value={value}
        size="sm"
        fullWidth
        multiline
        rows={CAST_TEXTAREA_ROWS}
        onChange={(event) => onValueChange(field.name, event.target.value)}
      />
    );
  }

  return (
    <Input
      id={fieldId}
      label={label}
      value={value}
      type={CAST_VALUE_INPUT_TYPE[field.type]}
      size="sm"
      fullWidth
      onChange={(event) => onValueChange(field.name, event.target.value)}
    />
  );
};
