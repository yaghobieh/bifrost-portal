import { useState, type FC } from 'react';
import { Badge, BearIcons, Button, Flex, Modal, Typography } from '@forgedevstack/bear';
import { CROP_PRESETS } from '../../MediaPages.const';
import type { CropPreset, MediaAssetItem } from '../../MediaPages.types';

interface AssetDetailModalProps {
  asset: MediaAssetItem | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const AssetDetailModal: FC<AssetDetailModalProps> = ({ asset, onClose, onDelete }) => {
  const [selectedCrop, setSelectedCrop] = useState<CropPreset>('original');
  const [copied, setCopied] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  if (!asset) return null;

  const handleCopyUrl = () => {
    void navigator.clipboard.writeText(asset.secureUrl || asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setIsOptimized(true);
    }, 600);
  };

  const activeAspectClass = CROP_PRESETS.find((p) => p.id === selectedCrop)?.aspectClass || 'aspect-auto';

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Modal
      isOpen={Boolean(asset)}
      onClose={onClose}
      title="Asset Details & Crop Optimization"
      size="lg"
      className="bifrost-cms-asset-modal"
    >
      <div className="flex flex-col gap-6 p-4">
        {/* Main Preview Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
          {asset.resourceType === 'image' ? (
            <div className={`max-h-[300px] overflow-hidden rounded-lg flex items-center justify-center transition-all ${activeAspectClass}`}>
              <img
                src={asset.secureUrl || asset.url}
                alt={asset.publicId}
                className="max-h-[300px] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          ) : asset.resourceType === 'video' ? (
            <div className="text-center text-white flex flex-col items-center gap-3">
              <span className="text-4xl">🎬</span>
              <Typography variant="body2" className="text-gray-300">
                Video Asset ({asset.format.toUpperCase()})
              </Typography>
            </div>
          ) : (
            <div className="text-center text-white flex flex-col items-center gap-3">
              <BearIcons.FileTextIcon size={48} className="text-cyan-400" />
              <Typography variant="body2" className="text-gray-300">
                Document / Binary File ({asset.format.toUpperCase()})
              </Typography>
            </div>
          )}

          {/* Active Preset Overlay Badge */}
          {selectedCrop !== 'original' && (
            <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-xs text-cyan-300 font-mono">
              Crop: {selectedCrop}
            </div>
          )}
        </div>

        {/* Crop Presets (for images) */}
        {asset.resourceType === 'image' && (
          <div>
            <Typography variant="caption" className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
              Aspect Ratio &amp; Crop Presets
            </Typography>
            <div className="flex items-center gap-2 flex-wrap">
              {CROP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedCrop(preset.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                    selectedCrop === preset.id
                      ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white border-[var(--bear-primary-500,#1E3A8A)] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-xs text-gray-700">
          <div>
            <span className="text-gray-400 block mb-0.5">Asset ID:</span>
            <strong className="text-gray-900 truncate block font-mono" title={asset.publicId}>
              {asset.publicId}
            </strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Dimensions:</span>
            <strong className="text-gray-900 block font-mono">
              {asset.width && asset.height ? `${asset.width} × ${asset.height} px` : 'Vector / N/A'}
            </strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">File Size:</span>
            <strong className="text-gray-900 block font-mono">
              {formatFileSize(isOptimized && asset.bytes ? Math.round(asset.bytes * 0.65) : asset.bytes)}
              {isOptimized && <span className="text-emerald-600 ml-1 text-[10px]">(-35%)</span>}
            </strong>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">MIME / Format:</span>
            <Badge variant="outline" className="text-[10px] font-bold uppercase text-gray-700 border-gray-300">
              {isOptimized ? 'webp' : asset.format || 'bin'}
            </Badge>
          </div>
        </div>

        {/* CDN URL Bar with Copy Button */}
        <div>
          <Typography variant="caption" className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block">
            Public CDN URL
          </Typography>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-2 font-mono text-xs text-gray-800 truncate shadow-2xs">
              {asset.secureUrl || asset.url}
            </div>
            <Button
              size="sm"
              variant={copied ? 'primary' : 'outline'}
              className={copied ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              onClick={handleCopyUrl}
            >
              {copied ? (
                <>
                  <BearIcons.CheckIcon size={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <BearIcons.CopyIcon size={13} />
                  <span>Copy CDN URL</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <Button
            size="sm"
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-50 flex items-center gap-1.5"
            onClick={() => {
              if (onDelete) onDelete(asset.id);
              onClose();
            }}
          >
            <BearIcons.DeleteIcon size={13} />
            <span>Delete Asset</span>
          </Button>

          <Flex align="center" gap={2}>
            {asset.resourceType === 'image' && !isOptimized && (
              <Button
                size="sm"
                variant="outline"
                className="text-cyan-700 border-cyan-300 hover:bg-cyan-50 flex items-center gap-1.5"
                onClick={handleOptimize}
                loading={optimizing}
              >
                <BearIcons.StarIcon size={13} />
                <span>Auto-Compress (WebP)</span>
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </Flex>
        </div>
      </div>
    </Modal>
  );
};
