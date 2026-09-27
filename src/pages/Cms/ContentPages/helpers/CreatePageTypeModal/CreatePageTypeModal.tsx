import { useState, type FC } from 'react';
import { Badge, BearIcons, Button, Flex, Typography } from '@forgedevstack/bear';
import type { PageTypeDefinition, PageTypeDesignPreset, PageTypeFieldDef, PageTypeFieldType } from '../../pageTypes.types';
import { defaultFieldsForPreset, saveCustomPageType } from '../../pageTypes.utils';

interface CreatePageTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newType: PageTypeDefinition) => void;
}

const DESIGN_PRESETS: Array<{
  id: PageTypeDesignPreset;
  title: string;
  badge: string;
  description: string;
  preview: string;
}> = [
  {
    id: 'blog',
    title: 'Blog & Announcements',
    badge: 'Chronological',
    description: 'Hero cover image, author byline, publication timestamp, rich text body, and category tags.',
    preview: '👤 Byline • 📅 Sep 27 • 🏷️ Engineering • 💬 Comments',
  },
  {
    id: 'article',
    title: 'Editorial & Long-form',
    badge: 'Editorial',
    description: 'Lead abstract, typography optimized for long reading, sidebar table of contents, and pull-quotes.',
    preview: '📰 Lead Abstract • 🔤 Sans/Serif Body • 📑 TOC • 🔖 Citations',
  },
  {
    id: 'doc',
    title: 'Documentation & Guides',
    badge: 'Developer',
    description: 'Step-by-step tutorial blocks, syntax-highlighted code tabs, bash copy commands, and callouts.',
    preview: '⚡ Quickstart • 💻 Code Snippets • 📦 npm install • ℹ️ Callouts',
  },
  {
    id: 'landing',
    title: 'Landing & Marketing',
    badge: 'Commercial',
    description: 'Hero headline with dual call-to-action buttons, 3-column feature grid, and testimonials.',
    preview: '🚀 Hero Headline • 🔘 CTA Buttons • 🌟 Feature Grid • 📊 Stats',
  },
  {
    id: 'catalog',
    title: 'Product & Catalog',
    badge: 'Showcase',
    description: 'Gallery media showcase, feature badges, specifications key-value table, and pricing tier.',
    preview: '🖼️ Gallery • 💲 Price Tier • ⚙️ Tech Specs • 🛒 Action Button',
  },
  {
    id: 'blank',
    title: 'Custom Canvas',
    badge: 'Freeform',
    description: 'Blank slate with custom schema fields and full visual builder support.',
    preview: '🎨 Unrestricted Canvas • 🧩 Drag & Drop Widgets • 🔌 API Ready',
  },
];

const AVAILABLE_ICONS = [
  { name: 'FileText', label: 'File', icon: <BearIcons.FileTextIcon size={16} /> },
  { name: 'Bookmark', label: 'Bookmark', icon: <BearIcons.BookmarkIcon size={16} /> },
  { name: 'Layers', label: 'Layers', icon: <BearIcons.LayersIcon size={16} /> },
  { name: 'Grid', label: 'Grid', icon: <BearIcons.GridIcon size={16} /> },
  { name: 'Sparkles', label: 'Sparkles', icon: <BearIcons.SparklesIcon size={16} /> },
  { name: 'Database', label: 'Database', icon: <BearIcons.DatabaseIcon size={16} /> },
  { name: 'Tag', label: 'Tag', icon: <BearIcons.TagIcon size={16} /> },
];

