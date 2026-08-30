import type { FC } from 'react';
import { ColorPicker, FileUpload, Input } from '@forgedevstack/bear';
import { NUMBER_ZERO } from '@const/numbers.const';
import { EMPTY_STRING } from '@const/index';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import {
  CAST_BACKGROUND_FALLBACK,
  CAST_FILE_MAX_FILES,
  CAST_FILE_UPLOAD_VARIANT,
  CAST_PAGE_VALUE_PREFIX,
  CAST_VALUE_INPUT_TYPE,
} from './CastFieldValue.const';
import type { CastFieldValueProps } from './CastFieldValue.types';

export const CastFieldValue: FC<CastFieldValueProps> = (props) => {
  const { field, value, valueLabel, onValueChange } = props;
  const inputId = `${CAST_PAGE_VALUE_PREFIX}${field.id}`;
  if (field.type === CAST_FIELD_TYPE.FILE) {
    return (
      <FileUpload
        id={inputId}
        label={valueLabel}
        variant={CAST_FILE_UPLOAD_VARIANT}
        maxFiles={CAST_FILE_MAX_FILES}
        onFilesSelect={(files) => {
          const file = files[NUMBER_ZERO];
          if (!file) {
            return;
          }
          onValueChange(field.name, file.name);
        }}
      />
    );
  }
  if (field.type === CAST_FIELD_TYPE.BACKGROUND) {
    return (
      <ColorPicker
        id={inputId}
        label={valueLabel}
        size="sm"
        value={value || CAST_BACKGROUND_FALLBACK}
        onChange={(color) => onValueChange(field.name, color)}
      />
    );
  }
  const inputType = CAST_VALUE_INPUT_TYPE[field.type] || CAST_VALUE_INPUT_TYPE[CAST_FIELD_TYPE.TEXT];
  return (
    <Input
      id={inputId}
      label={valueLabel}
      value={value || EMPTY_STRING}
      type={inputType}
      size="sm"
      fullWidth
      onChange={(event) => onValueChange(field.name, event.target.value)}
    />
  );
};
