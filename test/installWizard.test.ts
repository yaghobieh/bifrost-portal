import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ROUTES } from '../src/constants/routes.const';
import {
  WIZARD_STEPS,
  DEFAULT_INSTALL_CONFIG,
} from '../src/pages/InstallWizard/InstallWizard.const';
import {
  generateEnvFile,
  generateRandomSecret,
  testDatabaseConnection,
  testStorageCredentials,
  deployToGitRepository,
} from '../src/pages/InstallWizard/InstallWizard.utils';

describe('CMS-248: Web Installer Wizard (/install)', () => {
  test('should register /install route in ROUTES', () => {
    assert.strictEqual(ROUTES.INSTALL, '/install');
  });

  test('should define all 5 guided installation steps', () => {
    assert.strictEqual(WIZARD_STEPS.length, 5);
    const stepIds = WIZARD_STEPS.map((s) => s.id);
    assert.deepStrictEqual(stepIds, [
      'site',
      'database',
      'storage',
      'ai-security',
      'git-deploy',
    ]);
  });

  test('should format clean production .env file with all environment parameters', () => {
    const env = generateEnvFile(DEFAULT_INSTALL_CONFIG);
    assert.ok(env.includes('DATABASE_URL="file:./dev.db"'));
    assert.ok(env.includes('SITE_NAME="My Bifrost Project"'));
    assert.ok(env.includes('CLOUDINARY_CLOUD_NAME="bifrost-assets"'));
    assert.ok(env.includes('JWT_SECRET='));
    assert.ok(env.includes('AI_MODEL_ID="gemini-1.5-flash"'));
    assert.ok(env.includes('GIT_REPO="yaghobieh/bifrost"'));
    assert.ok(env.includes('GIT_BRANCH="main"'));
  });

  test('should generate high-entropy random secrets', () => {
    const secret = generateRandomSecret();
    assert.ok(secret.startsWith('bf_sec_'));
    assert.strictEqual(secret.length, 55); // prefix 7 + 48 hex chars
  });

  test('should test and verify SQLite and relational database setups', async () => {
    const sqliteResult = await testDatabaseConnection(DEFAULT_INSTALL_CONFIG);
    assert.strictEqual(sqliteResult.success, true);
    assert.ok(sqliteResult.message.includes('SQLite'));

    const pgResult = await testDatabaseConnection({
      ...DEFAULT_INSTALL_CONFIG,
      dbEngine: 'postgres',
      dbHost: 'db.example.com',
      dbName: 'bifrost_prod',
    });
    assert.strictEqual(pgResult.success, true);
    assert.ok(pgResult.message.includes('PostgreSQL'));
  });

  test('should validate media storage providers', async () => {
    const cloudRes = await testStorageCredentials(DEFAULT_INSTALL_CONFIG);
    assert.strictEqual(cloudRes.success, true);
    assert.ok(cloudRes.message.includes('Cloudinary'));

    const localRes = await testStorageCredentials({
      ...DEFAULT_INSTALL_CONFIG,
      storageProvider: 'local',
    });
    assert.strictEqual(localRes.success, true);
    assert.ok(localRes.message.includes('Local'));
  });

  test('should package and simulate or execute git commit to repository', async () => {
    const env = generateEnvFile(DEFAULT_INSTALL_CONFIG);
    const deployRes = await deployToGitRepository(DEFAULT_INSTALL_CONFIG, env);
    assert.strictEqual(deployRes.success, true);
    assert.ok(deployRes.commitSha);
    assert.ok(deployRes.message.includes('committed'));
  });
});
