const vuetifyDistPlugin = require('./dist/src/index.js');
const distPlugin = vuetifyDistPlugin.vuetifyPlugin;

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: [],
  content: ['./playground/**/*.vue'],
  plugins: [distPlugin],
};
