export type PageTypeDesignPreset =
  | 'article'
  | 'blog'
  | 'doc'
  | 'landing'
  | 'catalog'
  | 'blank';

export type PageTypeFieldType =
  | 'text'
  | 'rich-text'
  | 'image'
  | 'tags'
  | 'author'
  | 'date'
  | 'boolean'
  | 'number';

export type PageTypeFieldDef = {
  id: string;
  name: string;
  type: PageTypeFieldType;
  required?: boolean;
  defaultValue?: string;
  description?: string;
};

export type PageTypeDefinition = {
  id: string; // collection slug, e.g. 'blog', 'articles', 'case-studies'
  name: string; // Human label, e.g. 'Blog', 'Articles', 'Case Studies'
  description: string;
  iconName: string; // Key for BearIcons: 'FileText' | 'Bookmark' | 'Layers' | 'Grid' | 'Folder' | 'Sparkles' | 'Tag' | 'Database'
  designPreset: PageTypeDesignPreset;
  color?: string;
  fields: PageTypeFieldDef[];
  isBuiltIn?: boolean;
  createdAt?: string;
};
