import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ROUTES } from '../src/constants/routes.const';
import {
  DATABASE_OPTIONS,
  STARTER_OPTIONS,
  PACKAGE_MANAGERS,
  SYSTEM_REQUIREMENTS,
  SAMPLE_PACKAGE_JSON,
  SAMPLE_ENV_FILE,
  SAMPLE_README_MD,
  CLI_ASCII_ART,
} from '../src/pages/GetStarted/GetStarted.const';

describe('CMS-33 & Easy Install: One-Click Download, Git Clone, and CLI Scaffolding', () => {
  test('should register /get-started route for onboarding portal', () => {
    assert.strictEqual(ROUTES.GET_STARTED, '/get-started');
  });

  test('should provide essential database options', () => {
    assert.ok(Array.isArray(DATABASE_OPTIONS));
    const dbIds = DATABASE_OPTIONS.map((d) => d.id);
    assert.ok(dbIds.includes('sqlite'));
    assert.ok(dbIds.includes('postgres'));
    assert.ok(dbIds.includes('mysql'));
  });

  test('should provide frontend starter options including Next.js and Vite', () => {
    assert.ok(Array.isArray(STARTER_OPTIONS));
    const starterIds = STARTER_OPTIONS.map((s) => s.id);
    assert.ok(starterIds.includes('nextjs'));
    assert.ok(starterIds.includes('react-vite'));
    assert.ok(starterIds.includes('astro'));
    assert.ok(starterIds.includes('api-only'));
  });

  test('should support modern package managers', () => {
    assert.ok(PACKAGE_MANAGERS.includes('npm'));
    assert.ok(PACKAGE_MANAGERS.includes('pnpm'));
    assert.ok(PACKAGE_MANAGERS.includes('yarn'));
    assert.ok(PACKAGE_MANAGERS.includes('bun'));
  });

  test('should generate valid downloadable package.json starter manifest', () => {
    const pkgString = SAMPLE_PACKAGE_JSON('test-app');
    const parsed = JSON.parse(pkgString);
    assert.strictEqual(parsed.name, 'test-app');
    assert.strictEqual(parsed.version, '1.0.2');
    assert.ok(parsed.scripts.dev);
    assert.ok(parsed.dependencies['@forgedevstack/bifrost-cli']);
  });

  test('should provide pre-flight system requirements and ASCII branding', () => {
    assert.ok(SYSTEM_REQUIREMENTS.length >= 4);
    assert.ok(CLI_ASCII_ART.includes('BIFROST'));
    assert.ok(CLI_ASCII_ART.includes('ForgeStack'));
    assert.ok(SAMPLE_ENV_FILE.includes('5174'));
    assert.ok(SAMPLE_README_MD('demo-site').includes('Bifrost CMS'));
  });
});
