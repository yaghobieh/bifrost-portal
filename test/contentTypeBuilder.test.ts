// Polyfill import.meta.env for Node test runner before dynamic imports
if (typeof (import.meta as any).env === 'undefined') {
  (import.meta as any).env = { ...process.env };
}

import test from 'node:test';
import assert from 'node:assert/strict';

test('Content-Type Builder — Acceptance Criteria (CMS-232)', async (t) => {
  const { BUILT_IN_PAGE_TYPES } = await import(
    '../src/pages/Cms/ContentPages/pageTypes.utils'
  );
  const {
    generateSchemaJson,
    moveFieldUp,
    moveFieldDown,
    slugifyFieldId,
    slugifyTypeId,
  } = await import(
    '../src/pages/Cms/ContentTypeBuilder/ContentTypeBuilder.utils'
  );
  const { ATTRIBUTE_TYPE_OPTIONS } = await import(
    '../src/pages/Cms/ContentTypeBuilder/ContentTypeBuilder.const'
  );

  await t.test('should have 3 model sections: collections, singles, and components', () => {
    const all = BUILT_IN_PAGE_TYPES;

    const collections = all.filter(
      (type: any) => type.kind !== 'single' && type.kind !== 'component',
    );
    const singles = all.filter((type: any) => type.kind === 'single');
    const components = all.filter((type: any) => type.kind === 'component');

    assert.ok(collections.length >= 4, 'Should contain collection types');
    assert.ok(singles.length >= 3, 'Should contain single types');
    assert.ok(components.length >= 3, 'Should contain reusable components');

    // Test specific built-in types
    assert.ok(collections.some((c: any) => c.id === 'articles'));
    assert.ok(collections.some((c: any) => c.id === 'pages'));
    assert.ok(collections.some((c: any) => c.id === 'blog'));
    assert.ok(collections.some((c: any) => c.id === 'docs'));

    assert.ok(singles.some((s: any) => s.id === 'homepage'));
    assert.ok(singles.some((s: any) => s.id === 'global-seo'));
    assert.ok(singles.some((s: any) => s.id === 'footer'));

    assert.ok(components.some((c: any) => c.id === 'seo-block'));
    assert.ok(components.some((c: any) => c.id === 'social-links'));
    assert.ok(components.some((c: any) => c.id === 'pricing-tier'));
  });

  await t.test('should support all 9 required attribute types', () => {
    const types = ATTRIBUTE_TYPE_OPTIONS.map((opt: any) => opt.type);
    const required = [
      'text',
      'rich-text',
      'number',
      'boolean',
      'date',
      'media',
      'relation',
      'json',
      'component',
    ];

    for (const req of required) {
      assert.ok(types.includes(req as any), `Must support attribute type: ${req}`);
    }
  });

  await t.test('should generate valid headless JSON schema format', () => {
    const articleType = BUILT_IN_PAGE_TYPES.find((t: any) => t.id === 'articles')!;
    const jsonStr = generateSchemaJson(articleType);
    const parsed = JSON.parse(jsonStr);

    assert.equal(parsed.collectionName, 'articles');
    assert.equal(parsed.kind, 'collection');
    assert.ok(parsed.attributes.title, 'Should have title attribute');
    assert.equal(parsed.attributes.title.required, true);
    assert.equal(parsed.options.draftAndPublish, true);
  });

  await t.test('should correctly reorder fields up and down', () => {
    const initialFields = [
      { id: 'f1', name: 'Field 1', type: 'text' as const },
      { id: 'f2', name: 'Field 2', type: 'number' as const },
      { id: 'f3', name: 'Field 3', type: 'boolean' as const },
    ];

    const movedDown = moveFieldDown(initialFields, 'f1');
    assert.equal(movedDown[0].id, 'f2');
    assert.equal(movedDown[1].id, 'f1');
    assert.equal(movedDown[2].id, 'f3');

    const movedUp = moveFieldUp(movedDown, 'f1');
    assert.equal(movedUp[0].id, 'f1');
    assert.equal(movedUp[1].id, 'f2');
  });

  await t.test('should properly slugify field and type identifiers', () => {
    assert.equal(slugifyFieldId('Hero Title'), 'heroTitle');
    assert.equal(slugifyFieldId('SEO Description Meta'), 'seoDescriptionMeta');
    assert.equal(slugifyTypeId('Customer Reviews'), 'customer-reviews');
    assert.equal(slugifyTypeId('FAQ Item Block'), 'faq-item-block');
  });
});
