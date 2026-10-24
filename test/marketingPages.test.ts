import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MARKETING_BLUE_HEX,
  MARKETING_VIOLET_HEX,
  MARKETING_PINK_HEX,
  MARKETING_CORE_WIDGET_IDS,
  MARKETING_WIDGET_IDS,
  MARKETING_WIDGETS,
  MARKETING_WIDGET_GROUP,
} from '../src/pages/Cms/BuilderPages/MarketingBlocks.const.ts';
import {
  CONTEXT_MENU_STRUCTURE,
  CONTEXT_MENU_STYLE,
  CONTEXT_MENU_REUSE,
  CONTEXT_MENU_DANGER,
} from '../src/pages/Cms/BuilderPages/helpers/CanvasContextMenu/CanvasContextMenu.const.ts';
import { PALETTE_GROUP_ID } from '../src/pages/Cms/BuilderPages/BuilderPages.const.ts';

test('CMS-133: Marketing Core Block IDs & Palette Grouping', () => {
  // Acceptance: Stage palette shows group Marketing with Hero, Split auth, Feature grid, CTA band, Footer
  assert.equal(MARKETING_CORE_WIDGET_IDS.length, 5);
  assert.deepEqual([...MARKETING_CORE_WIDGET_IDS], [
    MARKETING_WIDGET_IDS.HERO,
    MARKETING_WIDGET_IDS.SPLIT_AUTH,
    MARKETING_WIDGET_IDS.FEATURE_GRID,
    MARKETING_WIDGET_IDS.CTA_BAND,
    MARKETING_WIDGET_IDS.FOOTER,
  ]);

  assert.equal(MARKETING_WIDGET_IDS.HERO, 'mkt-hero');
  assert.equal(MARKETING_WIDGET_IDS.SPLIT_AUTH, 'mkt-split-auth');
  assert.equal(MARKETING_WIDGET_IDS.FEATURE_GRID, 'mkt-feature-grid');
  assert.equal(MARKETING_WIDGET_IDS.CTA_BAND, 'mkt-cta-band');
  assert.equal(MARKETING_WIDGET_IDS.FOOTER, 'mkt-footer');

  assert.equal(PALETTE_GROUP_ID.MARKETING, 'marketing');
  assert.equal(MARKETING_WIDGET_GROUP.MARKETING, 'marketing');
});

test('CMS-133: Bifrost Gradient Color Palette Hex Values', () => {
  // Acceptance: HTML uses the Bifrost gradient blue #2951C4 → violet #8A3FD4 → pink #EA0A8E
  assert.equal(MARKETING_BLUE_HEX, '#2951C4');
  assert.equal(MARKETING_VIOLET_HEX, '#8A3FD4');
  assert.equal(MARKETING_PINK_HEX, '#EA0A8E');
});

test('CMS-133 & CMS-158: Marketing Block Definitions & Content', () => {
  const ids = MARKETING_WIDGETS.map((w) => w.id);

  // All 5 core marketing blocks are present with non-empty html templates
  for (const coreId of MARKETING_CORE_WIDGET_IDS) {
    assert.ok(ids.includes(coreId), `Widget ${coreId} should exist in MARKETING_WIDGETS`);
    const def = MARKETING_WIDGETS.find((w) => w.id === coreId);
    assert.ok(def?.html && def.html.length > 0, `Widget ${coreId} must have non-empty HTML`);
    assert.ok(def?.label && def.label.length > 0, `Widget ${coreId} must have a label`);
  }
});

test('CMS-158: Canvas Context Menu Actions & Groupings', () => {
  // Acceptance: grouped actions (edit, duplicate, move, copy/paste styles, save reusable, delete)
  const structureActions = CONTEXT_MENU_STRUCTURE.map((item) => item.action);
  assert.ok(structureActions.includes('edit-content'));
  assert.ok(structureActions.includes('duplicate'));
  assert.ok(structureActions.includes('move-up'));
  assert.ok(structureActions.includes('move-down'));

  const styleActions = CONTEXT_MENU_STYLE.map((item) => item.action);
  assert.ok(styleActions.includes('copy-styles'));
  assert.ok(styleActions.includes('paste-styles'));

  const reuseActions = CONTEXT_MENU_REUSE.map((item) => item.action);
  assert.ok(reuseActions.includes('save-reusable'));

  const dangerActions = CONTEXT_MENU_DANGER.map((item) => item.action);
  assert.ok(dangerActions.includes('delete'));
  assert.equal(CONTEXT_MENU_DANGER[0].danger, true);
});

test('CMS-134: Canvas Context Menu for Marketing Pages Blocks', () => {
  // Acceptance:
  // - Context menu on marketing blocks on the canvas.
  // - Actions match HTML mock in Downloads: duplicate, move, style, reuse, delete.
  // - Menu works after Marketing Pages is installed.
  const allActions = [
    ...CONTEXT_MENU_STRUCTURE.map((item) => item.action),
    ...CONTEXT_MENU_STYLE.map((item) => item.action),
    ...CONTEXT_MENU_REUSE.map((item) => item.action),
    ...CONTEXT_MENU_DANGER.map((item) => item.action),
  ];

  assert.ok(allActions.includes('duplicate'), 'Must include duplicate action');
  assert.ok(allActions.includes('move-up'), 'Must include move-up action');
  assert.ok(allActions.includes('move-down'), 'Must include move-down action');
  assert.ok(allActions.includes('delete'), 'Must include delete action');
  assert.ok(allActions.includes('edit-content'), 'Must include edit-content action');
  assert.ok(allActions.includes('inspect-props'), 'Must include inspect-props action');
  assert.ok(allActions.includes('inspect-style'), 'Must include inspect-style action');
  assert.ok(allActions.includes('copy-styles'), 'Must include copy-styles action');
  assert.ok(allActions.includes('paste-styles'), 'Must include paste-styles action');
  assert.ok(allActions.includes('save-reusable'), 'Must include save-reusable action');
});

