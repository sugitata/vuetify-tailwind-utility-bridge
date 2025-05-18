/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: [],
  content: ['./playground/**/*.vue'],
  plugins: [require('./src/index.ts')],
};
