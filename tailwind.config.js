const vuetifyDistPlugin = require('./dist/src/index.js');
const distPlugin = vuetifyDistPlugin.vuetifyPlugin;

const sampleTheme = {
  colors: {
    primary: '#000000',
    secondary: '#000000',
    accent: '#000000',
    error: '#000000',
    warning: '#000000',
    info: '#000000',
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: [],
  content: ['./playground/**/*.vue'],
  plugins: [
    distPlugin({
      theme: sampleTheme,
    }),
  ],
};
