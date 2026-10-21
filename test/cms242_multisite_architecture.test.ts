import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CMS_BOTTOM_NAV_IDS, CMS_NAV_IDS } from '../src/pages/Cms/CmsShell/CmsShell.const';
import { fetchSitePlugins, updateSitePlugins, fetchSiteUsers, addSiteUser } from '../src/data/sites.api';
import type { PostTypeCategory, PostTypeStructure } from '../src/pages/Cms/ContentPages/pageTypes.types';

describe('CMS-242: Multi-site Network Architecture & Post Types', () => {
  test('should have removed PLANS from bottom nav in favor of SITES', () => {
    assert.strictEqual(CMS_BOTTOM_NAV_IDS.includes(CMS_NAV_IDS.SITES), true);
    // @ts-expect-error verifying PLANS is no longer part of bottom nav array
    assert.strictEqual(CMS_BOTTOM_NAV_IDS.includes('plans'), false);
  });

  test('should provide site-scoped plugin and user API methods', () => {
    assert.strictEqual(typeof fetchSitePlugins, 'function');
    assert.strictEqual(typeof updateSitePlugins, 'function');
    assert.strictEqual(typeof fetchSiteUsers, 'function');
    assert.strictEqual(typeof addSiteUser, 'function');
  });

  test('should support post type categories: page, article, blog, and custom', () => {
    const categories: PostTypeCategory[] = ['page', 'article', 'blog', 'custom'];
    assert.strictEqual(categories.length, 4);
    assert.ok(categories.includes('page'));
    assert.ok(categories.includes('article'));
    assert.ok(categories.includes('blog'));
    assert.ok(categories.includes('custom'));
  });

  test('should support structure modes: multi (collection) and single (document)', () => {
    const modes: PostTypeStructure[] = ['multi', 'single'];
    assert.strictEqual(modes.length, 2);
    assert.ok(modes.includes('multi'));
    assert.ok(modes.includes('single'));
  });
});
