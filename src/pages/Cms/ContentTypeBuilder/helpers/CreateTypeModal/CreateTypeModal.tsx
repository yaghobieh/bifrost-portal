import { useState, useEffect, type FC } from 'react';
import { Button, Flex, Input, Modal, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { NUMBER_SIX, NUMBER_EIGHT, NUMBER_TWELVE } from '@const/numbers.const';
import { BUILDER_COLORS, BUILDER_EMPTY_STRING } from '../../ContentTypeBuilder.const';
import { slugifyTypeId } from '../../ContentTypeBuilder.utils';
import type { CreateTypeModalProps } from '../../ContentTypeBuilder.types';
import type { PageTypeDefinition, PageTypeDesignPreset } from '../../../ContentPages/pageTypes.types';
import { defaultFieldsForPreset } from '../../../ContentPages/pageTypes.utils';

export const CreateTypeModal: FC<CreateTypeModalProps> = ({
  isOpen,
  kind,
  onClose,
  onCreateType,
}) => {
  const { t } = useI18n();

  const [name, setName] = useState(BUILDER_EMPTY_STRING);
  const [slug, setSlug] = useState(BUILDER_EMPTY_STRING);
  const [description, setDescription] = useState(BUILDER_EMPTY_STRING);
  const [preset, setPreset] = useState<PageTypeDesignPreset>('blank');
  const [color, setColor] = useState('#EC4899');
  const [hasCustomSlug, setHasCustomSlug] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(BUILDER_EMPTY_STRING);
      setSlug(BUILDER_EMPTY_STRING);
      setDescription(BUILDER_EMPTY_STRING);
      setPreset(kind === 'single' ? 'landing' : 'blank');
      setColor(kind === 'component' ? '#F59E0B' : '#EC4899');
      setHasCustomSlug(false);
    }
  }, [isOpen, kind]);

  const onNameChange = (val: string) => {
    setName(val);
    if (!hasCustomSlug) {
      setSlug(slugifyTypeId(val));
    }
  };

  const onSlugChange = (val: string) => {
    setSlug(val);
    setHasCustomSlug(true);
  };

  const getModalTitle = () => {
    if (kind === 'single') return t.cmsContentTypeBuilder.titleSingle;
    if (kind === 'component') return t.cmsContentTypeBuilder.titleComponent;
    return t.cmsContentTypeBuilder.titleCollection;
  };

  const handleCreate = () => {
    if (!name.trim() || !slug.trim()) return;

    const baseFields = defaultFieldsForPreset(preset);

    const newDef: PageTypeDefinition = {
      id: slug.trim(),
      name: name.trim(),
      kind,
      description: description.trim(),
      iconName: kind === 'component' ? 'Sparkles' : kind === 'single' ? 'Layers' : 'FileText',
      designPreset: preset,
      color,
      fields: baseFields,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
    };

    onCreateType(newDef);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="md">
      <Flex direction="column" gap={NUMBER_TWELVE} style={{ padding: '8px 0' }}>
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
            {t.cmsContentTypeBuilder.typeName} *
          </label>
          <Input
            placeholder="e.g. Products, FAQ Item, Header"
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
            {t.cmsContentTypeBuilder.typeSlug} *
          </label>
          <Input
            placeholder="e.g. products, faq-item, header"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
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
            {t.cmsContentTypeBuilder.typeDesc}
          </label>
          <Input
            placeholder="Brief summary of this data model"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="sm"
          />
        </div>

        {kind !== 'component' && (
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
              Starter Preset
            </label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as PageTypeDesignPreset)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="blank">Blank Schema</option>
              <option value="article">Editorial Article</option>
              <option value="blog">Blog Post</option>
              <option value="catalog">Product / Item Catalog</option>
              <option value="landing">Page / Landing View</option>
              <option value="doc">Developer Documentation</option>
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
            {t.cmsContentTypeBuilder.color}
          </label>
          <Flex align="center" gap={NUMBER_EIGHT}>
            {['#EA0A8E', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4', '#64748B'].map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '2px solid #0F172A' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ),
            )}
          </Flex>
        </div>
      </Flex>

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
        <Button
          size="sm"
          variant="primary"
          onClick={handleCreate}
          disabled={!name.trim() || !slug.trim()}
          style={{
            backgroundColor: BUILDER_COLORS.PINK,
            borderColor: BUILDER_COLORS.PINK,
          }}
        >
          {t.cmsContentTypeBuilder.create}
        </Button>
      </Flex>
    </Modal>
  );
};
