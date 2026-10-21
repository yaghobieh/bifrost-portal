import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CMS_NAV_IDS, CMS_NAV_ROUTES } from '../src/pages/Cms/CmsShell/CmsShell.const';
import { SETTINGS_TABS } from '../src/pages/Cms/SettingsPages/SettingsPages.const';
import { en } from '../src/i18n/en';
import { es } from '../src/i18n/es';

describe('CMS-240: Multi-Site nav visibility, navy theme, and Alloy Copilot UI', () => {
  test('should have SITES in CMS_NAV_IDS and point to settings sites tab', () => {
    assert.strictEqual(CMS_NAV_IDS.SITES, 'sites');
    assert.strictEqual(CMS_NAV_ROUTES[CMS_NAV_IDS.SITES], '/cms/settings?tab=sites');
  });

  test('should have SITES as a first-class tab in SETTINGS_TABS', () => {
    assert.strictEqual(SETTINGS_TABS.SITES, 'sites');
  });

  test('should provide Alloy agent with you translation strings', () => {
    assert.strictEqual(en.cmsShell.alloyAgentWithYou, 'Alloy agent with you!');
    assert.strictEqual(es.cmsShell.alloyAgentWithYou, '¡Agente Alloy contigo!');
    assert.strictEqual(en.cmsShell.alloyAgentCopilotTitle, 'Alloy 1.5 Flash Copilot');
    assert.strictEqual(es.cmsShell.alloyAgentCopilotTitle, 'Copiloto Alloy 1.5 Flash');
  });
});
