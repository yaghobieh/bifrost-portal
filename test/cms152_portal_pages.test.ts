import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MIDDLE_DOT, BACKTICK, INSTALL_COMMAND, BIFROST_CLI } from '../src/constants/strings.const';

const currentDir = dirname(fileURLToPath(import.meta.url));
const srcPagesDir = resolve(currentDir, '../src/pages');

test('CMS-152: Portal 4-file pages, shared consts, and public Home without canvas', async (t) => {
  await t.test('MIDDLE_DOT and BACKTICK are shared string constants', () => {
    assert.equal(MIDDLE_DOT, ' · ');
    assert.equal(BACKTICK, '`');
    assert.ok(INSTALL_COMMAND.length > 0);
    assert.ok(BIFROST_CLI.length > 0);
  });

  await t.test('Portal pages use structured 4-file architecture (Name/Name.tsx + types/const/utils/index)', () => {
    const pages = ['Home', 'DocPage', 'Demo', 'Changelog', 'AskAi'];

    for (const pageName of pages) {
      const pageDir = resolve(srcPagesDir, pageName);
      assert.ok(existsSync(pageDir), `Page folder ${pageName} must exist`);

      const mainComponent = resolve(pageDir, `${pageName}.tsx`);
      const typesFile = resolve(pageDir, `${pageName}.types.ts`);
      const constFile = resolve(pageDir, `${pageName}.const.ts`);
      const indexFile = resolve(pageDir, 'index.ts');

      assert.ok(existsSync(mainComponent), `${pageName}.tsx must exist`);
      assert.ok(existsSync(typesFile), `${pageName}.types.ts must exist`);
      assert.ok(existsSync(constFile), `${pageName}.const.ts must exist`);
      assert.ok(existsSync(indexFile), `index.ts must exist in ${pageName}`);

      const hasTsUtils = existsSync(resolve(pageDir, `${pageName}.utils.ts`));
      const hasTsxUtils = existsSync(resolve(pageDir, `${pageName}.utils.tsx`));
      assert.ok(hasTsUtils || hasTsxUtils, `${pageName}.utils(.ts|.tsx) must exist`);
    }
  });

  await t.test('Public Home page does not mount CMS canvas or Stage inspector', () => {
    const homeFilePath = resolve(srcPagesDir, 'Home/Home.tsx');
    assert.ok(existsSync(homeFilePath), 'Home.tsx must exist');

    const homeContent = readFileSync(homeFilePath, 'utf8');
    assert.equal(homeContent.includes('CanvasInspector'), false);
    assert.equal(homeContent.includes('BuilderStage'), false);
    assert.equal(homeContent.includes('StageInspector'), false);
    assert.equal(homeContent.includes('CmsCanvas'), false);
  });
});
