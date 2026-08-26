import type { FC } from 'react';
import { Input, Select } from '@forgedevstack/bear';
import { InkEditor } from '@forgedevstack/ink';
import { isStringValue } from '@utils';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import {
  CAST_PAGE_VALUE_PREFIX,
  CAST_RICH_MIN_HEIGHT_PX,
  CAST_TEXTAREA_ROWS,
  CAST_VALUE_INPUT_TYPE,
} from '../../CastPageFields.const';
import { parseCastSelectOptions } from '../../CastPageFields.utils';
import type { CastValueInputProps } from './CastValueInput.types';

export const CastValueInput: FC<CastValueInputProps> = (props) => {
  const { field, value, label, onValueChange } = props;
  const fieldId = `${CAST_PAGE_VALUE_PREFIX}${field.id}`;

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

  if (field.type === CAST_FIELD_TYPE.RICH) {
    return (
      <InkEditor
        value={value}
        onChange={(next) => onValueChange(field.name, next)}
        colorMode="light"
        variant="document"
        minHeight={CAST_RICH_MIN_HEIGHT_PX}
      />
    );
  }

  if (field.type === CAST_FIELD_TYPE.TEXTAREA) {
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
