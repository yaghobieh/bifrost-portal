import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SETTINGS_TABS } from '../src/pages/Cms/SettingsPages/SettingsPages.const';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_API_TOKENS,
  INITIAL_WEBHOOKS,
  CONTENT_TYPE_RESOURCES,
} from '../src/pages/Cms/SettingsPages/components/SettingsSecurityPanel/SettingsSecurityPanel.const';
import { en } from '../src/i18n/en';
import { es } from '../src/i18n/es';

describe('CMS-233: Admin Panel & Security — Roles, Granular Permissions & API Tokens', () => {
  test('should have SECURITY tab in SETTINGS_TABS and localized labels', () => {
    assert.strictEqual(SETTINGS_TABS.SECURITY, 'security');
    assert.strictEqual(en.settings.tabSecurity, 'Security & Access');
    assert.strictEqual(es.settings.tabSecurity, 'Seguridad y Acceso');
  });

  test('should have initial admin users covering Super Admin, Editor, and Author', () => {
    assert.ok(Array.isArray(INITIAL_ADMIN_USERS));
    assert.ok(INITIAL_ADMIN_USERS.length >= 3);
    const roles = INITIAL_ADMIN_USERS.map((u) => u.role);
    assert.ok(roles.includes('Super Admin'));
    assert.ok(roles.includes('Editor'));
    assert.ok(roles.includes('Author'));
  });

  test('should define granular permissions across all content types and operations', () => {
    const roles = ['Super Admin', 'Editor', 'Author'] as const;
    const actions = ['create', 'read', 'update', 'delete', 'publish'] as const;

    roles.forEach((role) => {
      assert.ok(INITIAL_ROLE_PERMISSIONS[role]);
      CONTENT_TYPE_RESOURCES.forEach((resource) => {
        const perms = INITIAL_ROLE_PERMISSIONS[role][resource.id];
        assert.ok(perms, `Missing permissions for ${role} on ${resource.id}`);
        actions.forEach((act) => {
          assert.strictEqual(
            typeof perms[act],
            'boolean',
            `Missing boolean permission for ${act} on ${resource.id}`
          );
        });
      });
    });

    // Super Admin must have full publishing and deletion power
    assert.strictEqual(INITIAL_ROLE_PERMISSIONS['Super Admin'].pages.publish, true);
    assert.strictEqual(INITIAL_ROLE_PERMISSIONS['Super Admin'].pages.delete, true);

    // Author should NOT have publishing or deletion privileges by default
    assert.strictEqual(INITIAL_ROLE_PERMISSIONS.Author.pages.publish, false);
    assert.strictEqual(INITIAL_ROLE_PERMISSIONS.Author.pages.delete, false);
  });

  test('should configure scoped API tokens with masked keys and expirations', () => {
    assert.ok(Array.isArray(INITIAL_API_TOKENS));
    assert.ok(INITIAL_API_TOKENS.length >= 2);
    INITIAL_API_TOKENS.forEach((token) => {
      assert.ok(token.name);
      assert.ok(token.token.startsWith('bf_live_'));
      assert.ok(token.maskedToken.includes('••••'));
      assert.ok(['read-only', 'full-access', 'custom'].includes(token.scope));
      assert.ok(token.expiresAt);
    });
  });

  test('should configure webhooks for Vercel, Netlify, and custom endpoints', () => {
    assert.ok(Array.isArray(INITIAL_WEBHOOKS));
    const platforms = INITIAL_WEBHOOKS.map((w) => w.platform);
    assert.ok(platforms.includes('vercel'));
    assert.ok(platforms.includes('netlify'));
    assert.ok(platforms.includes('custom'));

    INITIAL_WEBHOOKS.forEach((wh) => {
      assert.ok(wh.name);
      assert.ok(wh.url.startsWith('https://'));
      assert.ok(wh.events.length > 0);
      assert.ok(['active', 'paused'].includes(wh.status));
    });
  });
});
