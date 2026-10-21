import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BIFROST_GLOW_SRC, BIFROST_GLOW_SIZE_PX } from '../src/pages/Cms/CmsGlowLoader/CmsGlowLoader.const';
import { BIFROST_MARK_SVG, BIFROST_FAVICON_SVG } from '../src/constants/strings.const';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Bifrost Headless CMS Branding & Assets', () => {
  it('should have a valid, scalable bifrost-mark.svg in public directory', () => {
    const markPath = path.join(rootDir, 'public', 'bifrost-mark.svg');
    assert.ok(fs.existsSync(markPath), 'public/bifrost-mark.svg must exist');

    const content = fs.readFileSync(markPath, 'utf8');
    assert.ok(content.includes('<svg'), 'bifrost-mark.svg must have an svg tag');
    assert.ok(content.includes('viewBox="0 0 64 64"'), 'bifrost-mark.svg must have 64x64 viewBox');
    assert.ok(content.includes('id="bifrostBridge"'), 'bifrost-mark.svg must contain bifrostBridge gradient');
    assert.ok(content.includes('stroke="url(#bifrostBridge)"'), 'bifrost-mark.svg must render rainbow bridge arches');
  });

  it('should have a valid favicon.svg for modern browser tabs', () => {
    const faviconPath = path.join(rootDir, 'public', 'favicon.svg');
    assert.ok(fs.existsSync(faviconPath), 'public/favicon.svg must exist');

    const content = fs.readFileSync(faviconPath, 'utf8');
    assert.ok(content.includes('<svg'), 'favicon.svg must have an svg tag');
    assert.ok(content.includes('<rect'), 'favicon.svg must have dark background rect for browser contrast');
    assert.ok(content.includes('id="bifrostFavicon"'), 'favicon.svg must contain gradient definition');
  });

  it('should configure index.html with favicon.svg and alternate mark', () => {
    const indexPath = path.join(rootDir, 'index.html');
    assert.ok(fs.existsSync(indexPath), 'index.html must exist');

    const content = fs.readFileSync(indexPath, 'utf8');
    assert.ok(
      content.includes('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'),
      'index.html must reference /favicon.svg as main favicon',
    );
    assert.ok(
      content.includes('<link rel="alternate icon" type="image/svg+xml" href="/bifrost-mark.svg" />'),
      'index.html must reference /bifrost-mark.svg as alternate icon',
    );
  });

  it('should wire CmsGlowLoader to use the new vector SVG logo mark', () => {
    assert.equal(BIFROST_GLOW_SRC, BIFROST_MARK_SVG, 'BIFROST_GLOW_SRC must match BIFROST_MARK_SVG');
    assert.equal(BIFROST_GLOW_SRC, '/bifrost-mark.svg', 'BIFROST_GLOW_SRC must point to /bifrost-mark.svg');
    assert.ok(BIFROST_GLOW_SIZE_PX >= 56, 'BIFROST_GLOW_SIZE_PX must be prominent (>= 56px)');
  });

  it('should define BIFROST_FAVICON_SVG in strings constants', () => {
    assert.equal(BIFROST_FAVICON_SVG, '/favicon.svg', 'BIFROST_FAVICON_SVG must point to /favicon.svg');
  });
});
