import type { PageTypeDefinition, PageTypeDesignPreset, PageTypeFieldDef } from './pageTypes.types';

export const PAGE_TYPES_STORAGE_KEY = 'cms_custom_page_types';
export const PAGE_TYPES_UPDATED_EVENT = 'cms-page-types-updated';

export const BUILT_IN_PAGE_TYPES: PageTypeDefinition[] = [
  {
    id: 'articles',
    name: 'Articles',
    kind: 'collection',
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
    kind: 'collection',
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
    kind: 'collection',
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
    kind: 'collection',
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
  {
    id: 'homepage',
    name: 'Homepage',
    kind: 'single',
    description: 'Main landing page layout and hero sections',
    iconName: 'Layers',
    designPreset: 'landing',
    color: '#EC4899',
    isBuiltIn: true,
    fields: [
      { id: 'heroHeadline', name: 'Hero Headline', type: 'text', required: true },
      { id: 'heroSubtitle', name: 'Hero Subtitle', type: 'text' },
      { id: 'ctaText', name: 'Call To Action Text', type: 'text' },
      { id: 'ctaLink', name: 'Call To Action URL', type: 'text' },
      { id: 'heroImage', name: 'Hero Banner Image', type: 'media' },
    ],
  },
  {
    id: 'global-seo',
    name: 'Global SEO',
    kind: 'single',
    description: 'Default search engine and social open graph metadata',
    iconName: 'Tag',
    designPreset: 'blank',
    color: '#06B6D4',
    isBuiltIn: true,
    fields: [
      { id: 'siteName', name: 'Site Name', type: 'text', required: true },
      { id: 'metaTitle', name: 'Meta Title', type: 'text', required: true },
      { id: 'metaDescription', name: 'Meta Description', type: 'text' },
      { id: 'ogImage', name: 'Open Graph Image', type: 'media' },
      { id: 'twitterHandle', name: 'Twitter / X Handle', type: 'text' },
    ],
  },
  {
    id: 'footer',
    name: 'Footer',
    kind: 'single',
    description: 'Global footer navigation links, copyright, and disclaimers',
    iconName: 'Bookmark',
    designPreset: 'blank',
    color: '#64748B',
    isBuiltIn: true,
    fields: [
      { id: 'copyrightText', name: 'Copyright Text', type: 'text', required: true },
      { id: 'contactEmail', name: 'Contact Email', type: 'text' },
      { id: 'disclaimer', name: 'Disclaimer Notice', type: 'rich-text' },
    ],
  },
  {
    id: 'seo-block',
    name: 'SEO Block',
    kind: 'component',
    description: 'Reusable SEO metadata structure for pages and posts',
    iconName: 'Sparkles',
    designPreset: 'blank',
    color: '#F59E0B',
    isBuiltIn: true,
    fields: [
      { id: 'metaTitle', name: 'Meta Title', type: 'text', required: true },
      { id: 'metaDescription', name: 'Meta Description', type: 'text' },
      { id: 'canonicalUrl', name: 'Canonical URL', type: 'text' },
    ],
  },
  {
    id: 'social-links',
    name: 'Social Links',
    kind: 'component',
    description: 'Reusable social platform links with URLs and icons',
    iconName: 'Grid',
    designPreset: 'blank',
    color: '#14B8A6',
    isBuiltIn: true,
    fields: [
      { id: 'platform', name: 'Platform Name', type: 'text', required: true },
      { id: 'url', name: 'Profile URL', type: 'text', required: true },
      { id: 'isEnabled', name: 'Is Enabled', type: 'boolean' },
    ],
  },
  {
    id: 'pricing-tier',
    name: 'Pricing Tier',
    kind: 'component',
    description: 'Reusable pricing plan card with features and rates',
    iconName: 'Database',
    designPreset: 'blank',
    color: '#6366F1',
    isBuiltIn: true,
    fields: [
      { id: 'planName', name: 'Plan Name', type: 'text', required: true },
      { id: 'price', name: 'Price (USD)', type: 'number', required: true },
      { id: 'interval', name: 'Billing Interval', type: 'text' },
      { id: 'isPopular', name: 'Highlighted Tier', type: 'boolean' },
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
    return [...BUILT_IN_PAGE_TYPES, ...customFiltered].map((item) => ({
      ...item,
      kind: item.kind || 'collection',
    }));
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
