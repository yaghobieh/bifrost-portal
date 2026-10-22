import { useState, type FC } from 'react';
import { Badge, BearIcons, Button, Flex, Typography } from '@forgedevstack/bear';
import type { ShareContentModalProps } from './ShareContentModal.types';
import {
  SHARE_COPY_LINK_TEST_ID,
  SHARE_EXECUTE_TEST_ID,
  SHARE_MODAL_TEST_ID,
  SHARE_SITE_SELECT_TEST_ID,
} from './ShareContentModal.const';

export const ShareContentModal: FC<ShareContentModalProps> = ({
  isOpen,
  onClose,
  item,
  sites,
  activeSiteId,
  onShareToSite,
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(() => {
    const other = sites.find((s) => s.id !== activeSiteId && s.slug !== activeSiteId);
    return other?.id || sites[0]?.id || 'default';
  });
  const [sharing, setSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const currentSite = sites.find((s) => s.id === (item.currentSiteId || activeSiteId)) || sites[0];
  const targetSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bifrost.dev';
  const siteDomain = currentSite?.domain || (typeof window !== 'undefined' ? window.location.host : 'localhost:5173');
  const shareUrl = `${origin}/preview/${encodeURIComponent(item.id)}?site=${encodeURIComponent(currentSite?.slug || currentSite?.id || 'default')}&slug=${encodeURIComponent(item.slug)}`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} on ${currentSite?.name || 'Bifrost'}`,
          url: shareUrl,
        });
      } catch {
        // user cancelled or unsupported
      }
    } else {
      void handleCopy();
    }
  };

  const handleExecuteShare = async () => {
    if (!onShareToSite || !selectedSiteId) return;
    setSharing(true);
    setSuccessMsg(null);
    try {
      await onShareToSite(selectedSiteId, item);
      setSuccessMsg(`Successfully shared "${item.title}" to ${targetSite?.name || selectedSiteId}!`);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to share content';
      setSuccessMsg(`Error: ${msg}`);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      data-testid={SHARE_MODAL_TEST_ID}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm text-white">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
            </div>
            <div>
              <Typography variant="h3" className="text-lg font-bold text-white mb-0 leading-tight">
                Share {item.kind ? item.kind.toUpperCase() : 'CONTENT'}
              </Typography>
              <Typography variant="caption" className="text-blue-100 text-xs block">
                Cross-site distribution & instant link sharing
              </Typography>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Target item preview */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 truncate text-sm">{item.title}</span>
                <Badge variant="neutral" className="text-[10px] uppercase font-semibold">
                  {item.kind || item.collection || 'entry'}
                </Badge>
              </div>
              <Typography variant="caption" className="text-xs text-gray-500 font-mono truncate block">
                /{item.slug} · Current Site: <span className="font-semibold text-gray-700">{currentSite?.name}</span>
              </Typography>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 shrink-0">
              ⚡ Double-Click Shortcut
            </span>
          </div>

          {Boolean(successMsg) && (
            <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
              successMsg?.startsWith('Error')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              <span>{successMsg?.startsWith('Error') ? '⚠️' : '✅'}</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Share across Sites */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                1. Share / Clone to Another Site
              </label>
              <span className="text-[11px] text-gray-500">Multi-Site Network</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              Select a target site from your Bifrost network to replicate and distribute this content.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                data-testid={SHARE_SITE_SELECT_TEST_ID}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none"
              >
                {sites.map((s) => {
                  const isCurrent = s.id === currentSite?.id || s.slug === currentSite?.slug;
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.domain ? `(${s.domain})` : ''} {isCurrent ? '• [Current Site]' : ''}
                    </option>
                  );
                })}
              </select>

              <Button
                variant="primary"
                size="sm"
                disabled={sharing || !onShareToSite}
                onClick={handleExecuteShare}
                data-testid={SHARE_EXECUTE_TEST_ID}
                className="bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold shadow-sm shrink-0 whitespace-nowrap"
              >
                {sharing ? 'Sharing...' : `Share to Site`}
              </Button>
            </div>
          </div>

          {/* Section 2: Copy Share Link */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
              2. Shareable Preview Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 select-all focus:outline-none"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                data-testid={SHARE_COPY_LINK_TEST_ID}
                className={`font-semibold shrink-0 transition-colors ${
                  copiedLink
                    ? 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {copiedLink ? '✓ Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>

          {/* Section 3: Headless API Endpoint */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                3. Headless API Consumption
              </label>
              <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">REST API</span>
            </div>
            <div className="p-2.5 bg-gray-900 text-gray-200 rounded-lg text-[11px] font-mono overflow-x-auto flex items-center justify-between">
              <code>GET /api/sites/{targetSite?.id || 'default'}/pages/{item.slug}</code>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`/api/sites/${targetSite?.id || 'default'}/pages/${item.slug}`);
                    setSuccessMsg('API endpoint copied to clipboard!');
                    setTimeout(() => setSuccessMsg(null), 2500);
                  } catch {
                    // noop
                  }
                }}
                className="ml-2 text-xs text-blue-300 hover:text-white uppercase font-bold shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNativeShare}
            className="text-gray-600 hover:text-gray-900 text-xs"
          >
            🔗 Web Share API
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
