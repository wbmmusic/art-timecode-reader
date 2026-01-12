import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    copy({
      targets: [
        {
          src: 'public/artNetTcReader.js',
          dest: '.vite/build'
        },
        {
          src: 'package.json',
          dest: '.vite/build'
        },
        {
          src: 'src/assets/icon.ico',
          dest: '.vite/build'
        }
      ]
    })
  ],
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});