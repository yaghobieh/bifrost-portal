if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

// In-memory mock for localStorage and window events if running in Node
const storage = new Map<string, string>();
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, String(value)),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  };
}

if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = {
    dispatchEvent: () => true,
  };
}

const createMockElement = (classes: string[] = []) => {
  const classSet = new Set(classes);
  const styles = new Map<string, string>();
  const attrs = new Map<string, string>();
  return {
    lang: 'en',
    dir: 'ltr',
    style: {
      setProperty: (prop: string, val: string) => styles.set(prop, val),
      getPropertyValue: (prop: string) => styles.get(prop) ?? '',
    },
    classList: {
      add: (cls: string) => classSet.add(cls),
      remove: (cls: string) => classSet.delete(cls),
      contains: (cls: string) => classSet.has(cls),
      toggle: (cls: string, force?: boolean) => {
        const next = force !== undefined ? force : !classSet.has(cls);
        if (next) classSet.add(cls);
        else classSet.delete(cls);
        return next;
      },
    },
    setAttribute: (name: string, val: string) => attrs.set(name, val),
    getAttribute: (name: string) => attrs.get(name) ?? null,
  };
};

if (typeof globalThis.document === 'undefined') {
  (globalThis as any).document = {
    documentElement: createMockElement(),
    body: createMockElement(),
    querySelectorAll: () => [],
    querySelector: () => null,
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CREW_PERMISSIONS,
  CREW_PERMISSION_GROUPS,
  type CrewUser,
  type CrewRole,
} from '../src/pages/Cms/CrewPages/CrewPages.const';
import { hasTaskPermission } from '../src/pages/Cms/TasksPages/TasksPages.utils';
import {
  applyCmsThemeColors,
  isDarkThemeBackground,
  loadCmsThemeColors,
  loadUserThemeColors,
  saveCmsThemeColors,
  saveUserThemeColors,
  loadUserNotifyPrefs,
  saveUserNotifyPrefs,
} from '../src/pages/Cms/SettingsPages/SettingsPages.utils';
import {
  SETTINGS_THEME_DEFAULTS_DARK,
  SETTINGS_THEME_DEFAULTS_LIGHT,
} from '../src/pages/Cms/SettingsPages/SettingsPages.const';
import {
  CMS_MODE_STORAGE_KEY,
  CMS_MODE_LIGHT,
  CMS_MODE_DARK,
} from '../src/constants/strings.const';
import { ALL_LOCALES, RTL_LOCALES } from '../src/i18n/i18n.const';
import { isLocale, applyDocumentLocale } from '../src/i18n/i18n.utils';
import { CMS_LOOKS, CMS_LOOK_LABEL_KEY } from '../src/pages/Cms/CmsLook/cmsLook.const';
import { CMS_LOOK_IDS } from '../src/constants/look.const';

test('CMS-108: Roles, per-user theme/notify, locales, color templates', async (t) => {
  await t.test('CREW_PERMISSIONS includes all expected permissions', () => {
    const requiredPerms = [
      'settings:edit',
      'settings:read',
      'chat:open',
      'chat:room',
      'issue:create',
      'task:create',
      'task:edit',
      'page:read',
      'media:upload',
    ];
    for (const perm of requiredPerms) {
      assert.ok(
        CREW_PERMISSIONS.includes(perm as any),
        `CREW_PERMISSIONS must include ${perm}`,
      );
    }
  });

  await t.test('CREW_PERMISSION_GROUPS groups permissions logically', () => {
    const groupIds = CREW_PERMISSION_GROUPS.map((g) => g.id);
    assert.ok(groupIds.includes('extension'));
    assert.ok(groupIds.includes('task'));
    assert.ok(groupIds.includes('issue'));

    const extGroup = CREW_PERMISSION_GROUPS.find((g) => g.id === 'extension');
    assert.ok(extGroup?.permissions.includes('settings:edit'));
    assert.ok(extGroup?.permissions.includes('settings:read'));

    const taskGroup = CREW_PERMISSION_GROUPS.find((g) => g.id === 'task');
    assert.ok(taskGroup?.permissions.includes('chat:open'));
    assert.ok(taskGroup?.permissions.includes('chat:room'));

    const issueGroup = CREW_PERMISSION_GROUPS.find((g) => g.id === 'issue');
    assert.ok(issueGroup?.permissions.includes('issue:create'));
  });

  await t.test('hasTaskPermission correctly gates settings:edit', () => {
    const roles: CrewRole[] = [
      {
        id: 'role-admin',
        name: 'Administrator',
        permissions: [...CREW_PERMISSIONS],
        system: true,
      },
      {
        id: 'role-author',
        name: 'Author',
        permissions: ['page:read', 'task:create'],
        system: false,
      },
    ];

    const users: CrewUser[] = [
      {
        id: 'u-1',
        name: 'Alice',
        email: 'alice@bifrost.io',
        roleIds: ['role-admin'],
        status: 'active',
        createdAt: '2026-10-24T00:00:00Z',
      },
      {
        id: 'u-2',
        name: 'Bob',
        email: 'bob@bifrost.io',
        roleIds: ['role-author'],
        status: 'active',
        createdAt: '2026-10-24T00:00:00Z',
      },
    ];

    // Admin flag overrides everything
    assert.equal(
      hasTaskPermission('nobody@bifrost.io', users, roles, 'settings:edit', true),
      true,
    );

    // Alice has role-admin which includes settings:edit
    assert.equal(
      hasTaskPermission('alice@bifrost.io', users, roles, 'settings:edit', false),
      true,
    );

    // Bob has role-author which does NOT include settings:edit
    assert.equal(
      hasTaskPermission('bob@bifrost.io', users, roles, 'settings:edit', false),
      false,
    );

    // Unknown user
    assert.equal(
      hasTaskPermission('stranger@bifrost.io', users, roles, 'settings:edit', false),
      false,
    );
  });

  await t.test('Per-user theme colors save and load correctly', () => {
    const userA = 'user-alice';
    const userB = 'user-bob';

    const colorsA = {
      primary: '#6366f1',
      accent: '#ec4899',
      background: '#0f172a',
    };

    const colorsB = {
      primary: '#10b981',
      accent: '#f59e0b',
      background: '#18181b',
    };

    saveUserThemeColors(userA, colorsA);
    saveUserThemeColors(userB, colorsB);

    assert.deepEqual(loadUserThemeColors(userA), colorsA);
    assert.deepEqual(loadUserThemeColors(userB), colorsB);
    assert.equal(loadUserThemeColors('non-existent-user'), null);
  });

  await t.test('Per-user notification preferences save and load correctly', () => {
    const userA = 'user-alice';
    const prefsA = {
      inApp: true,
      email: false,
      showPreview: true,
    };

    saveUserNotifyPrefs(userA, prefsA);
    assert.deepEqual(loadUserNotifyPrefs(userA), prefsA);

    // Non-existent user falls back to defaults
    const defaults = loadUserNotifyPrefs('unknown-user');
    assert.equal(typeof defaults.inApp, 'boolean');
    assert.equal(typeof defaults.email, 'boolean');
    assert.equal(typeof defaults.showPreview, 'boolean');
  });

  await t.test('Locales support covers en, es, he, fr, de and RTL for he', () => {
    const expectedLocales = ['en', 'es', 'he', 'fr', 'de'];
    for (const loc of expectedLocales) {
      assert.ok(ALL_LOCALES.includes(loc as any), `ALL_LOCALES must contain ${loc}`);
      assert.equal(isLocale(loc), true);
    }
    assert.equal(isLocale('invalid-loc'), false);

    assert.ok(RTL_LOCALES.includes('he'));

    applyDocumentLocale('he');
    assert.equal(document.documentElement.lang, 'he');
    assert.equal(document.documentElement.dir, 'rtl');

    applyDocumentLocale('en');
    assert.equal(document.documentElement.lang, 'en');
    assert.equal(document.documentElement.dir, 'ltr');
  });

  await t.test('CMS_LOOKS includes 6 color template looks', () => {
    const expectedLooks = [
      CMS_LOOK_IDS.COSMIC,
      CMS_LOOK_IDS.MIDNIGHT,
      CMS_LOOK_IDS.AURORA,
      CMS_LOOK_IDS.DUSK,
      CMS_LOOK_IDS.SAND,
      CMS_LOOK_IDS.SLATE,
    ];

    const lookIds = CMS_LOOKS.map((look) => look.id);
    for (const id of expectedLooks) {
      assert.ok(lookIds.includes(id), `CMS_LOOKS must contain look ${id}`);
      assert.ok(CMS_LOOK_LABEL_KEY[id], `CMS_LOOK_LABEL_KEY must have mapping for ${id}`);
    }

    assert.equal(CMS_LOOKS.length, 6);
  });

  await t.test('isDarkThemeBackground correctly identifies dark and light hex backgrounds', () => {
    assert.equal(isDarkThemeBackground('#0F172A'), true); // Dark navy
    assert.equal(isDarkThemeBackground('#030712'), true); // Dark black
    assert.equal(isDarkThemeBackground('#18181b'), true); // Dark zinc
    assert.equal(isDarkThemeBackground('#F8FAFC'), false); // Slate light
    assert.equal(isDarkThemeBackground('#FFFFFF'), false); // White light
    assert.equal(isDarkThemeBackground('#F6F6F4'), false); // Warm light
  });

  await t.test('applyCmsThemeColors applies light mode without dark mode lock-in', () => {
    const mockElem = createMockElement(['bifrost-cms', 'bifrost-cms--dark']);
    mockElem.setAttribute('data-color-mode', 'dark');

    // Apply light colors with explicit colorMode 'light'
    applyCmsThemeColors(mockElem as any, SETTINGS_THEME_DEFAULTS_LIGHT, 'light');

    assert.equal(mockElem.classList.contains('bifrost-cms--light'), true);
    assert.equal(mockElem.classList.contains('bifrost-cms--dark'), false);
    assert.equal(mockElem.getAttribute('data-color-mode'), 'light');
    assert.equal(mockElem.style.getPropertyValue('--bifrost-cms-bg'), SETTINGS_THEME_DEFAULTS_LIGHT.background);

    // Apply dark colors with explicit colorMode 'dark'
    applyCmsThemeColors(mockElem as any, SETTINGS_THEME_DEFAULTS_DARK, 'dark');
    assert.equal(mockElem.classList.contains('bifrost-cms--dark'), true);
    assert.equal(mockElem.classList.contains('bifrost-cms--light'), false);
    assert.equal(mockElem.getAttribute('data-color-mode'), 'dark');
  });

  await t.test('loadCmsThemeColors respects CMS_MODE_LIGHT as fallback', () => {
    localStorage.removeItem('bifrost-cms-theme-colors');
    localStorage.setItem(CMS_MODE_STORAGE_KEY, CMS_MODE_LIGHT);
    const lightTheme = loadCmsThemeColors();
    assert.equal(lightTheme.background, SETTINGS_THEME_DEFAULTS_LIGHT.background);

    localStorage.setItem(CMS_MODE_STORAGE_KEY, CMS_MODE_DARK);
    const darkTheme = loadCmsThemeColors();
    assert.equal(darkTheme.background, SETTINGS_THEME_DEFAULTS_DARK.background);
  });
});
