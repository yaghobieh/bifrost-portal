import { useState, useEffect, type FC, type FormEvent } from 'react';
import {
  Badge,
  BearIcons,
  Button,
  Card,
  Flex,
  Input,
  Typography,
} from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { useSites } from '@hooks/useSites';
import {
  fetchSitePlugins,
  updateSitePlugins,
  fetchSiteUsers,
  addSiteUser,
} from '@data/sites.api';
import type { CmsSite, CreateSiteInput, SitePlugin, SiteUser } from '@data/sites.types';

const NETWORK_DEFAULT_PLUGINS: SitePlugin[] = [
  { id: 'seo', name: 'SEO Engine & Meta Optimization', enabled: true, version: '1.2.0', description: 'Per-site OpenGraph, canonical tags, and structured schema.' },
  { id: 'analytics', name: 'Traffic & Conversion Analytics', enabled: true, version: '2.0.1', description: 'Real-time telemetry and visitor funnel events.' },
  { id: 'sitemap', name: 'Automated XML Sitemaps', enabled: true, version: '1.0.4', description: 'Search crawler indexation and Google Search Console ping.' },
  { id: 'forms', name: 'Interactive Form Engine', enabled: false, version: '1.1.0', description: 'Lead capture forms with automated webhook routing.' },
  { id: 'search', name: 'Algolia Instant Search', enabled: false, version: '3.1.2', description: 'Lightning-fast fuzzy search index across all posts.' },
];

