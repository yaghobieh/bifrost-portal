import { useState, type FC } from 'react';
import { Badge, BearIcons, Button, Flex, Typography } from '@forgedevstack/bear';
import type {
  PageTypeDefinition,
  PageTypeDesignPreset,
  PageTypeFieldDef,
  PageTypeFieldType,
  PostTypeCategory,
  PostTypeStructure,
} from '../../pageTypes.types';
import { defaultFieldsForPreset, saveCustomPageType } from '../../pageTypes.utils';

interface CreatePageTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newType: PageTypeDefinition) => void;
}

const POST_TYPE_CATEGORIES: Array<{
  id: PostTypeCategory;
  title: string;
  badge: string;
  description: string;
  icon: string;
  defaultPreset: PageTypeDesignPreset;
  defaultStructure: PostTypeStructure;
  defaultName: string;
  defaultSlug: string;
}> = [
  {
    id: 'page',
    title: 'Pages',
    badge: 'Standard Page',
    description: 'Hierarchical or standalone pages (e.g. Home, About Us, Privacy Policy, Landing).',
    icon: '📄',
    defaultPreset: 'landing',
    defaultStructure: 'single',
    defaultName: 'New Page',
    defaultSlug: 'pages',
  },
  {
    id: 'article',
    title: 'Articles',
    badge: 'Editorial',
    description: 'In-depth editorial articles, whitepapers, thought leadership, and long-form publications.',
    icon: '📰',
    defaultPreset: 'article',
    defaultStructure: 'multi',
    defaultName: 'Articles',
    defaultSlug: 'articles',
  },
  {
    id: 'blog',
    title: 'Blog',
    badge: 'Chronological',
    description: 'News posts, release updates, author bylines, tags, and chronological feeds.',
    icon: '✍️',
    defaultPreset: 'blog',
    defaultStructure: 'multi',
    defaultName: 'Blog Posts',
    defaultSlug: 'blog',
  },
  {
    id: 'custom',
    title: 'Custom Post Type',
    badge: 'Custom Schema',
    description: 'Fully customized data model tailored to your exact business needs.',
    icon: '⚙️',
    defaultPreset: 'blank',
    defaultStructure: 'multi',
    defaultName: 'Custom Type',
    defaultSlug: 'custom',
  },
];

