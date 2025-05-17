import plugin from 'tailwindcss/plugin';
import display from './display';
import flex from './flex';
import borderRadius from './borderRadius';
import spacing from './spacing';
import typography from './typography';
import elevation from './elevation';
import grid from './grid';
import colors from './colors';

export const vuetifyPlugin = plugin(function ({
  addUtilities,
  matchUtilities,
  theme,
}) {
  display({ addUtilities });
  flex({ addUtilities });
  borderRadius({ matchUtilities, theme });
  spacing({ matchUtilities, theme });
  colors({ matchUtilities, theme });
  typography({ addUtilities });
  elevation({ addUtilities });
  grid({ addUtilities });
});
