import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 4173,
  },
  source: {
    entry: { index: './src/index.jsx' },
  },
  html: {
    template: './public/index.html',
  },
  output: {
    assetPrefix: process.env.PUBLIC_URL || '/',
    copy: [
      { from: './public', globOptions: { ignore: ['**/index.html'] } },
    ],
  },
});
