import { useState, useEffect, type FC } from 'react';
import { BearIcons, Button, Flex, Input, Modal, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import {
  NUMBER_FOUR,
  NUMBER_SIX,
  NUMBER_EIGHT,
  NUMBER_TEN,
  NUMBER_TWELVE,
  NUMBER_FOURTEEN,
  NUMBER_SIXTEEN,
  NUMBER_TWENTY,
} from '@const/numbers.const';
import {
  ATTRIBUTE_TYPE_OPTIONS,
  BUILDER_COLORS,
  BUILDER_EMPTY_STRING,
  BUILDER_ICON_SIZE_MD,
  BUILDER_ICON_SIZE_LG,
} from '../../ContentTypeBuilder.const';
import { slugifyFieldId } from '../../ContentTypeBuilder.utils';
import type { AddAttributeModalProps } from '../../ContentTypeBuilder.types';
import type { PageTypeFieldDef, PageTypeFieldType } from '../../../ContentPages/pageTypes.types';

export const AddAttributeModal: FC<AddAttributeModalProps> = ({
  isOpen,
  onClose,
  onSaveField,
  fieldToEdit,
  availableTypes,
  availableComponents,
}) => {
  const { t } = useI18n();

  const [selectedType, setSelectedType] = useState<PageTypeFieldType | null>(null);
  const [name, setName] = useState(BUILDER_EMPTY_STRING);
  const [id, setId] = useState(BUILDER_EMPTY_STRING);
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState(BUILDER_EMPTY_STRING);
  const [description, setDescription] = useState(BUILDER_EMPTY_STRING);
  const [relationTarget, setRelationTarget] = useState(BUILDER_EMPTY_STRING);
  const [componentTarget, setComponentTarget] = useState(BUILDER_EMPTY_STRING);
  const [hasCustomId, setHasCustomId] = useState(false);

  useEffect(() => {
    if (fieldToEdit) {
      setSelectedType(fieldToEdit.type);
      setName(fieldToEdit.name);
      setId(fieldToEdit.id);
      setRequired(Boolean(fieldToEdit.required));
      setDefaultValue(fieldToEdit.defaultValue || BUILDER_EMPTY_STRING);
      setDescription(fieldToEdit.description || BUILDER_EMPTY_STRING);
      setRelationTarget(fieldToEdit.relationTarget || BUILDER_EMPTY_STRING);
      setComponentTarget(fieldToEdit.componentTarget || BUILDER_EMPTY_STRING);
      setHasCustomId(true);
    } else {
      setSelectedType(null);
      setName(BUILDER_EMPTY_STRING);
      setId(BUILDER_EMPTY_STRING);
      setRequired(false);
      setDefaultValue(BUILDER_EMPTY_STRING);
      setDescription(BUILDER_EMPTY_STRING);
      setRelationTarget(availableTypes[0]?.id || BUILDER_EMPTY_STRING);
      setComponentTarget(availableComponents[0]?.id || BUILDER_EMPTY_STRING);
      setHasCustomId(false);
    }
  }, [fieldToEdit, isOpen, availableTypes, availableComponents]);

  const onNameChange = (val: string) => {
    setName(val);
    if (!hasCustomId) {
      setId(slugifyFieldId(val));
    }
  };

  const onIdChange = (val: string) => {
    setId(val);
    setHasCustomId(true);
  };

  const handleFinish = () => {
    if (!name.trim() || !id.trim() || !selectedType) return;
    const def: PageTypeFieldDef = {
      id: id.trim(),
      name: name.trim(),
      type: selectedType,
      required,
      defaultValue: defaultValue.trim() || undefined,
      description: description.trim() || undefined,
      relationTarget: selectedType === 'relation' ? relationTarget : undefined,
      componentTarget: selectedType === 'component' ? componentTarget : undefined,
    };
    onSaveField(def);
  };

  const getOptionLabel = (labelKey: string) => {
    const builderDict = t.cmsContentTypeBuilder as Record<string, string>;
    return builderDict[labelKey] || labelKey;
  };

  const getOptionDesc = (descKey: string) => {
    const builderDict = t.cmsContentTypeBuilder as Record<string, string>;
    return builderDict[descKey] || descKey;
  };

  const renderSelectTypeStep = () => (
    <div>
      <Typography variant="body" style={{ color: '#64748B', marginBottom: 16 }}>
        {t.cmsContentTypeBuilder.selectFieldType}
      </Typography>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
      >
        {ATTRIBUTE_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => setSelectedType(opt.type)}
            style={{
              padding: 14,
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = BUILDER_COLORS.PINK;
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(234, 10, 142, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: `${opt.color}15`,
                color: opt.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <BearIcons.FileTextIcon size={BUILDER_ICON_SIZE_MD} />
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>
              {getOptionLabel(opt.labelKey)}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', lineHeight: '14px' }}>
              {getOptionDesc(opt.descKey)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderConfigStep = () => (
    <Flex direction="column" gap={NUMBER_TWELVE}>
      <Flex align="center" justify="between">
        <Typography variant="caption" style={{ color: '#64748B' }}>
          Type: <strong style={{ color: BUILDER_COLORS.PINK }}>{selectedType}</strong>
        </Typography>
        {!fieldToEdit && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setSelectedType(null)}
            style={{ color: '#64748B' }}
          >
            Change type
          </Button>
        )}
      </Flex>

      <div>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: 4,
          }}
        >
          {t.cmsContentTypeBuilder.fieldName} *
        </label>
        <Input
          placeholder="e.g. Meta Title"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          size="sm"
        />
      </div>

      <div>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: 4,
          }}
        >
          {t.cmsContentTypeBuilder.fieldId} *
        </label>
        <Input
          placeholder="e.g. metaTitle"
          value={id}
          onChange={(e) => onIdChange(e.target.value)}
          size="sm"
        />
      </div>

      {selectedType === 'relation' && (
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              marginBottom: 4,
            }}
          >
            {t.cmsContentTypeBuilder.targetType}
          </label>
          <select
            value={relationTarget}
            onChange={(e) => setRelationTarget(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              backgroundColor: '#FFFFFF',
            }}
          >
            {availableTypes.map((tDef) => (
              <option key={tDef.id} value={tDef.id}>
                {tDef.name} ({tDef.id})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedType === 'component' && (
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              marginBottom: 4,
            }}
          >
            {t.cmsContentTypeBuilder.componentTarget}
          </label>
          <select
            value={componentTarget}
            onChange={(e) => setComponentTarget(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              backgroundColor: '#FFFFFF',
            }}
          >
            {availableComponents.map((cDef) => (
              <option key={cDef.id} value={cDef.id}>
                {cDef.name} ({cDef.id})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: 4,
          }}
        >
          {t.cmsContentTypeBuilder.defaultValue}
        </label>
        <Input
          placeholder="Default fallback value"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          size="sm"
        />
      </div>

      <div>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#334155',
            marginBottom: 4,
          }}
        >
          {t.cmsContentTypeBuilder.description}
        </label>
        <Input
          placeholder="Help text shown under field in Content Manager"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="sm"
        />
      </div>

      <div style={{ marginTop: 4 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            color: '#1E293B',
          }}
        >
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            style={{ accentColor: BUILDER_COLORS.PINK }}
          />
          <span>{t.cmsContentTypeBuilder.required}</span>
        </label>
      </div>
    </Flex>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedType
          ? t.cmsContentTypeBuilder.configureField
          : t.cmsContentTypeBuilder.selectFieldType
      }
      size="lg"
    >
      <div style={{ padding: '8px 0' }}>
        {selectedType ? renderConfigStep() : renderSelectTypeStep()}
      </div>

      <Flex
        align="center"
        justify="end"
        gap={NUMBER_EIGHT}
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid #F1F5F9',
        }}
      >
        <Button size="sm" variant="outline" onClick={onClose}>
          {t.cmsContentTypeBuilder.cancel}
        </Button>
        {selectedType && (
          <Button
            size="sm"
            variant="primary"
            onClick={handleFinish}
            disabled={!name.trim() || !id.trim()}
            style={{
              backgroundColor: BUILDER_COLORS.PINK,
              borderColor: BUILDER_COLORS.PINK,
            }}
          >
            {t.cmsContentTypeBuilder.finish}
          </Button>
        )}
      </Flex>
    </Modal>
  );
};
