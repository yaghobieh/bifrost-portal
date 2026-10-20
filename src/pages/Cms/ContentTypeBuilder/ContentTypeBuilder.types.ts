import type { FC, ReactNode } from 'react';
import type { PageTypeDefinition, PageTypeFieldDef, PageTypeFieldType, PageTypeKind } from '../ContentPages/pageTypes.types';

export interface ContentTypeBuilderProps {
  className?: string;
}

export interface AttributeTypeOption {
  type: PageTypeFieldType;
  labelKey: string;
  descKey: string;
  iconName: string;
  color: string;
}

export interface ContentTypeSidebarProps {
  types: PageTypeDefinition[];
  selectedTypeId: string;
  activeKind: PageTypeKind;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectType: (type: PageTypeDefinition) => void;
  onOpenCreateModal: (kind: PageTypeKind) => void;
}

export interface ContentTypeFieldListProps {
  selectedType: PageTypeDefinition;
  onAddAttributeClick: () => void;
  onOpenSchemaPreview: () => void;
  onSaveSchema: () => void;
  onDeleteType: (id: string) => void;
  onEditField: (field: PageTypeFieldDef) => void;
  onDeleteField: (fieldId: string) => void;
  onMoveFieldUp: (fieldId: string) => void;
  onMoveFieldDown: (fieldId: string) => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export interface AddAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveField: (field: PageTypeFieldDef) => void;
  fieldToEdit?: PageTypeFieldDef | null;
  availableTypes: PageTypeDefinition[];
  availableComponents: PageTypeDefinition[];
}

export interface CreateTypeModalProps {
  isOpen: boolean;
  kind: PageTypeKind;
  onClose: () => void;
  onCreateType: (type: PageTypeDefinition) => void;
}

export interface SchemaPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: PageTypeDefinition;
}

export interface FieldIconProps {
  type: PageTypeFieldType;
  size?: number;
}
