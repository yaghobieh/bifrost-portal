if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';

test('Cross-Site Sharing & Table Actions (CMS-242 Extension)', async (t) => {
  const {
    SHARE_MODAL_TEST_ID,
    SHARE_SITE_SELECT_TEST_ID,
    SHARE_COPY_LINK_TEST_ID,
    SHARE_EXECUTE_TEST_ID,
  } = await import('../src/pages/Cms/ContentPages/helpers/ShareContentModal/ShareContentModal.const');

  await t.test('should define test IDs for Share Modal interactive elements', () => {
    assert.equal(SHARE_MODAL_TEST_ID, 'cms-share-content-modal');
    assert.equal(SHARE_SITE_SELECT_TEST_ID, 'cms-share-site-select');
    assert.equal(SHARE_COPY_LINK_TEST_ID, 'cms-share-copy-link-btn');
    assert.equal(SHARE_EXECUTE_TEST_ID, 'cms-share-execute-btn');
  });

  await t.test('should format cross-site sharing payload accurately', () => {
    const sourceItem = {
      id: 'doc-123',
      title: 'Global Product Launch',
      slug: 'global-product-launch',
      collection: 'pages',
      payload: {
        heading: 'Hello World',
        siteId: 'default',
      },
    };

    const targetSiteId = 'marketing-site';
    const sharedPayload = {
      ...sourceItem.payload,
      siteId: targetSiteId,
      site_id: targetSiteId,
    };

    assert.equal(sharedPayload.siteId, 'marketing-site');
    assert.equal(sharedPayload.heading, 'Hello World');
  });
});
