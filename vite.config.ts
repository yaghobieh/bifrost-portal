import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import { cmsDocsPlugin } from './vite-plugin-cms-docs';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths(), cmsDocsPlugin(mode)],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@const': resolve(__dirname, 'src/constants'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@components': resolve(__dirname, 'src/components'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@config': resolve(__dirname, 'src/config'),
      '@data': resolve(__dirname, 'src/data'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@store': resolve(__dirname, 'src/store'),
      vue: resolve(__dirname, 'src/shims/vue.ts'),
    },
  },
}));
