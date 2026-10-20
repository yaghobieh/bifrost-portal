export type PageTypeDesignPreset =
  | 'article'
  | 'blog'
  | 'doc'
  | 'landing'
  | 'catalog'
  | 'blank';

export type PageTypeKind = 'collection' | 'single' | 'component';

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

export type PageTypeDefinition = {
  id: string;
  name: string;
  kind?: PageTypeKind;
  description: string;
  iconName: string;
  designPreset: PageTypeDesignPreset;
  color?: string;
  fields: PageTypeFieldDef[];
  isBuiltIn?: boolean;
  createdAt?: string;
};

