if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

const storage = new Map<string, string>();
if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, String(value)),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    },
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CMS_UPDATE_BANNER_ID,
  CMS_UPDATE_APPLIED_ID,
  CMS_UPDATE_DISMISS_KEY,
  CMS_UPDATE_INSTALLED_KEY,
} from '../src/pages/Cms/CmsShell/helpers/CmsUpdateBanner/CmsUpdateBanner.const';
import {
  isBehindHub,
  loadDismissedVersion,
  saveDismissedVersion,
  loadInstalledVersion,
  saveInstalledVersion,
  versionFromInfo,
} from '../src/pages/Cms/CmsShell/helpers/CmsUpdateBanner/CmsUpdateBanner.utils';
import { TARGET_CMS_VERSION } from '../src/sdk/modules/version';
import {
  SETTINGS_CATALOG_FORMAT,
  SETTINGS_CATALOG_INPUT_IDS,
} from '../src/pages/Cms/SettingsPages/components/SettingsCatalogPanel/SettingsCatalogPanel.const';

test('CMS-157: Fleet updates from bifrost-portal — banner, catalog, version checks', async (t) => {
  await t.test('Update banner constants are defined', () => {
    assert.equal(CMS_UPDATE_BANNER_ID, 'bifrost-cms-update-banner');
    assert.equal(CMS_UPDATE_APPLIED_ID, 'bifrost-cms-update-applied');
    assert.equal(CMS_UPDATE_DISMISS_KEY, 'bifrost-cms-update-dismissed');
    assert.equal(CMS_UPDATE_INSTALLED_KEY, 'bifrost-cms-installed-version');
    assert.ok(TARGET_CMS_VERSION.length > 0);
  });

  await t.test('versionFromInfo prioritizes portal version then fallback', () => {
    assert.equal(versionFromInfo('1.1.10', '1.0.0'), '1.1.10');
    assert.equal(versionFromInfo('', '1.1.9'), '1.1.9');
  });

  await t.test('isBehindHub accurately detects outdated versions', () => {
    storage.clear();

    // Outdated version returns true
    assert.equal(isBehindHub('1.0.0'), true);

    // Matching target version returns false
    assert.equal(isBehindHub(TARGET_CMS_VERSION), false);

    // Empty version returns false
    assert.equal(isBehindHub(''), false);

    // When dismissed for target version, isBehindHub returns false
    saveDismissedVersion(TARGET_CMS_VERSION);
    assert.equal(isBehindHub('1.0.0'), false);

    // Reset dismissal
    saveDismissedVersion('1.0.0');
    assert.equal(isBehindHub('1.0.0'), true);

    // When installed version matches target, isBehindHub returns false
    saveInstalledVersion(TARGET_CMS_VERSION);
    assert.equal(isBehindHub('1.0.0'), false);
  });

  await t.test('SettingsCatalogPanel defines catalog format and element IDs', () => {
    assert.equal(SETTINGS_CATALOG_FORMAT.JSON, 'json');
    assert.equal(SETTINGS_CATALOG_FORMAT.JS, 'js');
    assert.equal(SETTINGS_CATALOG_INPUT_IDS.FORMAT, 'bifrost-cms-catalog-format');
    assert.equal(SETTINGS_CATALOG_INPUT_IDS.SOURCE, 'bifrost-cms-catalog-source');
  });
});