const TEMPLATE_PRESETS: Array<{
  id: PageTypeDesignPreset;
  title: string;
  badge: string;
  description: string;
  preview: string;
}> = [
  {
    id: 'blog',
    title: 'Blog & Announcements Template',
    badge: 'Chronological',
    description: 'Hero cover image, author byline, publication timestamp, rich text body, and category tags.',
    preview: '👤 Byline • 📅 Timestamp • 🏷️ Categories • 💬 Comments',
  },
  {
    id: 'article',
    title: 'Editorial & Long-form Template',
    badge: 'Editorial',
    description: 'Lead abstract, reading time, table of contents, citations, and markdown body.',
    preview: '📰 Lead Abstract • 📑 Table of Contents • 🔤 Rich Typography • 🔖 Citations',
  },
  {
    id: 'landing',
    title: 'Marketing & Landing Showcase Template',
    badge: 'Commercial',
    description: 'Hero headline, CTA buttons, feature cards grid, statistics, and testimonials.',
    preview: '🚀 Hero Headline • 🔘 CTA Buttons • 🌟 Feature Grid • 📊 Stats',
  },
  {
    id: 'doc',
    title: 'Documentation & Guide Template',
    badge: 'Developer',
    description: 'Step-by-step tutorial blocks, syntax-highlighted code tabs, bash copy commands, and callouts.',
    preview: '⚡ Quickstart • 💻 Code Snippets • 📦 npm install • ℹ️ Callouts',
  },
  {
    id: 'blank',
    title: 'Blank Canvas Template',
    badge: 'Freeform',
    description: 'Minimal slate with custom schema fields and visual builder support.',
    preview: '🎨 Clean Schema • 🧩 Custom Fields • 🔌 API Ready',
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
  const [selectedCategory, setSelectedCategory] = useState<PostTypeCategory>('article');
  const [structureMode, setStructureMode] = useState<PostTypeStructure>('multi');
  const [name, setName] = useState('Articles');
  const [slug, setSlug] = useState('articles');
  const [description, setDescription] = useState('Editorial publications and articles');
  const [selectedIcon, setSelectedIcon] = useState('FileText');
  const [selectedPreset, setSelectedPreset] = useState<PageTypeDesignPreset>('article');
  const [hasTemplate, setHasTemplate] = useState(true);
  const [fields, setFields] = useState<PageTypeFieldDef[]>(() => defaultFieldsForPreset('article'));

  // Custom field add state
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<PageTypeFieldType>('text');

  if (!isOpen) return null;

  const handleCategorySelect = (cat: PostTypeCategory) => {
    setSelectedCategory(cat);
    const meta = POST_TYPE_CATEGORIES.find((c) => c.id === cat);
    if (meta) {
      setName(meta.defaultName);
      setSlug(meta.defaultSlug);
      setSelectedPreset(meta.defaultPreset);
      setStructureMode(meta.defaultStructure);
      setDescription(meta.description);
      setFields(defaultFieldsForPreset(meta.defaultPreset));
    }
  };

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
      postTypeCategory: selectedCategory,
      structureMode,
      hasTemplate,
      templateId: selectedPreset,
      description: description.trim() || `${name} content type`,
      iconName: selectedIcon,
      designPreset: selectedPreset,
      color: '#1e3a8a',
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
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm">
                ＋
              </span>
              <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-0">
                Add Post Type & Content Model
              </Typography>
            </div>
            <Typography variant="body2" className="text-xs text-gray-500 mt-1">
              Create post types like Pages, Articles, Blog, or Custom Models with templates and multi-item collections
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
          {/* Section 1: Choose Post Type Kind */}
          <div className="space-y-3">
            <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              1. Choose Post Type Category
            </Typography>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {POST_TYPE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1e3a8a] bg-blue-50/50 shadow-sm ring-1 ring-[#1e3a8a]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div className="font-bold text-gray-900 text-sm">{cat.title}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                      {cat.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Structure Mode (Multi vs Single) */}
          <div className="space-y-3">
            <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              2. Content Structure Model
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStructureMode('multi')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  structureMode === 'multi'
                    ? 'border-[#1e3a8a] bg-blue-50/50 shadow-sm ring-1 ring-[#1e3a8a]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-900">📚 Multi-Item Collection</span>
                  <Badge variant="info" className="text-[10px]">Collection</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-0">
                  Multiple entries with listing table, pagination, search, and filtering (e.g. multiple blog posts, news articles).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStructureMode('single')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  structureMode === 'single'
                    ? 'border-[#1e3a8a] bg-blue-50/50 shadow-sm ring-1 ring-[#1e3a8a]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-gray-900">📄 Single-Item Document</span>
                  <Badge variant="outline" className="text-[10px]">Single</Badge>
                </div>
                <p className="text-xs text-gray-500 mb-0">
                  A unique standalone document with no listing (e.g. Homepage, About, Contact, Terms).
                </p>
              </button>
            </div>
          </div>

          {/* Section 3: Identity & API Route */}
          <div className="space-y-4">
            <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              3. Identifier & Database Routing
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Post Type Name <span className="text-[#1e3a8a]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Articles, Press Releases, Team"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Collection Slug & API Path <span className="text-[#1e3a8a]">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-2.5 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-xs font-mono">
                    /api/
                  </span>
                  <input
                    type="text"
                    placeholder="articles"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm font-mono"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
              />
            </div>
          </div>

          {/* Section 4: Template Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                4. Starter Template & Layout Preset
              </Typography>
              <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTemplate}
                  onChange={(e) => setHasTemplate(e.target.checked)}
                  className="rounded text-[#1e3a8a] focus:ring-[#1e3a8a]"
                />
                <span>Include Template</span>
              </label>
            </div>

            {hasTemplate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATE_PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/50 border-[#1e3a8a] shadow-sm ring-1 ring-[#1e3a8a]'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-gray-900">{preset.title}</span>
                        <Badge variant="outline" className="text-[10px]">{preset.badge}</Badge>
                      </div>
                      <p className="text-[11px] text-gray-500 mb-1 leading-relaxed">
                        {preset.description}
                      </p>
                      <div className="text-[10px] font-mono text-gray-400 truncate">
                        {preset.preview}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 5: Schema Fields */}
          <div className="space-y-3">
            <Typography variant="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
              5. Schema Fields ({fields.length})
            </Typography>

            <div className="space-y-2">
              {fields.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{f.name}</span>
                    <span className="text-gray-400 font-mono">({f.id})</span>
                    <Badge variant="info" className="text-[10px] uppercase font-mono">
                      {f.type}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(f.id)}
                    className="text-gray-400 hover:text-rose-600 text-xs px-2 py-0.5"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Custom Field */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="New field name (e.g. Author, Tag, Rating)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#1e3a8a]"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as PageTypeFieldType)}
                className="px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
              >
                <option value="text">Short Text</option>
                <option value="rich-text">Rich Text / Markdown</option>
                <option value="image">Image URL</option>
                <option value="media">Media File</option>
                <option value="date">Date</option>
                <option value="author">Author</option>
                <option value="tags">Tags</option>
                <option value="boolean">Boolean Switch</option>
                <option value="number">Number</option>
              </select>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddField}
                className="text-xs"
              >
                ＋ Add Field
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="text-xs text-gray-500">
            Selected: <span className="font-bold text-gray-800">{POST_TYPE_CATEGORIES.find((c) => c.id === selectedCategory)?.title}</span> ({structureMode === 'multi' ? 'Multi-Item Collection' : 'Single Document'})
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!name.trim() || !slug.trim()}
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold"
            >
              Create Post Type
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
