import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './index.html',
  },
  output: {
    assetPrefix: '/',
    copy: [
      { from: './public', to: '.', globOptions: { ignore: ['**/index.html'] } },
    ],
  },
  server: {
    port: 3000,
  },
});
