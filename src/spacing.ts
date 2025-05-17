const SPACING_SCALE = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
};

const directions = {
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: ['marginLeft', 'marginRight'],
  my: ['marginTop', 'marginBottom'],

  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: ['paddingLeft', 'paddingRight'],
  py: ['paddingTop', 'paddingBottom'],
};

export default function (addUtilities: any) {
  const utilities: Record<string, any> = {};

  for (const [prefix, properties] of Object.entries(directions)) {
    for (const [scale, value] of Object.entries(SPACING_SCALE)) {
      const className = `.${prefix}-${scale}`;

      if (Array.isArray(properties)) {
        utilities[className] = {};
        for (const prop of properties) {
          utilities[className][prop] = value;
        }
      } else {
        utilities[className] = { [properties]: value };
      }
    }
  }

  addUtilities(utilities);
}
