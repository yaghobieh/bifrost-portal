import type { FC } from 'react';
import { BearIcons, Button, Card, Flex, Input, Typography } from '@forgedevstack/bear';
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
import { CONTENT_TYPE_KINDS, BUILDER_ICON_SIZE_MD, BUILDER_COLORS } from '../../ContentTypeBuilder.const';
import type { ContentTypeSidebarProps } from '../../ContentTypeBuilder.types';
import type { PageTypeDefinition, PageTypeKind } from '../../../ContentPages/pageTypes.types';

export const ContentTypeSidebar: FC<ContentTypeSidebarProps> = ({
  types,
  selectedTypeId,
  searchQuery,
  onSearchChange,
  onSelectType,
  onOpenCreateModal,
}) => {
  const { t } = useI18n();

  const query = searchQuery.trim().toLowerCase();
  const filterByQuery = (item: PageTypeDefinition) => {
    if (!query) return true;
    return item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
  };

  const collectionTypes = types
    .filter((t) => t.kind !== 'single' && t.kind !== 'component')
    .filter(filterByQuery);

  const singleTypes = types
    .filter((t) => t.kind === 'single')
    .filter(filterByQuery);

  const componentTypes = types
    .filter((t) => t.kind === 'component')
    .filter(filterByQuery);

  const renderSectionHeader = (
    title: string,
    count: number,
    kind: PageTypeKind,
  ) => (
    <Flex
      align="center"
      justify="between"
      style={{
        padding: '8px 12px',
        marginBottom: 4,
      }}
    >
      <Flex align="center" gap={NUMBER_SIX}>
        <Typography
          variant="caption"
          style={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '11px',
            color: '#64748B',
          }}
        >
          {title}
        </Typography>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            background: '#F1F5F9',
            color: '#475569',
            borderRadius: '9999px',
            padding: '1px 6px',
          }}
        >
          {count}
        </span>
      </Flex>
      <Button
        size="xs"
        variant="ghost"
        onClick={() => onOpenCreateModal(kind)}
        style={{ padding: '2px 6px', height: '24px' }}
      >
        <BearIcons.PlusIcon size={NUMBER_FOURTEEN} />
      </Button>
    </Flex>
  );

  const renderItemList = (items: PageTypeDefinition[]) => {
    if (items.length === 0) {
      return (
        <div style={{ padding: '8px 12px', color: '#94A3B8', fontSize: '12px' }}>
          {t.cmsContentTypeBuilder.noFields}
        </div>
      );
    }

    return (
      <Flex direction="column" gap={NUMBER_FOUR} style={{ padding: '0 8px 12px 8px' }}>
        {items.map((item) => {
          const isSelected = item.id === selectedTypeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectType(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                border: isSelected
                  ? `1px solid ${BUILDER_COLORS.PINK}`
                  : '1px solid transparent',
                background: isSelected
                  ? '#FDF2F8'
                  : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.15s ease',
              }}
            >
              <Flex align="center" gap={NUMBER_EIGHT}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: item.color || BUILDER_COLORS.PINK,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? '#BE185D' : '#1E293B',
                  }}
                >
                  {item.name}
                </span>
              </Flex>
              <span
                style={{
                  fontSize: '11px',
                  color: isSelected ? '#BE185D' : '#94A3B8',
                  fontFamily: 'monospace',
                }}
              >
                {item.fields.length}
              </span>
            </button>
          );
        })}
      </Flex>
    );
  };

  return (
    <Card
      style={{
        width: '280px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '620px',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '12px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <Input
          placeholder={t.cmsContentTypeBuilder.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="sm"
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Collection Types */}
        {renderSectionHeader(
          t.cmsContentTypeBuilder.collectionTypes,
          collectionTypes.length,
          CONTENT_TYPE_KINDS.COLLECTION,
        )}
        {renderItemList(collectionTypes)}

        <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '4px 0 8px 0' }} />

        {/* Single Types */}
        {renderSectionHeader(
          t.cmsContentTypeBuilder.singleTypes,
          singleTypes.length,
          CONTENT_TYPE_KINDS.SINGLE,
        )}
        {renderItemList(singleTypes)}

        <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '4px 0 8px 0' }} />

        {/* Components */}
        {renderSectionHeader(
          t.cmsContentTypeBuilder.components,
          componentTypes.length,
          CONTENT_TYPE_KINDS.COMPONENT,
        )}
        {renderItemList(componentTypes)}
      </div>
    </Card>
  );
};
