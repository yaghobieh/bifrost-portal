export type PageTypeDesignPreset =
  | 'article'
  | 'blog'
  | 'doc'
  | 'landing'
  | 'catalog'
  | 'blank';

export const PAGE_TYPE_KIND = {
  COLLECTION: 'collection',
  SINGLE: 'single',
  COMPONENT: 'component',
} as const;

export type PageTypeKind =
  (typeof PAGE_TYPE_KIND)[keyof typeof PAGE_TYPE_KIND];

export type PageTypeFieldType =
  | 'text'
  | 'rich-text'
  | 'image'
  | 'media'
  | 'tags'
  | 'author'
  | 'date'
  | 'boolean'
  | 'number'
  | 'relation'
  | 'json'
  | 'component';

export type PageTypeFieldDef = {
  id: string;
  name: string;
  type: PageTypeFieldType;
  required?: boolean;
  defaultValue?: string;
  description?: string;
  relationTarget?: string;
  componentTarget?: string;
};

export type PostTypeCategory = 'page' | 'article' | 'blog' | 'custom';
export type PostTypeStructure = 'multi' | 'single';

export type PageTypeDefinition = {
  id: string;
  name: string;
  kind?: PageTypeKind;
  postTypeCategory?: PostTypeCategory;
  structureMode?: PostTypeStructure;
  hasTemplate?: boolean;
  templateId?: string;
  description: string;
  iconName: string;
  designPreset: PageTypeDesignPreset;
  color?: string;
  fields: PageTypeFieldDef[];
  isBuiltIn?: boolean;
  createdAt?: string;
};

