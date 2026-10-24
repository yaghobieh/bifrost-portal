import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CMS_AUTH_MODE,
  CMS_OAUTH_GITHUB,
  CMS_OAUTH_GOOGLE,
} from '../src/pages/Cms/CmsLogin/CmsLogin.const';

const currentDir = dirname(fileURLToPath(import.meta.url));
const loginDir = resolve(currentDir, '../src/pages/Cms/CmsLogin');

test('CMS-154: Split-panel login lives in cms-fe', async (t) => {
  await t.test('Auth modes and OAuth constants are defined', () => {
    assert.equal(CMS_AUTH_MODE.LOGIN, 'login');
    assert.equal(CMS_AUTH_MODE.REGISTER, 'register');
    assert.equal(CMS_OAUTH_GITHUB, 'github');
    assert.equal(CMS_OAUTH_GOOGLE, 'google');
  });

  await t.test('CmsLogin is structured with split-panel layout', () => {
    const mainFile = resolve(loginDir, 'CmsLogin.tsx');
    assert.ok(existsSync(mainFile), 'CmsLogin.tsx must exist');

    const content = readFileSync(mainFile, 'utf8');
    assert.ok(
      content.includes('bifrost-cms-login__split'),
      'CmsLogin must render bifrost-cms-login__split',
    );
    assert.ok(
      content.includes('CmsLoginBrand'),
      'CmsLogin must render CmsLoginBrand for the dark brand panel',
    );
    assert.ok(
      content.includes('bifrost-cms-login__form-panel'),
      'CmsLogin must render bifrost-cms-login__form-panel for the white form',
    );
  });

  await t.test('CmsLoginBrand helper renders brand storytelling and quote', () => {
    const brandHelper = resolve(loginDir, 'helpers/CmsLoginBrand/CmsLoginBrand.tsx');
    assert.ok(existsSync(brandHelper), 'CmsLoginBrand.tsx must exist');

    const content = readFileSync(brandHelper, 'utf8');
    assert.ok(
      content.includes('bifrost-cms-login__brand'),
      'CmsLoginBrand must use brand container class',
    );
    assert.ok(
      content.includes('CmsLoginMark'),
      'CmsLoginBrand must render the brand mark',
    );
  });
});
