import type { PageTypeDefinition, PageTypeDesignPreset, PageTypeFieldDef } from './pageTypes.types';

export const PAGE_TYPES_STORAGE_KEY = 'cms_custom_page_types';
export const PAGE_TYPES_UPDATED_EVENT = 'cms-page-types-updated';

export const BUILT_IN_PAGE_TYPES: PageTypeDefinition[] = [
  {
    id: 'articles',
    name: 'Articles',
    description: 'Long-form editorial and technical articles with dedicated DB collection',
    iconName: 'FileText',
    designPreset: 'article',
    color: '#EA0A8E',
    isBuiltIn: true,
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'slug', name: 'Slug', type: 'text', required: true },
      { id: 'lead', name: 'Lead / Excerpt', type: 'text' },
      { id: 'body', name: 'Body', type: 'rich-text', required: true },
      { id: 'featuredImage', name: 'Featured Image', type: 'image' },
      { id: 'author', name: 'Author', type: 'author' },
      { id: 'categories', name: 'Categories', type: 'tags' },
      { id: 'tags', name: 'Tags', type: 'tags' },
    ],
  },
  {
    id: 'pages',
    name: 'Pages',
    description: 'Standard site pages, policy documents, and custom layout views',
    iconName: 'Layers',
    designPreset: 'landing',
    color: '#3B82F6',
    isBuiltIn: true,
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'slug', name: 'Slug', type: 'text', required: true },
      { id: 'body', name: 'Content Blocks', type: 'rich-text' },
      { id: 'seoTitle', name: 'SEO Title', type: 'text' },
      { id: 'seoDesc', name: 'Meta Description', type: 'text' },
    ],
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Chronological posts, press announcements, and company news stories',
    iconName: 'Bookmark',
    designPreset: 'blog',
    color: '#8B5CF6',
    isBuiltIn: true,
    fields: [
      { id: 'title', name: 'Title', type: 'text', required: true },
      { id: 'slug', name: 'Slug', type: 'text', required: true },
      { id: 'excerpt', name: 'Excerpt', type: 'text' },
      { id: 'body', name: 'Post Body', type: 'rich-text', required: true },
      { id: 'coverImage', name: 'Cover Image', type: 'image' },
      { id: 'author', name: 'Author', type: 'author' },
      { id: 'publishDate', name: 'Publish Date', type: 'date' },
      { id: 'tags', name: 'Tags', type: 'tags' },
    ],
  },
  {
    id: 'docs',
    name: 'Documentation',
    description: 'Technical guides, API references, and developer documentation guides',
    iconName: 'Folder',
    designPreset: 'doc',
    color: '#10B981',
    isBuiltIn: true,
    fields: [
      { id: 'title', name: 'Doc Title', type: 'text', required: true },
      { id: 'slug', name: 'Slug', type: 'text', required: true },
      { id: 'lead', name: 'Overview', type: 'text' },
      { id: 'body', name: 'Guide Content', type: 'rich-text' },
      { id: 'steps', name: 'Steps & Snippets', type: 'text' },
    ],
  },
];

export const loadAllPageTypes = (): PageTypeDefinition[] => {
  try {
    const raw = localStorage.getItem(PAGE_TYPES_STORAGE_KEY);
    if (!raw) return BUILT_IN_PAGE_TYPES;
    const customList = JSON.parse(raw) as PageTypeDefinition[];
    if (!Array.isArray(customList)) return BUILT_IN_PAGE_TYPES;

    // Filter out duplicates with built-ins
    const customFiltered = customList.filter(
      (c) => !BUILT_IN_PAGE_TYPES.some((b) => b.id === c.id),
    );
    return [...BUILT_IN_PAGE_TYPES, ...customFiltered];
  } catch {
    return BUILT_IN_PAGE_TYPES;
  }
};

