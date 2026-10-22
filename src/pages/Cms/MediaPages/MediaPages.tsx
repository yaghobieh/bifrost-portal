import { useEffect, useMemo, useRef, useState, type DragEvent, type FC } from 'react';
import { useNucleus } from '@forgedevstack/synapse';
import { Badge, BearIcons, Button, Card, Flex, Input, Spinner, Typography } from '@forgedevstack/bear';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { EMPTY_STRING } from '@const/index';
import { NUMBER_ZERO } from '@const/numbers.const';
import { authNucleus, mediaNucleus } from '@sdk/index';
import { toCloudinarySrc } from '@sdk/modules/media';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { DEFAULT_MEDIA_FOLDERS, MEDIA_ACCEPT, MEDIA_FILE_INPUT_ID, SAMPLE_MEDIA_ASSETS } from './MediaPages.const';
import type { AssetTypeFilter, MediaAssetItem, MediaFolder, ViewMode } from './MediaPages.types';
import { AssetDetailModal } from './helpers/AssetDetailModal';

export const MediaPages: FC = () => {
  const { t } = useI18n();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { items, source, cloudName, loading, uploading, error, uploadError, fetchMedia, uploadMedia } =
    useNucleus(mediaNucleus);
  const activeToken = token || providerToken;
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<AssetTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState(EMPTY_STRING);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetItem | null>(null);
  const [folders, setFolders] = useState<MediaFolder[]>(DEFAULT_MEDIA_FOLDERS);
  const [localAssets, setLocalAssets] = useState<MediaAssetItem[]>(SAMPLE_MEDIA_ASSETS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeToken) return;
    void fetchMedia(activeToken);
  }, [activeToken]);

  // Combine nucleus items with local/sample assets
  const allAssets: MediaAssetItem[] = useMemo(() => {
    const fromNucleus: MediaAssetItem[] = items.map((item) => ({
      id: item.id,
      publicId: item.publicId,
      url: toCloudinarySrc(item.secureUrl || item.url, cloudName),
      secureUrl: toCloudinarySrc(item.secureUrl || item.url, cloudName),
      resourceType: item.resourceType === 'image' || item.resourceType === 'video' ? item.resourceType : 'raw',
      format: item.format || 'jpg',
      bytes: item.bytes,
      folder: 'marketing',
      createdAt: item.createdAt,
    }));

    const combined = [...fromNucleus];
    localAssets.forEach((la) => {
      if (!combined.some((c) => c.publicId === la.publicId)) {
        combined.push(la);
      }
    });
    return combined;
  }, [items, localAssets, cloudName]);

  // Filtered assets based on folder, type filter, and search
  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      // Folder match
      if (selectedFolder !== 'all' && asset.folder !== selectedFolder) {
        return false;
      }
      // Type match
      if (typeFilter !== 'all') {
        if (typeFilter === 'image' && asset.resourceType !== 'image') return false;
        if (typeFilter === 'video' && asset.resourceType !== 'video') return false;
        if (typeFilter === 'document' && asset.resourceType !== 'raw') return false;
      }
      // Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          asset.publicId.toLowerCase().includes(q) ||
          (asset.tags && asset.tags.some((tg) => tg.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [allAssets, selectedFolder, typeFilter, searchQuery]);

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === NUMBER_ZERO) return;
    const list = Array.from(files);

    if (activeToken) {
      for (const file of list) {
        await uploadMedia(activeToken, file);
      }
      void fetchMedia(activeToken);
    } else {
      // Create local asset preview
      const newItems: MediaAssetItem[] = list.map((file, idx) => ({
        id: `upload-${Date.now()}-${idx}`,
        publicId: file.name.replace(/\.[^/.]+$/, ''),
        url: URL.createObjectURL(file),
        secureUrl: URL.createObjectURL(file),
        resourceType: file.type.startsWith('video') ? 'video' : file.type.startsWith('image') ? 'image' : 'raw',
        format: file.name.split('.').pop() || 'bin',
        bytes: file.size,
        folder: selectedFolder !== 'all' ? selectedFolder : 'marketing',
        createdAt: new Date().toISOString(),
      }));
      setLocalAssets((prev) => [...newItems, ...prev]);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void processFiles(event.dataTransfer.files);
  };

  const handleCopyUrl = (asset: MediaAssetItem) => {
    void navigator.clipboard.writeText(asset.secureUrl || asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = (id: string) => {
    setLocalAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateFolder = () => {
    const name = window.prompt('Enter new folder name:');
    if (!name || !name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setFolders((prev) => [...prev, { id: slug, name: name.trim(), slug, itemCount: 0 }]);
    setSelectedFolder(slug);
  };

  const activeFolderName = folders.find((f) => f.id === selectedFolder)?.name || 'All Media';

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.MEDIA}>
      <Flex direction="column" gap={6}>
        <CmsPageHeader
          title={t.dashboard.mediaTitle}
          subtitle={t.dashboard.mediaSubtitle}
          actionTitle={t.dashboard.mediaDropTitle}
          actionBody={t.dashboard.mediaDropBody}
          extra={
            <Button
              size="sm"
              variant="primary"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="bg-[var(--bear-primary-500,#1E3A8A)] hover:bg-[var(--bear-primary-600,#172554)] text-white shadow-sm flex items-center gap-1.5"
            >
              <BearIcons.PlusIcon size={14} />
              <span>{uploading ? t.dashboard.mediaUploading : 'Upload Asset'}</span>
            </Button>
          }
          actions={
            source && (
              <Badge variant="info" className="text-xs">
                {source}
              </Badge>
            )
          }
        />

        {/* Upload Dropzone Strip */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white cursor-pointer ${
            dragging
              ? 'border-[var(--bear-primary-500,#1E3A8A)] bg-blue-50/40 shadow-sm'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            id={MEDIA_FILE_INPUT_ID}
            type="file"
            accept={MEDIA_ACCEPT}
            multiple
            className="hidden"
            onChange={(event) => {
              void processFiles(event.target.files);
              event.target.value = EMPTY_STRING;
            }}
          />
          <div className="flex flex-col items-center gap-1.5">
            <span className="w-10 h-10 rounded-full bg-blue-50 text-[var(--bear-primary-500,#1E3A8A)] flex items-center justify-center mb-1">
              <BearIcons.ImageIcon size={20} />
            </span>
            <Typography variant="h4" className="text-sm font-bold text-gray-900 mb-0">
              Drag &amp; drop files here, or browse
            </Typography>
            <Typography variant="body2" className="text-xs text-gray-400 mb-0">
              Supports WebP, PNG, JPG, SVG, MP4, and PDF (Up to 50MB per file)
            </Typography>
          </div>
        </div>

        {/* Main Content Layout (Folders Sidebar + Assets Explorer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Folders Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-2">
                <Typography variant="h3" className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-0">
                  Folders Tree
                </Typography>
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  className="text-xs text-blue-900 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <BearIcons.PlusIcon size={12} />
                  <span>New</span>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {folders.map((folder) => {
                  const isActive = selectedFolder === folder.id;
                  const count =
                    folder.id === 'all'
                      ? allAssets.length
                      : allAssets.filter((a) => a.folder === folder.id).length;
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white font-semibold shadow-xs'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>📁</span>
                        <span className="truncate">{folder.name}</span>
                      </div>
                      <span className={`text-[11px] px-1.5 py-0.2 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Asset Explorer Area (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            {/* Explorer Toolbar */}
            <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="cursor-pointer hover:text-gray-900" onClick={() => setSelectedFolder('all')}>
                  Media Library
                </span>
                <span className="text-gray-300">/</span>
                <strong className="text-gray-900">{activeFolderName}</strong>
                <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-200 ml-1">
                  {filteredAssets.length} items
                </Badge>
              </div>

              {/* View Controls & Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Input */}
                <div className="w-40 sm:w-48">
                  <Input
                    size="sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assets..."
                  />
                </div>

                {/* Type Filter */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
                  {(['all', 'image', 'video', 'document'] as AssetTypeFilter[]).map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTypeFilter(tf)}
                      className={`px-2 py-1 rounded-md capitalize cursor-pointer transition-all ${
                        typeFilter === tf
                          ? 'bg-white font-bold text-gray-900 shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Grid / List Toggle */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md cursor-pointer transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-[var(--bear-primary-500,#1E3A8A)] shadow-2xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="Grid View"
                  >
                    <BearIcons.GridIcon size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md cursor-pointer transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-[var(--bear-primary-500,#1E3A8A)] shadow-2xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <BearIcons.MenuIcon size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading / Uploading indicator */}
            {(loading || uploading) && (
              <Flex align="center" gap={2} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs">
                <Spinner size="sm" />
                <span>{uploading ? t.dashboard.mediaUploading : t.dashboard.loading}</span>
              </Flex>
            )}

            {/* Error notifications */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {t.dashboard.error}
              </div>
            )}
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {t.dashboard.mediaUploadError}
              </div>
            )}

            {/* Empty State */}
            {filteredAssets.length === NUMBER_ZERO && !loading && (
              <Card variant="outlined" padding="lg" className="bg-white border border-gray-200 rounded-xl text-center py-12">
                <span className="text-3xl block mb-2">📂</span>
                <Typography variant="h3" className="text-sm font-bold text-gray-800 mb-1">
                  No assets found in this folder
                </Typography>
                <Typography variant="body2" className="text-xs text-gray-400 mb-4">
                  Drag &amp; drop files above to populate your media library.
                </Typography>
                <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                  Browse Files
                </Button>
              </Card>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && filteredAssets.length > NUMBER_ZERO && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 animate-fadeIn">
                {filteredAssets.map((asset) => (
                  <Card
                    key={asset.id}
                    padding="none"
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col group cursor-pointer"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    {/* Thumbnail preview */}
                    <div className="h-36 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      {asset.resourceType === 'image' ? (
                        <img
                          src={asset.secureUrl || asset.url}
                          alt={asset.publicId}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : asset.resourceType === 'video' ? (
                        <div className="text-center text-gray-500">
                          <span className="text-3xl">🎬</span>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <BearIcons.FileTextIcon size={32} className="text-cyan-600" />
                        </div>
                      )}

                      {/* Quick copy overlay button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(asset);
                        }}
                        className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                        title="Copy CDN URL"
                      >
                        {copiedId === asset.id ? (
                          <BearIcons.CheckIcon size={12} className="text-emerald-400" />
                        ) : (
                          <BearIcons.CopyIcon size={12} />
                        )}
                      </button>

                      <Badge
                        variant="info"
                        className="absolute bottom-2 left-2 text-[10px] uppercase font-bold bg-slate-900/80 text-white px-1.5 py-0.2 rounded"
                      >
                        {asset.format}
                      </Badge>
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-3 flex flex-col justify-between flex-1 gap-1.5">
                      <Typography variant="body2" className="text-xs font-semibold text-gray-900 truncate mb-0" title={asset.publicId}>
                        {asset.publicId}
                      </Typography>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>{asset.width ? `${asset.width}×${asset.height}` : 'Binary'}</span>
                        <span>{asset.bytes ? `${Math.round(asset.bytes / 1024)} KB` : ''}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && filteredAssets.length > NUMBER_ZERO && (
              <Card variant="outlined" padding="none" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-fadeIn">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-4">Asset</th>
                        <th className="py-2.5 px-4">Folder</th>
                        <th className="py-2.5 px-4">Format</th>
                        <th className="py-2.5 px-4">Dimensions</th>
                        <th className="py-2.5 px-4">Size</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredAssets.map((asset) => (
                        <tr
                          key={asset.id}
                          className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          <td className="py-2.5 px-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                              {asset.resourceType === 'image' ? (
                                <img
                                  src={asset.secureUrl || asset.url}
                                  alt={asset.publicId}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BearIcons.FileTextIcon size={18} className="text-gray-500" />
                              )}
                            </div>
                            <span className="font-semibold text-gray-900 truncate max-w-[200px]" title={asset.publicId}>
                              {asset.publicId}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 capitalize font-medium text-gray-600">
                            📁 {asset.folder || 'marketing'}
                          </td>
                          <td className="py-2.5 px-4">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-gray-600 border-gray-300">
                              {asset.format}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-4 font-mono text-gray-500">
                            {asset.width ? `${asset.width} × ${asset.height}` : 'Vector / N/A'}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-gray-500">
                            {asset.bytes ? `${Math.round(asset.bytes / 1024)} KB` : '—'}
                          </td>
                          <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="xs"
                                variant="outline"
                                className="border-gray-200 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleCopyUrl(asset)}
                              >
                                {copiedId === asset.id ? 'Copied' : 'Copy URL'}
                              </Button>
                              <Button
                                size="xs"
                                variant="primary"
                                className="bg-[var(--bear-primary-500,#1E3A8A)] text-white"
                                onClick={() => setSelectedAsset(asset)}
                              >
                                Crop / View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Flex>

      {/* Asset Crop & Details Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onDelete={handleDeleteAsset}
      />
    </CmsShell>
  );
};
