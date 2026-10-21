import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PageTypeDefinition, PageTypeFieldDef, PageTypeKind } from '../../ContentPages/pageTypes.types';
import {
  loadAllPageTypes,
  saveCustomPageType,
  deleteCustomPageType,
  PAGE_TYPES_UPDATED_EVENT,
} from '../../ContentPages/pageTypes.utils';
import {
  CONTENT_TYPE_KINDS,
  BUILDER_STORAGE_KEY_ACTIVE_TYPE,
  BUILDER_STORAGE_KEY_ACTIVE_KIND,
  BUILDER_SUCCESS_TIMEOUT_MS,
  BUILDER_EMPTY_STRING,
} from '../ContentTypeBuilder.const';
import { moveFieldUp, moveFieldDown } from '../ContentTypeBuilder.utils';

/**
 * Custom hook to manage state, schema persistence, modal visibilities,
 * and field mutations for the Content-Type Builder workspace.
 *
 * @returns State properties and handler methods for managing content types and schemas.
 */
export const useContentTypeBuilder = () => {
  const [types, setTypes] = useState<PageTypeDefinition[]>(() => loadAllPageTypes());
  const [activeKind, setActiveKind] = useState<PageTypeKind>(() => {
    const saved = localStorage.getItem(BUILDER_STORAGE_KEY_ACTIVE_KIND);
    if (saved === CONTENT_TYPE_KINDS.SINGLE || saved === CONTENT_TYPE_KINDS.COMPONENT) {
      return saved as PageTypeKind;
    }
    return CONTENT_TYPE_KINDS.COLLECTION;
  });

  const [selectedTypeId, setSelectedTypeId] = useState<string>(() => {
    const saved = localStorage.getItem(BUILDER_STORAGE_KEY_ACTIVE_TYPE);
    if (saved) return saved;
    const initialList = loadAllPageTypes();
    const firstCollection = initialList.find((t) => t.kind !== 'single' && t.kind !== 'component');
    return firstCollection ? firstCollection.id : (initialList[0]?.id || 'articles');
  });

  const [searchQuery, setSearchQuery] = useState(BUILDER_EMPTY_STRING);
  const [isAddAttributeOpen, setIsAddAttributeOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<PageTypeFieldDef | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalKind, setCreateModalKind] = useState<PageTypeKind>(CONTENT_TYPE_KINDS.COLLECTION);
  const [isSchemaPreviewOpen, setIsSchemaPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync types whenever custom types change
  useEffect(() => {
    const handleUpdated = () => {
      setTypes(loadAllPageTypes());
    };
    window.addEventListener(PAGE_TYPES_UPDATED_EVENT, handleUpdated);
    return () => window.removeEventListener(PAGE_TYPES_UPDATED_EVENT, handleUpdated);
  }, []);

  const selectedType = useMemo(() => {
    return types.find((t) => t.id === selectedTypeId) || types[0];
  }, [types, selectedTypeId]);

  const onSelectType = useCallback((type: PageTypeDefinition) => {
    setSelectedTypeId(type.id);
    setActiveKind(type.kind || CONTENT_TYPE_KINDS.COLLECTION);
    localStorage.setItem(BUILDER_STORAGE_KEY_ACTIVE_TYPE, type.id);
    if (type.kind) {
      localStorage.setItem(BUILDER_STORAGE_KEY_ACTIVE_KIND, type.kind);
    }
  }, []);

  const onOpenCreateModal = useCallback((kind: PageTypeKind) => {
    setCreateModalKind(kind);
    setIsCreateModalOpen(true);
  }, []);

  const onCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const onCreateType = useCallback((newType: PageTypeDefinition) => {
    saveCustomPageType(newType);
    setTypes(loadAllPageTypes());
    setSelectedTypeId(newType.id);
    setActiveKind(newType.kind || CONTENT_TYPE_KINDS.COLLECTION);
    setIsCreateModalOpen(false);
  }, []);

  const onDeleteType = useCallback((id: string) => {
    deleteCustomPageType(id);
    const updated = loadAllPageTypes();
    setTypes(updated);
    if (selectedTypeId === id) {
      const fallback = updated[0];
      if (fallback) {
        setSelectedTypeId(fallback.id);
        setActiveKind(fallback.kind || CONTENT_TYPE_KINDS.COLLECTION);
      }
    }
  }, [selectedTypeId]);

  const onOpenAddAttribute = useCallback(() => {
    setFieldToEdit(null);
    setIsAddAttributeOpen(true);
  }, []);

  const onEditField = useCallback((field: PageTypeFieldDef) => {
    setFieldToEdit(field);
    setIsAddAttributeOpen(true);
  }, []);

  const onCloseAddAttribute = useCallback(() => {
    setIsAddAttributeOpen(false);
    setFieldToEdit(null);
  }, []);

  const onSaveField = useCallback((field: PageTypeFieldDef) => {
    if (!selectedType) return;
    const existingIndex = selectedType.fields.findIndex((f) => f.id === field.id);
    let nextFields: PageTypeFieldDef[];

    if (existingIndex >= 0) {
      nextFields = selectedType.fields.map((f, i) => (i === existingIndex ? field : f));
    } else {
      nextFields = [...selectedType.fields, field];
    }

    const updatedType: PageTypeDefinition = {
      ...selectedType,
      fields: nextFields,
    };

    saveCustomPageType(updatedType);
    setTypes(loadAllPageTypes());
    setIsAddAttributeOpen(false);
    setFieldToEdit(null);
  }, [selectedType]);

  const onDeleteField = useCallback((fieldId: string) => {
    if (!selectedType) return;
    const nextFields = selectedType.fields.filter((f) => f.id !== fieldId);
    const updatedType: PageTypeDefinition = {
      ...selectedType,
      fields: nextFields,
    };
    saveCustomPageType(updatedType);
    setTypes(loadAllPageTypes());
  }, [selectedType]);

  const onMoveFieldUp = useCallback((fieldId: string) => {
    if (!selectedType) return;
    const nextFields = moveFieldUp(selectedType.fields, fieldId);
    const updatedType: PageTypeDefinition = {
      ...selectedType,
      fields: nextFields,
    };
    saveCustomPageType(updatedType);
    setTypes(loadAllPageTypes());
  }, [selectedType]);

  const onMoveFieldDown = useCallback((fieldId: string) => {
    if (!selectedType) return;
    const nextFields = moveFieldDown(selectedType.fields, fieldId);
    const updatedType: PageTypeDefinition = {
      ...selectedType,
      fields: nextFields,
    };
    saveCustomPageType(updatedType);
    setTypes(loadAllPageTypes());
  }, [selectedType]);

  const onSaveSchema = useCallback(() => {
    if (!selectedType) return;
    setIsSaving(true);
    saveCustomPageType(selectedType);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), BUILDER_SUCCESS_TIMEOUT_MS);
    }, 400);
  }, [selectedType]);

  const onOpenSchemaPreview = useCallback(() => {
    setIsSchemaPreviewOpen(true);
  }, []);

  const onCloseSchemaPreview = useCallback(() => {
    setIsSchemaPreviewOpen(false);
  }, []);

  const availableCollections = useMemo(() => {
    return types.filter((t) => t.kind !== 'single' && t.kind !== 'component');
  }, [types]);

  const availableComponents = useMemo(() => {
    return types.filter((t) => t.kind === 'component');
  }, [types]);

  return {
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
  };
};