export const NetworkManagerDashboard: FC<{ token?: string }> = ({ token }) => {
  const { t } = useI18n();
  const {
    sites,
    activeSiteId,
    setActiveSiteId,
    addNewSite,
    updateExistingSite,
    removeSite,
    refreshSites,
  } = useSites(token);

  // Site Creation / Edit Modal State
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [editingSite, setEditingSite] = useState<CmsSite | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDomain, setFormDomain] = useState('');
  const [formLocale, setFormLocale] = useState('en');
  const [formDesc, setFormDesc] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Site Plugins Modal State
  const [pluginModalSite, setPluginModalSite] = useState<CmsSite | null>(null);
  const [sitePlugins, setSitePlugins] = useState<SitePlugin[]>([]);
  const [applyToAllOnInstall, setApplyToAllOnInstall] = useState(false);
  const [savingPlugins, setSavingPlugins] = useState(false);

  // Site Users Modal State
  const [userModalSite, setUserModalSite] = useState<CmsSite | null>(null);
  const [siteUsers, setSiteUsers] = useState<SiteUser[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('editor');
  const [savingUser, setSavingUser] = useState(false);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingSite(null);
    setFormName('');
    setFormSlug('');
    setFormDomain('');
    setFormLocale('en');
    setFormDesc('');
    setFormIsDefault(false);
    setFormError(null);
    setShowSiteModal(true);
  };

  // Open Edit Modal
  const openEditModal = (site: CmsSite) => {
    setEditingSite(site);
    setFormName(site.name);
    setFormSlug(site.slug);
    setFormDomain(site.domain || '');
    setFormLocale(site.locale || 'en');
    setFormDesc(site.description || '');
    setFormIsDefault(site.isDefault);
    setFormError(null);
    setShowSiteModal(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingSite) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9_-]/g, '-'));
    }
  };

  const handleSiteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) return;

    setFormSubmitting(true);
    setFormError(null);
    try {
      const payload: CreateSiteInput = {
        name: formName.trim(),
        slug: formSlug.trim(),
        domain: formDomain.trim() || null,
        locale: formLocale,
        description: formDesc.trim() || null,
        isDefault: formIsDefault,
      };

      if (editingSite) {
        await updateExistingSite(editingSite.id, payload);
      } else {
        await addNewSite(payload);
      }
      setShowSiteModal(false);
      setEditingSite(null);
      await refreshSites();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Error saving site');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open Plugins Modal
  const openPluginsModal = async (site: CmsSite) => {
    setPluginModalSite(site);
    setApplyToAllOnInstall(false);
    const plugins = await fetchSitePlugins(site.id);
    if (plugins.length > 0) {
      setSitePlugins(plugins);
    } else {
      setSitePlugins(NETWORK_DEFAULT_PLUGINS);
    }
  };

  const togglePlugin = (id: string) => {
    setSitePlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const handleSavePlugins = async () => {
    if (!pluginModalSite) return;
    setSavingPlugins(true);
    await updateSitePlugins(pluginModalSite.id, sitePlugins, applyToAllOnInstall, token);
    setSavingPlugins(false);
    setPluginModalSite(null);
    await refreshSites();
  };

  // Open Users Modal
  const openUsersModal = async (site: CmsSite) => {
    setUserModalSite(site);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('editor');
    const users = await fetchSiteUsers(site.id);
    setSiteUsers(users);
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!userModalSite || !newUserName.trim()) return;
    setSavingUser(true);
    const added = await addSiteUser(
      userModalSite.id,
      { name: newUserName.trim(), email: newUserEmail.trim(), role: newUserRole },
      token,
    );
    if (added) {
      setSiteUsers((prev) => [...prev, added]);
      setNewUserName('');
      setNewUserEmail('');
    }
    setSavingUser(false);
  };

  const activeSite = sites.find((s) => s.id === activeSiteId || s.slug === activeSiteId) || sites[0];

  return (
    <div className="space-y-6">
      {/* Network Overview Hero */}
      <Card variant="elevated" padding="lg" className="border-l-4 border-l-[#1e3a8a] bg-gradient-to-r from-blue-50/40 via-white to-white">
        <Flex direction="column" gap={4}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  🌐
                </span>
                <Typography variant="h2" className="text-xl font-bold text-gray-900 tracking-tight">
                  Multi-Site Network Manager
                </Typography>
                <Badge variant="success" className="ml-2 font-mono text-xs">
                  Network Active
                </Badge>
              </div>
              <Typography variant="body2" className="text-sm text-gray-600 max-w-2xl">
                Centralized network control center. Orchestrate isolated site domains, individual pages and links, independent plugin rollouts, and scoped user roles.
              </Typography>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={openCreateModal}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-sm flex items-center gap-2"
              >
                <span>＋</span> Add New Site
              </Button>
            </div>
          </div>

          {/* Super Admin / Authority Banner */}
          <div className="bg-[#1e3a8a]/5 border border-[#1e3a8a]/20 rounded-lg p-3.5 flex items-center justify-between text-xs text-gray-700">
            <div className="flex items-center gap-2.5">
              <span className="text-base">👑</span>
              <div>
                <span className="font-bold text-[#1e3a8a]">1 Global Network Manager (You):</span>{' '}
                <span>Universal authority across all network sites. Site editors and team members below are strictly isolated to their assigned site.</span>
              </div>
            </div>
            <div className="font-mono text-[#1e3a8a] font-semibold hidden sm:block">
              API Isolation: /api/:siteId/*
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 font-medium">Sites in Network</div>
              <div className="text-2xl font-bold text-[#1e3a8a]">{sites.length}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 font-medium">Active Context</div>
              <div className="text-base font-bold text-gray-800 truncate" title={activeSite?.name}>
                {activeSite?.name || 'Primary Site'}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 font-medium">Default Locale</div>
              <div className="text-base font-bold text-gray-800 uppercase font-mono">
                {activeSite?.locale || 'en'}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 font-medium">Network Architecture</div>
              <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Scoped Tenant DB
              </div>
            </div>
          </div>
        </Flex>
      </Card>

      {/* Sites Network Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="h3" className="text-base font-bold text-gray-800">
            Sites in Network ({sites.length})
          </Typography>
          <span className="text-xs text-gray-500">
            Switch site context to manage isolated pages, articles, and links
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((site) => {
            const isActive = site.id === activeSiteId || site.slug === activeSiteId;
            const siteUrl = site.domain ? (site.domain.startsWith('http') ? site.domain : `https://${site.domain}`) : `http://${site.slug}.localhost:5174`;

            return (
              <Card
                key={site.id}
                variant="elevated"
                padding="md"
                className={`transition-all border ${
                  isActive
                    ? 'border-[#1e3a8a] shadow-md ring-1 ring-[#1e3a8a]/20 bg-blue-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  {/* Site Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-base text-[#1e3a8a]">
                          {site.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-gray-900">{site.name}</span>
                            {site.isDefault && (
                              <Badge variant="info" className="text-[10px] py-0 px-1.5 uppercase font-semibold">
                                Primary Default
                              </Badge>
                            )}
                            {isActive && (
                              <Badge variant="success" className="text-[10px] py-0 px-1.5 font-bold">
                                Active Realm
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs font-mono text-gray-500">
                            ID: {site.slug} • Locale: {site.locale || 'en'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(site)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit Site Configuration"
                        >
                          <BearIcons.EditIcon size={14} />
                        </button>
                        {!site.isDefault && (
                          <button
                            type="button"
                            onClick={() => removeSite(site.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Site"
                          >
                            <BearIcons.DeleteIcon size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Site URL & Connect */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-1.5 truncate">
                        <BearIcons.GlobeIcon size={13} className="text-gray-400 shrink-0" />
                        <span className="font-mono text-gray-700 truncate">{site.domain || `${site.slug}.localhost`}</span>
                      </div>
                      <a
                        href={siteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1e3a8a] font-semibold hover:underline flex items-center gap-1 text-[11px] shrink-0 ml-2"
                      >
                        Visit Site <BearIcons.ArrowRightIcon size={11} />
                      </a>
                    </div>

                    {/* Isolated Capabilities Bar */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white border border-gray-200 rounded p-2">
                        <div className="text-gray-500 text-[11px]">Pages & Links</div>
                        <div className="font-bold text-gray-800 mt-0.5">Isolated</div>
                        <div className="text-[10px] font-mono text-[#1e3a8a]">/api/{site.slug}/pages</div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded p-2">
                        <div className="text-gray-500 text-[11px]">Plugins & State</div>
                        <div className="font-bold text-gray-800 mt-0.5">Per-Site Config</div>
                        <button
                          type="button"
                          onClick={() => openPluginsModal(site)}
                          className="text-[10px] text-[#1e3a8a] font-semibold hover:underline"
                        >
                          Configure Plugins →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openUsersModal(site)}
                      className="text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <BearIcons.UsersIcon size={13} /> Scoped Team
                    </Button>

                    <Button
                      size="sm"
                      variant={isActive ? 'outline' : 'primary'}
                      onClick={() => setActiveSiteId(site.id)}
                      className={`text-xs font-semibold ${
                        isActive
                          ? 'border-[#1e3a8a] text-[#1e3a8a] bg-blue-50/40'
                          : 'bg-[#1e3a8a] hover:bg-[#1e40af] text-white'
                      }`}
                    >
                      {isActive ? '✓ Current Realm' : 'Switch & Manage'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal: Create or Edit Site */}
      {showSiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm">
                  {editingSite ? '✎' : '＋'}
                </span>
                <div>
                  <Typography variant="h3" className="text-lg font-bold text-gray-900 mb-0">
                    {editingSite ? 'Edit Site Configuration' : 'Create New Site Realm'}
                  </Typography>
                  <Typography variant="caption" className="text-xs text-gray-500">
                    Scoped database realm with unique pages, links, and domain
                  </Typography>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSiteModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSiteSubmit} className="p-6 space-y-4 text-sm text-gray-800">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Site Name <span className="text-[#1e3a8a]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. EMEA Store, Tech Blog, Developer Portal"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Site Identifier / Slug (`site_id`) <span className="text-[#1e3a8a]">*</span>
                </label>
                <div className="flex items-center">
                  <span className="px-2.5 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-xs font-mono">
                    /api/
                  </span>
                  <input
                    type="text"
                    placeholder="emea-store"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
                    disabled={Boolean(editingSite)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm font-mono disabled:bg-gray-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Primary Domain / Custom URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. emea.mybrand.com or store.example.com"
                  value={formDomain}
                  onChange={(e) => setFormDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Default Locale
                </label>
                <input
                  type="text"
                  placeholder="en, fr, de, es"
                  value={formLocale}
                  onChange={(e) => setFormLocale(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Description of this site realm and intended audience..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-sm"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSiteModal(false)}
                  disabled={formSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Saving...' : editingSite ? 'Update Site' : 'Create Site'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Site Plugins & Network Rollout */}
      {pluginModalSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm">
                    🔌
                  </span>
                  <Typography variant="h3" className="text-lg font-bold text-gray-900 mb-0">
                    Plugins for {pluginModalSite.name}
                  </Typography>
                </div>
                <Typography variant="caption" className="text-xs text-gray-500 mt-0.5">
                  Configure plugins specifically for this site or rollout network-wide on install
                </Typography>
              </div>
              <button
                type="button"
                onClick={() => setPluginModalSite(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-gray-800">
              <div className="space-y-3">
                {sitePlugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="p-3 border border-gray-200 rounded-lg flex items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{plugin.name}</span>
                        {plugin.version && (
                          <Badge variant="info" className="text-[10px] font-mono">
                            v{plugin.version}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{plugin.description}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={plugin.enabled ? 'primary' : 'outline'}
                      onClick={() => togglePlugin(plugin.id)}
                      className={`text-xs font-semibold ${
                        plugin.enabled
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {plugin.enabled ? '✓ Active' : 'Enable'}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Install / Network Rollout Option */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyToAllOnInstall}
                    onChange={(e) => setApplyToAllOnInstall(e.target.checked)}
                    className="mt-0.5 rounded text-[#1e3a8a] focus:ring-[#1e3a8a]"
                  />
                  <div className="text-xs text-gray-700">
                    <span className="font-bold text-gray-900 block">
                      Apply across all sites in the network on install
                    </span>
                    When checked, this configuration updates and enables the selected plugins across all existing sites in this network.
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPluginModalSite(null)}
                  disabled={savingPlugins}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSavePlugins}
                  disabled={savingPlugins}
                  className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                >
                  {savingPlugins ? 'Saving...' : 'Save Plugin Configuration'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Scoped Users */}
      {userModalSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm">
                    👥
                  </span>
                  <Typography variant="h3" className="text-lg font-bold text-gray-900 mb-0">
                    Team Scoped to {userModalSite.name}
                  </Typography>
                </div>
                <Typography variant="caption" className="text-xs text-gray-500 mt-0.5">
                  1 Global Manager (You) + Scoped Site Members
                </Typography>
              </div>
              <button
                type="button"
                onClick={() => setUserModalSite(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-sm text-gray-800">
              {/* Existing Users List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Current Site Members
                </div>
                {siteUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 border border-gray-200 rounded-lg flex items-center justify-between gap-3 bg-gray-50/40"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{u.name}</span>
                        {u.globalAccess ? (
                          <Badge variant="info" className="text-[10px] font-semibold bg-[#1e3a8a] text-white">
                            👑 1 Global Manager
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {u.role}
                          </Badge>
                        )}
                      </div>
                      {u.email && <div className="text-xs text-gray-500">{u.email}</div>}
                    </div>
                    <div className="text-xs font-mono text-gray-400">
                      {u.globalAccess ? 'Universal' : 'Site Scoped'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Scoped User Form */}
              <form onSubmit={handleAddUser} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                <div className="text-xs font-bold text-gray-800">
                  Add Scoped Member to {userModalSite.name}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#1e3a8a]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
                  >
                    <option value="editor">Content Editor</option>
                    <option value="author">Author</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={savingUser}
                    className="bg-[#1e3a8a] text-white text-xs"
                  >
                    {savingUser ? 'Adding...' : '＋ Add to Site'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
