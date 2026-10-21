import type { FC } from 'react';
import { Flex } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { NUMBER_SIXTEEN } from '@const/numbers.const';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { useContentTypeBuilder } from './hooks/useContentTypeBuilder';
import {
  ContentTypeSidebar,
  ContentTypeFieldList,
  AddAttributeModal,
  CreateTypeModal,
  SchemaPreviewDrawer,
} from './helpers';
import type { ContentTypeBuilderProps } from './ContentTypeBuilder.types';

export const ContentTypeBuilder: FC<ContentTypeBuilderProps> = () => {
  const { t } = useI18n();
  const {
    types,
    selectedType,
    selectedTypeId,
    activeKind,
    searchQuery,
    isAddAttributeOpen,
    fieldToEdit,
    isCreateModalOpen,
    createModalKind,
    isSchemaPreviewOpen,
    isSaving,
    saveSuccess,
    availableCollections,
    availableComponents,
    setSearchQuery,
    onSelectType,
    onOpenCreateModal,
    onCloseCreateModal,
    onCreateType,
    onDeleteType,
    onOpenAddAttribute,
    onEditField,
    onCloseAddAttribute,
    onSaveField,
    onDeleteField,
    onMoveFieldUp,
    onMoveFieldDown,
    onSaveSchema,
    onOpenSchemaPreview,
    onCloseSchemaPreview,
  } = useContentTypeBuilder();

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.SCHEMA_FIELDS}>
      <Flex direction="column" gap={NUMBER_SIXTEEN} style={{ height: '100%' }}>
        <CmsPageHeader
          title={t.cmsContentTypeBuilder.title}
          subtitle={t.cmsContentTypeBuilder.subtitle}
        />

        <Flex gap={NUMBER_SIXTEEN} align="stretch" style={{ flex: 1, minHeight: '640px' }}>
          <ContentTypeSidebar
            types={types}
            selectedTypeId={selectedTypeId}
            activeKind={activeKind}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectType={onSelectType}
            onOpenCreateModal={onOpenCreateModal}
          />

          {selectedType && (
            <ContentTypeFieldList
              selectedType={selectedType}
              onAddAttributeClick={onOpenAddAttribute}
              onOpenSchemaPreview={onOpenSchemaPreview}
              onSaveSchema={onSaveSchema}
              onDeleteType={onDeleteType}
              onEditField={onEditField}
              onDeleteField={onDeleteField}
              onMoveFieldUp={onMoveFieldUp}
              onMoveFieldDown={onMoveFieldDown}
              isSaving={isSaving}
              saveSuccess={saveSuccess}
            />
          )}
        </Flex>

        <AddAttributeModal
          isOpen={isAddAttributeOpen}
          onClose={onCloseAddAttribute}
          onSaveField={onSaveField}
          fieldToEdit={fieldToEdit}
          availableTypes={availableCollections}
          availableComponents={availableComponents}
        />

        <CreateTypeModal
          isOpen={isCreateModalOpen}
          kind={createModalKind}
          onClose={onCloseCreateModal}
          onCreateType={onCreateType}
        />

        {selectedType && (
          <SchemaPreviewDrawer
            isOpen={isSchemaPreviewOpen}
            onClose={onCloseSchemaPreview}
            selectedType={selectedType}
          />
        )}
      </Flex>
    </CmsShell>
  );
};
