import type { CropPreset, MediaFolder } from './MediaPages.types';

export const MEDIA_FILE_INPUT_ID = 'bifrost-cms-media-file';
export const MEDIA_ACCEPT =
  'image/*,video/*,application/pdf,.svg,.png,.jpg,.jpeg,.gif,.webp';

export const DEFAULT_MEDIA_FOLDERS: MediaFolder[] = [
  { id: 'all', name: 'All Media', slug: '', itemCount: 12 },
  { id: 'marketing', name: 'Marketing & Banners', slug: 'marketing', itemCount: 4 },
  { id: 'blog', name: 'Blog Imagery', slug: 'blog', itemCount: 3 },
  { id: 'avatars', name: 'User Avatars', slug: 'avatars', itemCount: 2 },
  { id: 'docs', name: 'Documents & PDFs', slug: 'docs', itemCount: 3 },
];

export const MEDIA_FOLDERS = DEFAULT_MEDIA_FOLDERS;

export const CROP_PRESETS: { id: CropPreset; label: string; aspectClass: string }[] = [
  { id: 'original', label: 'Original', aspectClass: 'aspect-auto' },
  { id: '1:1', label: '1:1 Square', aspectClass: 'aspect-square' },
  { id: '16:9', label: '16:9 Banner', aspectClass: 'aspect-video' },
  { id: '4:3', label: '4:3 Standard', aspectClass: 'aspect-[4/3]' },
];

export const SAMPLE_MEDIA_ASSETS = [
  {
    id: 'asset-1',
    publicId: 'bifrost-hero-cover',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    secureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    resourceType: 'image' as const,
    format: 'webp',
    width: 1920,
    height: 1080,
    bytes: 384000,
    folder: 'marketing',
    createdAt: '2026-10-21T14:30:00Z',
    tags: ['hero', 'abstract', 'marketing'],
  },
  {
    id: 'asset-2',
    publicId: 'feature-content-builder',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    secureUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    resourceType: 'image' as const,
    format: 'png',
    width: 1440,
    height: 900,
    bytes: 512000,
    folder: 'marketing',
    createdAt: '2026-10-20T11:15:00Z',
    tags: ['dashboard', 'builder', 'analytics'],
  },
  {
    id: 'asset-3',
    publicId: 'blog-graphql-guide',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    secureUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    resourceType: 'image' as const,
    format: 'jpg',
    width: 1200,
    height: 800,
    bytes: 245000,
    folder: 'blog',
    createdAt: '2026-10-18T09:45:00Z',
    tags: ['coding', 'graphql', 'guide'],
  },
  {
    id: 'asset-4',
    publicId: 'avatar-john-doe',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    secureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    resourceType: 'image' as const,
    format: 'webp',
    width: 800,
    height: 800,
    bytes: 112000,
    folder: 'avatars',
    createdAt: '2026-10-15T16:20:00Z',
    tags: ['avatar', 'admin'],
  },
  {
    id: 'asset-5',
    publicId: 'bifrost-architecture-whitepaper',
    url: 'https://bifrost.io/docs/whitepaper-v1.pdf',
    resourceType: 'raw' as const,
    format: 'pdf',
    bytes: 2048000,
    folder: 'docs',
    createdAt: '2026-10-12T10:00:00Z',
    tags: ['whitepaper', 'pdf', 'architecture'],
  },
];
