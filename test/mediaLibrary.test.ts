import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  MEDIA_FOLDERS,
  CROP_PRESETS,
  SAMPLE_MEDIA_ASSETS,
} from '../src/pages/Cms/MediaPages/MediaPages.const';

describe('CMS-234: Media Library Grid/List View, Asset Folders & Crop Optimization', () => {
  test('should provide structured media folders hierarchy', () => {
    assert.ok(Array.isArray(MEDIA_FOLDERS));
    assert.ok(MEDIA_FOLDERS.length >= 4);
    const rootFolder = MEDIA_FOLDERS.find((f) => f.id === 'all');
    assert.ok(rootFolder, 'Should have root "all" media folder');
    assert.strictEqual(rootFolder?.name, 'All Media');
  });

  test('should define essential crop presets with aspect ratio styling', () => {
    assert.ok(Array.isArray(CROP_PRESETS));
    const presetIds = CROP_PRESETS.map((p) => p.id);
    assert.ok(presetIds.includes('original'));
    assert.ok(presetIds.includes('1:1'));
    assert.ok(presetIds.includes('16:9'));
    assert.ok(presetIds.includes('4:3'));
  });

  test('should provide sample media assets with folder assignment and dimensions', () => {
    assert.ok(Array.isArray(SAMPLE_MEDIA_ASSETS));
    assert.ok(SAMPLE_MEDIA_ASSETS.length > 0);
    const firstAsset = SAMPLE_MEDIA_ASSETS[0];
    assert.ok(firstAsset.id);
    assert.ok(firstAsset.folder);
    assert.ok(firstAsset.secureUrl);
    assert.ok(typeof firstAsset.bytes === 'number');
  });
});
