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
});
