import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const indexHtmlPath = path.join(rootDir, 'index.html');

let failures = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('\n--- Testing Favicon and Logo in Bifrost Portal ---\n');

// 1. Check index.html exists
assert(fs.existsSync(indexHtmlPath), 'index.html exists');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// 2. Check favicon links in index.html
const hasFaviconLink = /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/?>/i.test(
  indexHtml
);
assert(hasFaviconLink, 'index.html contains primary <link rel="icon" ... href="/favicon.svg" />');

const hasMarkLink = /<link\s+rel="alternate icon"\s+type="image\/svg\+xml"\s+href="\/bifrost-mark\.svg"\s*\/?>/i.test(
  indexHtml
);
assert(hasMarkLink, 'index.html contains alternate <link rel="alternate icon" ... href="/bifrost-mark.svg" />');

// 3. Check favicon files exist and are valid SVG
const faviconPath = path.join(publicDir, 'bifrost-mark.svg');
assert(fs.existsSync(faviconPath), 'public/bifrost-mark.svg exists');
if (fs.existsSync(faviconPath)) {
  const svgContent = fs.readFileSync(faviconPath, 'utf-8');
  assert(svgContent.includes('<svg') && svgContent.includes('</svg>'), 'bifrost-mark.svg contains valid SVG markup');
  assert(svgContent.includes('xmlns="http://www.w3.org/2000/svg"'), 'bifrost-mark.svg contains xmlns attribute');
}

const faviconSvgPath = path.join(publicDir, 'favicon.svg');
assert(fs.existsSync(faviconSvgPath), 'public/favicon.svg exists');
if (fs.existsSync(faviconSvgPath)) {
  const faviconSvg = fs.readFileSync(faviconSvgPath, 'utf-8');
  assert(faviconSvg.includes('<svg') && faviconSvg.includes('</svg>'), 'favicon.svg contains valid SVG markup');
}

// 4. Check brand icon PNG exists and has valid PNG header
const pngIconPath = path.join(publicDir, 'bifrost-icon.png');
assert(fs.existsSync(pngIconPath), 'public/bifrost-icon.png exists');
if (fs.existsSync(pngIconPath)) {
  const pngBuffer = fs.readFileSync(pngIconPath);
  assert(
    pngBuffer[0] === 0x89 && pngBuffer[1] === 0x50 && pngBuffer[2] === 0x4e && pngBuffer[3] === 0x47,
    'bifrost-icon.png starts with PNG magic bytes'
  );
}

// 5. Check CmsBrandLogo component definition
const cmsBrandLogoPath = path.join(
  rootDir,
  'src/pages/Cms/CmsShell/helpers/CmsBrandLogo/CmsBrandLogo.tsx'
);
assert(fs.existsSync(cmsBrandLogoPath), 'CmsBrandLogo.tsx component exists');
if (fs.existsSync(cmsBrandLogoPath)) {
  const componentContent = fs.readFileSync(cmsBrandLogoPath, 'utf-8');
  assert(componentContent.includes('bifrost-cms__logo'), 'CmsBrandLogo uses bifrost-cms__logo class');
  assert(componentContent.includes('logoSize'), 'CmsBrandLogo supports logoSize prop');
}

console.log(`\nResults: ${failures === 0 ? 'ALL PASSED' : `${failures} test(s) failed.`}\n`);

if (failures > 0) {
  process.exit(1);
}
