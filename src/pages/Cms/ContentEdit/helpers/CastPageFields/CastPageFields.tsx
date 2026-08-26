import type { FC } from 'react';
import { Button, Card, Flex, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { CMS_CARD_PADDING } from '@pages/Cms/CmsShell';
import { EMPTY_STRING } from '@const/index';
import type { CastPageFieldsProps } from './CastPageFields.types';
import { castTypeOptions } from './CastPageFields.utils';
import { CastFieldChrome } from './helpers/CastFieldChrome';
import { CastValueInput } from './helpers/CastValueInput';

export const CastPageFields: FC<CastPageFieldsProps> = (props) => {
  const {
    fields,
    values,
    lockedFieldIds,
    onAddField,
    onFieldChange,
    onRemoveField,
    onValueChange,
  } = props;
  const { t } = useI18n();
  const typeOptions = castTypeOptions(t.cmsCast);

  return (
    <Card className="bifrost-cms-card mb-3" padding={CMS_CARD_PADDING}>
      <Flex direction="column" gap={3}>
        <div>
          <Typography variant="h4" className="mb-1">
            {t.contentEdit.castFieldsTitle}
          </Typography>
          <Typography variant="caption" color="muted" className="mb-0">
            {t.contentEdit.castFieldsHint}
          </Typography>
        </div>
        {fields.length === 0 && (
          <Typography variant="caption" color="muted" className="mb-0">
            {t.contentEdit.castEmpty}
          </Typography>
        )}
        {fields.map((field) => {
          const locked = lockedFieldIds.includes(field.id);
          return (
            <Flex key={field.id} direction="column" gap={2}>
              <CastFieldChrome
                locked={locked}
                field={field}
                typeOptions={typeOptions}
                fromTemplateLabel={t.contentEdit.castFromTemplate}
                fieldLabelPlaceholder={t.cmsCast.fieldLabel}
                fieldRequiredLabel={t.cmsCast.fieldRequired}
                fieldOptionsLabel={t.cmsCast.fieldOptions}
                onFieldChange={onFieldChange}
              />
              <CastValueInput
                field={field}
                value={values[field.name] ?? EMPTY_STRING}
                label={locked ? field.label || field.name : t.contentEdit.castValue}
                onValueChange={onValueChange}
              />
              {!locked && (
                <Button size="sm" variant="outline" onClick={() => onRemoveField(field.id)}>
                  {t.cmsCast.removeField}
                </Button>
              )}
            </Flex>
          );
        })}
        <Button size="sm" variant="outline" onClick={onAddField}>
          {t.contentEdit.castAddField}
        </Button>
      </Flex>
    </Card>
  );
};
