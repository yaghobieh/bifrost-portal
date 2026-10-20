import type { FC } from 'react';
import { Flex, Input, Select, Switch, Typography } from '@forgedevstack/bear';
import { isStringValue } from '@utils';
import { CAST_FIELD_TYPE } from '@pages/Cms/CastPages/CastPages.const';
import {
  WidgetGridTable,
  isGridTableField,
  serializeGridTableHtml,
} from '@components/WidgetGridTable';
import {
  CAST_PAGE_VALUE_PREFIX,
  CAST_TEXTAREA_ROWS,
  CAST_VALUE_INPUT_TYPE,
} from '../../CastPageFields.const';
import { parseCastSelectOptions, isCastLongText } from '../../CastPageFields.utils';
import type { CastValueInputProps } from './CastValueInput.types';

export const CastValueInput: FC<CastValueInputProps> = (props) => {
  const { field, value, label, onValueChange } = props;
  const fieldId = `${CAST_PAGE_VALUE_PREFIX}${field.id}`;
  const isLongText = isCastLongText(field.type);

  if (isGridTableField(field, value)) {
    return (
      <div>
        <Typography variant="caption" className="bifrost-cms__muted mb-1 block">
          {label}
        </Typography>
        <WidgetGridTable
          html={value}
          editable
          className="bifrost-cms-grid"
          onTableChange={(table) => onValueChange(field.name, serializeGridTableHtml(table))}
        />
      </div>
    );
  }

  if (field.type === CAST_FIELD_TYPE.BOOLEAN) {
    const isChecked = value === 'true' || value === '1';
    return (
      <Flex align="center" justify="between" className="py-2 border-b border-gray-100">
        <div>
          <Typography variant="body2" className="font-medium text-gray-800 mb-0">
            {label}
          </Typography>
          <Typography variant="caption" className="text-xs text-gray-400">
            {isChecked ? 'Enabled' : 'Disabled'}
          </Typography>
        </div>
        <Switch
          id={fieldId}
          checked={isChecked}
          onCheckedChange={(checked) => {
            onValueChange(field.name, checked ? 'true' : 'false');
          }}
        />
      </Flex>
    );
  }

  if (field.type === CAST_FIELD_TYPE.DATE) {
    return (
      <Input
        id={fieldId}
        label={label}
        value={value}
        type="date"
        size="sm"
        fullWidth
        onChange={(event) => onValueChange(field.name, event.target.value)}
      />
    );
  }

  if (field.type === CAST_FIELD_TYPE.SELECT || field.type === CAST_FIELD_TYPE.RELATION) {
    return (
      <div className="flex flex-col gap-1">
        <Typography variant="caption" className="text-xs font-semibold text-gray-700">
          {label}
        </Typography>
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
      </div>
    );
  }

  if (isLongText || field.type === CAST_FIELD_TYPE.RICH) {
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
      type={CAST_VALUE_INPUT_TYPE[field.type] || 'text'}
      size="sm"
      fullWidth
      onChange={(event) => onValueChange(field.name, event.target.value)}
    />
  );
};
