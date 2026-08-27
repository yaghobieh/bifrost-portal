import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { cmsDocsPlugin } from './vite-plugin-cms-docs';
import { PORT_CMS_API, PORT_PORTAL } from './src/constants/numbers.const';

const portalSrc = resolve(__dirname, 'src');
const localInkRoot = resolve(__dirname, '../ink');
const localInkEntry = resolve(localInkRoot, 'dist/index.js');
const localBearRoot = resolve(__dirname, '../bear');
const localBearEntry = resolve(localBearRoot, 'dist/index.js');
const localFormRoot = resolve(__dirname, '../forge-form');
const localFormEntry = resolve(localFormRoot, 'dist/index.mjs');
const vueStub = resolve(portalSrc, 'shims/vue.ts');
const anvilStub = resolve(portalSrc, 'shims/forgedevstack-anvil.ts');

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const cmsApiRaw = env.VITE_CMS_API_URL || `http://127.0.0.1:${PORT_CMS_API}`;
  const cmsApi = cmsApiRaw.replace('://localhost', '://127.0.0.1');
  const useLocalInk = env.VITE_USE_LOCAL_INK === '1' || env.VITE_USE_LOCAL_INK === 'true';
  const aliasLocalInk = command === 'serve' && useLocalInk && existsSync(localInkEntry);
  const aliasLocalBear = existsSync(localBearEntry);
  const aliasLocalForm = existsSync(localFormEntry);

  return {
    plugins: [react(), tsconfigPaths(), cmsDocsPlugin(mode)],
    resolve: {
      alias: {
        '@': portalSrc,
        '@config': resolve(portalSrc, 'config'),
        '@hooks': resolve(portalSrc, 'hooks'),
        '@utils': resolve(portalSrc, 'utils'),
        '@sdk': resolve(portalSrc, 'sdk'),
        '@icons': resolve(portalSrc, 'icons'),
        '@forgedevstack/anvil': anvilStub,
        vue: vueStub,
        ...(aliasLocalInk
          ? {
              '@forgedevstack/ink/styles.css': resolve(localInkRoot, 'dist/styles.css'),
              '@forgedevstack/ink/plugins/ai': resolve(localInkRoot, 'dist/plugins/ai/index.js'),
              '@forgedevstack/ink': localInkEntry,
            }
          : {}),
        ...(aliasLocalBear
          ? {
              '@forgedevstack/bear/styles.css': resolve(localBearRoot, 'dist/styles.css'),
              '@forgedevstack/bear': localBearEntry,
            }
          : {}),
        ...(aliasLocalForm
          ? {
              '@forgedevstack/forge-form': localFormEntry,
            }
          : {}),
      },
    },
    optimizeDeps: {
      include: [
        'vue',
        'axios',
        ...(aliasLocalInk ? [] : ['@forgedevstack/ink']),
        '@forgedevstack/forge-form',
        '@forgedevstack/calendar',
      ],
      exclude: [
        '@forgedevstack/anvil',
        ...(aliasLocalInk ? ['@forgedevstack/ink'] : []),
        ...(aliasLocalBear ? ['@forgedevstack/bear'] : []),
        ...(aliasLocalForm ? ['@forgedevstack/forge-form'] : []),
      ],
      esbuildOptions: {
        alias: {
          vue: vueStub,
        },
      },
    },
    server: {
      host: true,
      port: PORT_PORTAL,
      strictPort: true,
      fs: {
        allow: [
          resolve(__dirname),
          localInkRoot,
          localBearRoot,
          localFormRoot,
          resolve(__dirname, '../calendar'),
        ],
      },
      proxy: {
        '/api': { target: cmsApi, changeOrigin: true, ws: true },
      },
    },
  };
});