export const CreatePageTypeModal: FC<CreatePageTypeModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('FileText');
  const [selectedPreset, setSelectedPreset] = useState<PageTypeDesignPreset>('blog');
  const [fields, setFields] = useState<PageTypeFieldDef[]>(() => defaultFieldsForPreset('blog'));

  // Custom field add state
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<PageTypeFieldType>('text');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handlePresetSelect = (preset: PageTypeDesignPreset) => {
    setSelectedPreset(preset);
    setFields(defaultFieldsForPreset(preset));
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const fieldId = newFieldName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_');
    if (fields.some((f) => f.id === fieldId)) return;

    setFields([
      ...fields,
      {
        id: fieldId,
        name: newFieldName.trim(),
        type: newFieldType,
      },
    ]);
    setNewFieldName('');
  };

  const handleRemoveField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId));
  };

  const handleSave = () => {
    if (!name.trim() || !slug.trim()) return;

    const newType: PageTypeDefinition = {
      id: slug.trim(),
      name: name.trim(),
      description: description.trim() || `Custom ${name} collection`,
      iconName: selectedIcon,
      designPreset: selectedPreset,
      color: '#EA0A8E',
      fields,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
    };

    saveCustomPageType(newType);
    onCreated(newType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center font-bold text-sm">
                ＋
              </span>
              <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-0">
                Create New Page Type
              </Typography>
            </div>
            <Typography variant="body2" className="text-xs text-gray-500 mt-1">
              Define a new structured content collection (like Blog, Articles, Press, etc.) with custom layout and database API
            </Typography>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-800">
          {/* Section 1: General Info */}
          <div className="space-y-4">
            <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              1. Type Identity & Database Collection
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Page Type Name <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Case Studies, Blog, Products"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Collection Slug & API Path <span className="text-pink-600">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-2.5 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-xs font-mono">
                    /api/
                  </span>
                  <input
                    type="text"
                    placeholder="case-studies"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Brief summary of how this content type is used..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Collection Icon
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {AVAILABLE_ICONS.map((ic) => {
                  const isSelected = selectedIcon === ic.name;
                  return (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setSelectedIcon(ic.name)}
                      className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {ic.icon}
                      <span>{ic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Design Layout Presets */}
          <div className="space-y-3">
            <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              2. Design & Layout Preset
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DESIGN_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`p-3.5 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-pink-600 bg-pink-50/50 shadow-sm ring-1 ring-pink-500'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-pink-600' : 'bg-gray-300'
                          }`}
                        />
                        {preset.title}
                      </div>
                      <Badge variant="info" className="text-[10px] bg-pink-100 text-pink-800">
                        {preset.badge}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mb-2 leading-relaxed">
                      {preset.description}
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-[11px] font-mono text-gray-600 border border-gray-100">
                      {preset.preview}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Schema Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                3. Schema Fields ({fields.length})
              </Typography>
              <span className="text-xs text-gray-400">
                Preset defaults are auto-configured
              </span>
            </div>

            {/* Field Pills */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[50px]">
              {fields.map((field) => (
                <span
                  key={field.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-gray-200 text-xs text-gray-700 shadow-2xs"
                >
                  <span className="font-semibold">{field.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({field.type})</span>
                  {field.required && (
                    <span className="text-pink-600 text-xs font-bold">*</span>
                  )}
                  {field.id !== 'title' && field.id !== 'slug' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      className="text-gray-300 hover:text-red-500 ml-1 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Add Custom Field row */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <input
                type="text"
                placeholder="New field name (e.g. Price, Reading Time, Rating)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1 min-w-[200px] px-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as PageTypeFieldType)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="text">Text (string)</option>
                <option value="rich-text">Rich Text (HTML/MD)</option>
                <option value="image">Image URL</option>
                <option value="tags">Tags / Categories</option>
                <option value="author">Author relation</option>
                <option value="date">Date & Time</option>
                <option value="number">Number</option>
                <option value="boolean">Toggle / Boolean</option>
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddField}
                disabled={!newFieldName.trim()}
                className="border-pink-600 text-pink-600 hover:bg-pink-50 font-medium"
              >
                ＋ Add Field
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="text-xs text-gray-500">
            {slug ? (
              <span>
                Endpoint will be registered at <code className="text-pink-600 font-bold">/api/{slug}</code>
              </span>
            ) : (
              'Enter name and slug to enable creation'
            )}
          </div>
          <Flex gap={2} align="center">
            <Button size="sm" variant="ghost" onClick={onClose} className="text-gray-600">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!name.trim() || !slug.trim()}
              onClick={handleSave}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <span>Create Page Type</span>
            </Button>
          </Flex>
        </div>
      </div>
    </div>
  );
};
