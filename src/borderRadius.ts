export default function (addUtilities: any) {
  addUtilities({
    '.rounded-0': { borderRadius: '0px' },
    '.rounded': { borderRadius: '4px' }, // Vuetify default
    '.rounded-sm': { borderRadius: '2px' },
    '.rounded-md': { borderRadius: '8px' },
    '.rounded-lg': { borderRadius: '16px' },
    '.rounded-xl': { borderRadius: '24px' },
    '.rounded-pill': { borderRadius: '9999px' },
    '.rounded-circle': { borderRadius: '50%' },
  });
}
