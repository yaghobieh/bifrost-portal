import { useState, type FC, type FormEvent } from 'react';
import {
  Badge,
  BearIcons,
  Button,
  Card,
  Flex,
  Input,
  Typography,
} from '@forgedevstack/bear';
import { EMPTY_STRING } from '@const/index';
import { ALL_LOCALES, useI18n } from '@i18n/index';
import { useSites } from '@hooks/useSites';
import type { CmsSite, CreateSiteInput } from '@data/sites.types';
import type { SettingsSitesPanelProps } from './SettingsSitesPanel.types';
import {
  DEFAULT_SITE_ID,
  DEFAULT_SITE_LOCALE,
  SETTINGS_SITES_TEST_ID,
  SITE_INPUT_CLASS,
  SITES_GAP_LG,
  SITES_GAP_SM,
  SITES_ICON_SIZE,
  SITES_SMALL_ICON_SIZE,
} from './SettingsSitesPanel.const';

export const SettingsSitesPanel: FC<SettingsSitesPanelProps> = ({
  token,
  onSiteActivated,
}) => {
  const { t } = useI18n();
  const {
    sites,
    activeSiteId,
    loading,
    error,
    setActiveSiteId,
    addNewSite,
    updateExistingSite,
    removeSite,
  } = useSites(token);

  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState<CmsSite | null>(null);
  const [formName, setFormName] = useState(EMPTY_STRING);
  const [formSlug, setFormSlug] = useState(EMPTY_STRING);
  const [formDomain, setFormDomain] = useState(EMPTY_STRING);
  const [formLocale, setFormLocale] = useState(DEFAULT_SITE_LOCALE);
  const [formDesc, setFormDesc] = useState(EMPTY_STRING);
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingSite(null);
    setFormName(EMPTY_STRING);
    setFormSlug(EMPTY_STRING);
    setFormDomain(EMPTY_STRING);
    setFormLocale(DEFAULT_SITE_LOCALE);
    setFormDesc(EMPTY_STRING);
    setFormIsDefault(false);
    setShowModal(true);
  };

  const openEditModal = (site: CmsSite) => {
    setEditingSite(site);
    setFormName(site.name);
    setFormSlug(site.slug);
    setFormDomain(site.domain || EMPTY_STRING);
    setFormLocale(site.locale || DEFAULT_SITE_LOCALE);
    setFormDesc(site.description || EMPTY_STRING);
    setFormIsDefault(site.isDefault);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSite(null);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingSite) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9_-]/g, '-'));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) return;

    setFormSubmitting(true);
    setStatusMessage(null);
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
        setStatusMessage(t.settings.siteUpdatedSuccess);
      } else {
        const created = await addNewSite(payload);
        setStatusMessage(t.settings.siteCreatedSuccess);
        if (formIsDefault) {
          setActiveSiteId(created.id);
        }
      }
      closeModal();
    } catch {
      // error is handled by useSites
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (site: CmsSite) => {
    if (site.isDefault || site.id === DEFAULT_SITE_ID) return;
    if (!window.confirm(t.settings.deleteSiteConfirm)) return;

    const ok = await removeSite(site.id);
    if (ok) {
      setStatusMessage(t.settings.siteDeletedSuccess);
    }
  };

  const handleActivate = (site: CmsSite) => {
    setActiveSiteId(site.id);
    if (onSiteActivated) {
      onSiteActivated(site);
    }
  };

  const handleSetDefault = async (site: CmsSite) => {
    await updateExistingSite(site.id, { isDefault: true });
    setStatusMessage(t.settings.siteUpdatedSuccess);
  };

  return (
    <Flex
      direction="column"
      gap={SITES_GAP_LG}
      className="bifrost-cms-sites-panel"
      data-testid={SETTINGS_SITES_TEST_ID}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-1">
            {t.settings.sitesTitle}
          </Typography>
          <Typography variant="body2" className="text-sm text-gray-500 mb-0">
            {t.settings.sitesSubtitle}
          </Typography>
        </div>
        <Button
          size="sm"
          variant="primary"
          icon={<BearIcons.PlusIcon size={SITES_ICON_SIZE} />}
          onClick={openCreateModal}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-sm"
        >
          {t.settings.addSite}
        </Button>
      </div>

      {Boolean(statusMessage) && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-medium animate-fadeIn">
          {statusMessage}
        </div>
      )}

      {Boolean(error) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Sites list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map((site) => {
          const isActive = site.id === activeSiteId || site.slug === activeSiteId;
          return (
            <Card
              key={site.id}
              variant="outlined"
              padding="md"
              className={`transition-all bg-white border rounded-xl shadow-xs relative flex flex-col justify-between ${
                isActive ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Typography variant="h4" className="text-base font-bold text-gray-900 mb-0">
                      {site.name}
                    </Typography>
                    {isActive && (
                      <Badge variant="info" className="bg-pink-600 text-white font-semibold text-xs">
                        {t.settings.activeSiteBadge}
                      </Badge>
                    )}
                    {site.isDefault && (
                      <Badge variant="success" className="bg-emerald-600 text-white font-semibold text-xs">
                        {t.settings.defaultSiteBadge}
                      </Badge>
                    )}
                  </div>
                  <Badge variant="neutral" className="text-xs uppercase bg-gray-100 text-gray-600">
                    {site.locale}
                  </Badge>
                </div>

                <div className="space-y-1 mb-4">
                  <Typography variant="caption" className="text-xs text-gray-500 block">
                    <span className="font-semibold text-gray-600">Slug:</span> {site.slug}
                  </Typography>
                  {Boolean(site.domain) && (
                    <Typography variant="caption" className="text-xs text-gray-500 block">
                      <span className="font-semibold text-gray-600">Domain:</span>{' '}
                      <span className="text-pink-600 font-medium">{site.domain}</span>
                    </Typography>
                  )}
                  {Boolean(site.description) && (
                    <Typography variant="body2" className="text-xs text-gray-600 line-clamp-2 mt-2">
                      {site.description}
                    </Typography>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                <Flex gap={SITES_GAP_SM} align="center">
                  {!isActive && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleActivate(site)}
                      className="border-pink-600 text-pink-600 hover:bg-pink-50 font-medium"
                    >
                      {t.settings.makeActive}
                    </Button>
                  )}
                  {!site.isDefault && (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => void handleSetDefault(site)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {t.settings.makeDefault}
                    </Button>
                  )}
                </Flex>

                <Flex gap={SITES_GAP_SM} align="center">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => openEditModal(site)}
                    className="text-gray-600 hover:text-gray-900"
                    icon={<BearIcons.EditIcon size={SITES_SMALL_ICON_SIZE} />}
                  >
                    {t.settings.editSite}
                  </Button>
                  {!site.isDefault && site.id !== DEFAULT_SITE_ID && (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => void handleDelete(site)}
                      className="text-red-600 hover:text-red-700"
                      icon={<BearIcons.DeleteIcon size={SITES_SMALL_ICON_SIZE} />}
                    >
                      {t.settings.deleteSite}
                    </Button>
                  )}
                </Flex>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal for Create / Edit Site */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <Typography variant="h3" className="text-lg font-bold text-gray-900 mb-0">
                {editingSite ? t.settings.editSite : t.settings.addSite}
              </Typography>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.settings.siteName} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Documentation Portal"
                  className={SITE_INPUT_CLASS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.settings.siteSlug} *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
                  placeholder="e.g. docs-portal"
                  className={SITE_INPUT_CLASS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.settings.siteDomain}
                </label>
                <input
                  type="text"
                  value={formDomain}
                  onChange={(e) => setFormDomain(e.target.value)}
                  placeholder="e.g. docs.mycompany.com"
                  className={SITE_INPUT_CLASS}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.settings.siteLocale}
                </label>
                <select
                  value={formLocale}
                  onChange={(e) => setFormLocale(e.target.value)}
                  className={SITE_INPUT_CLASS}
                >
                  {ALL_LOCALES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.settings.siteDescription}
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Optional site description..."
                  className={SITE_INPUT_CLASS}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="form-is-default"
                  checked={formIsDefault}
                  onChange={(e) => setFormIsDefault(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="form-is-default" className="text-xs font-medium text-gray-700 cursor-pointer">
                  {t.settings.siteIsDefault}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <Button size="sm" variant="outline" onClick={closeModal} type="button">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  disabled={formSubmitting || !formName.trim() || !formSlug.trim()}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                >
                  {formSubmitting ? 'Saving...' : editingSite ? t.settings.editSite : t.settings.addSite}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Flex>
  );
};
