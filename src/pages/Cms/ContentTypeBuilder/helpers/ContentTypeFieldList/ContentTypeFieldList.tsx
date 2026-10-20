import type { FC } from 'react';
import { BearIcons, Button, Card, Flex, Typography } from '@forgedevstack/bear';
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
  BUILDER_COLORS,
  BUILDER_ICON_SIZE_MD,
  BUILDER_ICON_SIZE_SM,
  ATTRIBUTE_TYPE_OPTIONS,
} from '../../ContentTypeBuilder.const';
import type { ContentTypeFieldListProps } from '../../ContentTypeBuilder.types';
import type { PageTypeFieldDef, PageTypeFieldType } from '../../../ContentPages/pageTypes.types';

export const ContentTypeFieldList: FC<ContentTypeFieldListProps> = ({
  selectedType,
  onAddAttributeClick,
  onOpenSchemaPreview,
  onSaveSchema,
  onDeleteType,
  onEditField,
  onDeleteField,
  onMoveFieldUp,
  onMoveFieldDown,
  isSaving,
  saveSuccess,
}) => {
  const { t } = useI18n();

  const getAttributeTypeMeta = (type: PageTypeFieldType) => {
    return (
      ATTRIBUTE_TYPE_OPTIONS.find((opt) => opt.type === type) || {
        color: '#64748B',
        iconName: 'FileText',
      }
    );
  };

  const kindLabel = () => {
    if (selectedType.kind === 'single') return t.cmsContentTypeBuilder.singleTypes;
    if (selectedType.kind === 'component') return t.cmsContentTypeBuilder.components;
    return t.cmsContentTypeBuilder.collectionTypes;
  };

  const renderFieldRows = () => {
    if (!selectedType.fields || selectedType.fields.length === 0) {
      return (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            border: '1px dashed #CBD5E1',
            margin: '16px 0',
          }}
        >
          <Typography
            variant="body"
            style={{ color: '#64748B', marginBottom: '16px', fontSize: '14px' }}
          >
            {t.cmsContentTypeBuilder.noFields}
          </Typography>
          <Button
            size="sm"
            variant="primary"
            onClick={onAddAttributeClick}
            style={{ backgroundColor: BUILDER_COLORS.PINK, borderColor: BUILDER_COLORS.PINK }}
          >
            <Flex align="center" gap={NUMBER_SIX}>
              <BearIcons.PlusIcon size={BUILDER_ICON_SIZE_SM} />
              <span>{t.cmsContentTypeBuilder.addAttribute}</span>
            </Flex>
          </Button>
        </div>
      );
    }

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '10px 12px', width: '40px' }} />
              <th style={{ padding: '10px 12px' }}>{t.cmsContentTypeBuilder.fieldName}</th>
              <th style={{ padding: '10px 12px' }}>{t.cmsContentTypeBuilder.fieldId}</th>
              <th style={{ padding: '10px 12px' }}>Type</th>
              <th style={{ padding: '10px 12px' }}>Validation</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', width: '100px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedType.fields.map((field, idx) => {
              const meta = getAttributeTypeMeta(field.type);
              const isFirst = idx === 0;
              const isLast = idx === selectedType.fields.length - 1;

              return (
                <tr
                  key={field.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    fontSize: '13px',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '10px 12px' }}>
                    <Flex direction="column" gap={2}>
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => onMoveFieldUp(field.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: isFirst ? 'not-allowed' : 'pointer',
                          opacity: isFirst ? 0.3 : 0.8,
                          padding: 1,
                          lineHeight: 1,
                        }}
                        title={t.cmsContentTypeBuilder.moveUp}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => onMoveFieldDown(field.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: isLast ? 'not-allowed' : 'pointer',
                          opacity: isLast ? 0.3 : 0.8,
                          padding: 1,
                          lineHeight: 1,
                        }}
                        title={t.cmsContentTypeBuilder.moveDown}
                      >
                        ▼
                      </button>
                    </Flex>
                  </td>

                  <td style={{ padding: '10px 12px' }}>
                    <Flex direction="column" gap={2}>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{field.name}</span>
                      {field.description ? (
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          {field.description}
                        </span>
                      ) : null}
                    </Flex>
                  </td>

                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        backgroundColor: '#F1F5F9',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#334155',
                      }}
                    >
                      {field.id}
                    </span>
                  </td>

                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: `${meta.color}15`,
                        color: meta.color,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: `1px solid ${meta.color}30`,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: meta.color,
                        }}
                      />
                      {field.type}
                    </span>
                  </td>

                  <td style={{ padding: '10px 12px' }}>
                    {field.required ? (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        Required
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#94A3B8',
                          padding: '2px 8px',
                        }}
                      >
                        Optional
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <Flex align="center" justify="end" gap={NUMBER_FOUR}>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => onEditField(field)}
                        title={t.cmsContentTypeBuilder.editField}
                      >
                        <BearIcons.EditIcon size={BUILDER_ICON_SIZE_SM} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => onDeleteField(field.id)}
                        title={t.cmsContentTypeBuilder.deleteField}
                        style={{ color: '#EF4444' }}
                      >
                        <BearIcons.DeleteIcon size={BUILDER_ICON_SIZE_SM} />
                      </Button>
                    </Flex>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card
      style={{
        flex: 1,
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        minHeight: '620px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header Card */}
      <Flex
        align="center"
        justify="between"
        style={{
          borderBottom: '1px solid #F1F5F9',
          paddingBottom: '16px',
          marginBottom: '16px',
        }}
      >
        <Flex direction="column" gap={NUMBER_SIX}>
          <Flex align="center" gap={NUMBER_EIGHT}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: selectedType.color || BUILDER_COLORS.PINK,
                display: 'inline-block',
              }}
            />
            <Typography variant="h3" style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>
              {selectedType.name}
            </Typography>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: '#FDF2F8',
                color: '#BE185D',
                border: '1px solid #FCE7F3',
              }}
            >
              {kindLabel()}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
              }}
            >
              /api/{selectedType.id}
            </span>
          </Flex>

          <Typography variant="caption" style={{ color: '#64748B', fontSize: '13px' }}>
            {selectedType.description || 'Custom schema model configuration'}
          </Typography>
        </Flex>

        {/* Action Buttons */}
        <Flex align="center" gap={NUMBER_EIGHT}>
          <Button size="sm" variant="outline" onClick={onOpenSchemaPreview}>
            <Flex align="center" gap={NUMBER_SIX}>
              <BearIcons.CodeIcon size={BUILDER_ICON_SIZE_SM} />
              <span>{t.cmsContentTypeBuilder.schemaPreview}</span>
            </Flex>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onAddAttributeClick}
            style={{ color: BUILDER_COLORS.PINK, borderColor: '#FCE7F3' }}
          >
            <Flex align="center" gap={NUMBER_SIX}>
              <BearIcons.PlusIcon size={BUILDER_ICON_SIZE_SM} />
              <span>{t.cmsContentTypeBuilder.addAttribute}</span>
            </Flex>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={onSaveSchema}
            disabled={isSaving}
            style={{
              backgroundColor: saveSuccess ? BUILDER_COLORS.SUCCESS_GREEN : BUILDER_COLORS.PINK,
              borderColor: saveSuccess ? BUILDER_COLORS.SUCCESS_GREEN : BUILDER_COLORS.PINK,
            }}
          >
            <Flex align="center" gap={NUMBER_SIX}>
              <BearIcons.CheckIcon size={BUILDER_ICON_SIZE_SM} />
              <span>
                {saveSuccess
                  ? t.cmsContentTypeBuilder.saved
                  : isSaving
                    ? 'Saving…'
                    : t.cmsContentTypeBuilder.save}
              </span>
            </Flex>
          </Button>

          {!selectedType.isBuiltIn && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (window.confirm(t.cmsContentTypeBuilder.deleteConfirm)) {
                  onDeleteType(selectedType.id);
                }
              }}
              style={{ color: '#EF4444' }}
              title={t.cmsContentTypeBuilder.delete}
            >
              <BearIcons.DeleteIcon size={BUILDER_ICON_SIZE_MD} />
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Fields List */}
      <div style={{ flex: 1 }}>{renderFieldRows()}</div>
    </Card>
  );
};
