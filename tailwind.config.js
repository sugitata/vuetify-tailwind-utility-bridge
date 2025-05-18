/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: [],
  content: ['./playground/**/*.vue'],
  // plugins: [textBrandPrimary],
  // plugins: [require('./dist/src/index.js')],
  plugins: [require('./src/index.js')],
};
