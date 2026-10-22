if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';

test('CMS-91: WP-style Sidenav Accordion & Collapsed Flyouts', async (t) => {
  const {
    resolveSidebarNavItems,
    findActiveSidebarGroup,
  } = await import('../src/pages/Cms/CmsShell/CmsShell.utils');

  const {
    CMS_NAV_SECTIONS,
    CMS_NAV_IDS,
  } = await import('../src/pages/Cms/CmsShell/CmsShell.const');

  const sampleGroups = [
    {
      id: CMS_NAV_SECTIONS.OVERVIEW,
      label: 'Content & Overview',
      children: [
        { id: CMS_NAV_IDS.DASHBOARD, label: 'Dashboard' },
        { id: CMS_NAV_IDS.CONTENT, label: 'Pages' },
        { id: CMS_NAV_IDS.MEDIA, label: 'Media' },
      ],
    },
    {
      id: CMS_NAV_SECTIONS.DESIGN,
      label: 'Design & Builder',
      children: [
        { id: CMS_NAV_IDS.TEMPLATES, label: 'Templates' },
        { id: CMS_NAV_IDS.BUILDER, label: 'Visual Builder' },
      ],
    },
    {
      id: CMS_NAV_SECTIONS.GENERAL,
      label: 'Settings & System',
      children: [
        { id: CMS_NAV_IDS.SETTINGS, label: 'Settings' },
        { id: CMS_NAV_IDS.SITES, label: 'Sites' },
      ],
    },
  ];

  await t.test('should identify active group based on child activeNavId', () => {
    const activeGroup = findActiveSidebarGroup(sampleGroups, CMS_NAV_IDS.BUILDER);
    assert.ok(activeGroup);
    assert.equal(activeGroup.id, CMS_NAV_SECTIONS.DESIGN);

    const overviewGroup = findActiveSidebarGroup(sampleGroups, CMS_NAV_IDS.MEDIA);
    assert.ok(overviewGroup);
    assert.equal(overviewGroup.id, CMS_NAV_SECTIONS.OVERVIEW);
  });

  await t.test('should accordion open only openGroupId and collapse all other groups like WP', () => {
    // Open Overview
    const overviewItems = resolveSidebarNavItems({
      groups: sampleGroups,
      collapsed: false,
      openGroupId: CMS_NAV_SECTIONS.OVERVIEW,
    });

    assert.equal(overviewItems.length, 3);
    assert.ok(overviewItems[0].children && overviewItems[0].children.length === 3, 'Overview should be open with children');
    assert.equal(overviewItems[1].children, undefined, 'Design should be collapsed');
    assert.equal(overviewItems[2].children, undefined, 'General should be collapsed');

    // Switch to Design (accordion toggle)
    const designItems = resolveSidebarNavItems({
      groups: sampleGroups,
      collapsed: false,
      openGroupId: CMS_NAV_SECTIONS.DESIGN,
    });

    assert.equal(designItems[0].children, undefined, 'Overview should now be collapsed');
    assert.ok(designItems[1].children && designItems[1].children.length === 2, 'Design should now be open with children');
    assert.equal(designItems[2].children, undefined, 'General should remain collapsed');
  });

  await t.test('should strip children when collapsed for rail flyout interaction', () => {
    const collapsedItems = resolveSidebarNavItems({
      groups: sampleGroups,
      collapsed: true,
      openGroupId: CMS_NAV_SECTIONS.OVERVIEW,
    });

    assert.equal(collapsedItems.length, 3);
    assert.equal(collapsedItems[0].children, undefined);
    assert.equal(collapsedItems[1].children, undefined);
    assert.equal(collapsedItems[2].children, undefined);
  });

  await t.test('should support closing all accordion sections when openGroupId is null', () => {
    const closedItems = resolveSidebarNavItems({
      groups: sampleGroups,
      collapsed: false,
      openGroupId: null,
    });

    assert.equal(closedItems[0].children, undefined);
    assert.equal(closedItems[1].children, undefined);
    assert.equal(closedItems[2].children, undefined);
  });
});