export const saveCustomPageType = (newType: PageTypeDefinition): void => {
  try {
    const current = loadAllPageTypes();
    const existingIndex = current.findIndex((item) => item.id === newType.id);
    let updated: PageTypeDefinition[];

    if (existingIndex >= 0) {
      updated = current.map((item, idx) => (idx === existingIndex ? newType : item));
    } else {
      updated = [...current, newType];
    }

    const customOnly = updated.filter((item) => !item.isBuiltIn);
    localStorage.setItem(PAGE_TYPES_STORAGE_KEY, JSON.stringify(customOnly));
    window.dispatchEvent(new CustomEvent(PAGE_TYPES_UPDATED_EVENT, { detail: newType }));
  } catch {
    // ignore local storage error
  }
};

export const deleteCustomPageType = (id: string): void => {
  try {
    const current = loadAllPageTypes();
    const updated = current.filter((item) => item.id !== id && !item.isBuiltIn);
    localStorage.setItem(PAGE_TYPES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(PAGE_TYPES_UPDATED_EVENT, { detail: { id } }));
  } catch {
    // ignore
  }
};

export const defaultFieldsForPreset = (preset: PageTypeDesignPreset): PageTypeFieldDef[] => {
  switch (preset) {
    case 'blog':
      return [
        { id: 'title', name: 'Title', type: 'text', required: true },
        { id: 'slug', name: 'Slug', type: 'text', required: true },
        { id: 'excerpt', name: 'Summary / Excerpt', type: 'text' },
        { id: 'body', name: 'Post Content', type: 'rich-text', required: true },
        { id: 'coverImage', name: 'Cover Image', type: 'image' },
        { id: 'author', name: 'Author', type: 'author' },
        { id: 'publishDate', name: 'Publish Date', type: 'date' },
        { id: 'categories', name: 'Categories', type: 'tags' },
      ];
    case 'article':
      return [
        { id: 'title', name: 'Title', type: 'text', required: true },
        { id: 'slug', name: 'Slug', type: 'text', required: true },
        { id: 'lead', name: 'Lead paragraph', type: 'text' },
        { id: 'body', name: 'Article Body', type: 'rich-text', required: true },
        { id: 'featuredImage', name: 'Hero Image', type: 'image' },
        { id: 'author', name: 'Byline Author', type: 'author' },
        { id: 'tags', name: 'Tags', type: 'tags' },
      ];
    case 'doc':
      return [
        { id: 'title', name: 'Page Title', type: 'text', required: true },
        { id: 'slug', name: 'Doc Slug', type: 'text', required: true },
        { id: 'lead', name: 'Overview', type: 'text' },
        { id: 'body', name: 'Guide & Code Blocks', type: 'rich-text' },
      ];
    case 'catalog':
      return [
        { id: 'title', name: 'Item Name', type: 'text', required: true },
        { id: 'slug', name: 'Item Slug', type: 'text', required: true },
        { id: 'description', name: 'Description', type: 'rich-text' },
        { id: 'coverImage', name: 'Gallery Image', type: 'image' },
        { id: 'price', name: 'Price / Tier', type: 'text' },
        { id: 'tags', name: 'Badges', type: 'tags' },
      ];
    case 'landing':
      return [
        { id: 'title', name: 'Hero Headline', type: 'text', required: true },
        { id: 'slug', name: 'URL Slug', type: 'text', required: true },
        { id: 'lead', name: 'Subheadline', type: 'text' },
        { id: 'body', name: 'Canvas & Sections', type: 'rich-text' },
        { id: 'seoTitle', name: 'SEO Meta Title', type: 'text' },
        { id: 'seoDesc', name: 'SEO Meta Description', type: 'text' },
      ];
    case 'blank':
    default:
      return [
        { id: 'title', name: 'Title', type: 'text', required: true },
        { id: 'slug', name: 'Slug', type: 'text', required: true },
        { id: 'body', name: 'Body', type: 'rich-text' },
      ];
  }
};
