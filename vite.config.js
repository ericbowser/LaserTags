const {defineConfig} = require('vite');
const commonjs = require("@rollup/plugin-commonjs");
const {nodePolyfills} = require('vite-plugin-node-polyfills');
const react = require('@vitejs/plugin-react');
const svgr = require('vite-plugin-svgr').default;
const {HOST, PORT} = require('./env.json');

module.exports = defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: PORT,
    host: HOST,
    https: {
      cert: 'ssl/server.crt',
      key: 'ssl/server.key'
    }
  },
  plugins: [
    react(),
    svgr(),
    nodePolyfills()
  ],
  assetsInclude: ['**/*.svg'],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
      ]
    }
  }
});