export type ViewMode = 'grid' | 'list';

export type AssetTypeFilter = 'all' | 'image' | 'video' | 'document';

export type CropPreset = 'original' | '1:1' | '16:9' | '4:3';

export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  itemCount: number;
}

export interface MediaAssetItem {
  id: string;
  publicId: string;
  url: string;
  secureUrl?: string;
  resourceType: 'image' | 'video' | 'raw';
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
  folder?: string;
  createdAt?: string;
  tags?: string[];
}
