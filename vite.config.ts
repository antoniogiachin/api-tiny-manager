import path from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.ts', // replace 'src/index.ts' with your library's entry point
      name: 'api-tiny-manager', // replace 'MyLibrary' with your library's name
      formats: ['es'], // choose your desired output formats
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies), // don't bundle dependencies
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
      ],
    },
  },
  plugins: [dts()], // emit TS declaration files
});
