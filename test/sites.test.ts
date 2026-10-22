if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';

test('Multi-Site Architecture — Acceptance Criteria (CMS-238)', async (t) => {
  const { CMS_ACTIVE_SITE_KEY, CMS_ACTIVE_SITE_EVENT } = await import('../src/hooks/useSites');
  const {
    DEFAULT_SITE_ID,
    DEFAULT_SITE_LOCALE,
    SETTINGS_SITES_TEST_ID,
  } = await import(
    '../src/pages/Cms/SettingsPages/helpers/SettingsSitesPanel/SettingsSitesPanel.const'
  );
  const {
    SITE_SWITCHER_TEST_ID,
    SITE_SWITCHER_ICON_SIZE,
    SITE_SWITCHER_CHEVRON_SIZE,
  } = await import(
    '../src/pages/Cms/CmsShell/helpers/SiteSwitcher/SiteSwitcher.const'
  );

  await t.test('should define valid active site storage key and event name', () => {
    assert.equal(CMS_ACTIVE_SITE_KEY, 'bifrost_cms_active_site_id');
    assert.equal(CMS_ACTIVE_SITE_EVENT, 'cms_active_site_changed');
  });

  await t.test('should define default site constants', () => {
    assert.equal(DEFAULT_SITE_ID, 'default');
    assert.equal(DEFAULT_SITE_LOCALE, 'en');
    assert.equal(SETTINGS_SITES_TEST_ID, 'cms-settings-sites-panel');
  });

  await t.test('should define valid site switcher constants', () => {
    assert.equal(SITE_SWITCHER_TEST_ID, 'cms-site-switcher');
    assert.ok(SITE_SWITCHER_ICON_SIZE > 0);
    assert.ok(SITE_SWITCHER_CHEVRON_SIZE > 0);
  });

  await t.test('should persist newly created site to storage across refresh', async () => {
    const { CMS_SITES_STORAGE_KEY, createSite, fetchSites, getStoredSites, deleteSite } = await import(
      '../src/data/sites.api'
    );
    assert.equal(CMS_SITES_STORAGE_KEY, 'bifrost_cms_sites_list');

    const storageMap = new Map<string, string>();
    if (typeof (globalThis as any).window === 'undefined') {
      (globalThis as any).window = {};
    }
    const origStorage = (globalThis as any).window.localStorage;
    (globalThis as any).window.localStorage = {
      getItem: (k: string) => storageMap.get(k) || null,
      setItem: (k: string, v: string) => storageMap.set(k, v),
      removeItem: (k: string) => storageMap.delete(k),
    };

    try {
      const testSlug = `test-site-${Date.now()}`;
      const newSite = await createSite({
        name: 'Test Enterprise Portal',
        slug: testSlug,
        domain: 'test.example.com',
        locale: 'en',
      });

      assert.ok(newSite);
      assert.equal(newSite.name, 'Test Enterprise Portal');

      // Verify immediate local storage persistence
      const stored = getStoredSites();
      const foundInStorage = stored.find((s) => s.slug === testSlug);
      assert.ok(foundInStorage, 'Site must be found in localStorage');
      assert.equal(foundInStorage.name, 'Test Enterprise Portal');

      // Simulating page refresh: fetchSites recovers the stored site even with mock API
      const refreshed = await fetchSites();
      const foundInRefresh = refreshed.find((s) => s.slug === testSlug);
      assert.ok(foundInRefresh, 'Site must persist across refresh');

      // Delete site removes it from storage
      await deleteSite(newSite.id);
      const afterDelete = getStoredSites();
      assert.equal(afterDelete.some((s) => s.slug === testSlug), false);
    } finally {
      if (origStorage) {
        (globalThis as any).window.localStorage = origStorage;
      }
    }
  });
});
