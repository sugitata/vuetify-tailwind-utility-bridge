import plugin from 'tailwindcss/plugin';
import { vuetifyUtilities } from './generated/vuetifyUtilities';

// vuetifyUtilities.forEach((util) => {
//   const props = util.props as Record<string, string>;
//   const className = props.class || util.key;
//   const property = props.property;
//   const values = props.values;
//   console.log('className:', className);
//   console.log('property:', property);
//   console.log('values:', values);
//   console.log('--------------------------------');
// });

export const vuetifyPlugin = plugin(function ({ addUtilities }) {
  vuetifyUtilities.forEach((util) => {
    const props = util.props as Record<string, any>;
    const className = props.class || util.key;
    const property = props.property;
    const values = props.values;
    if (className && property && values) {
      const propList = property.split(' ');
      if (typeof values === 'object' && values !== null) {
        Object.entries(values).forEach(([k, v]) => {
          const style: Record<string, string> = {};
          propList.forEach((p: string) => {
            style[p] = String(v);
          });
          if (k === 'null') {
            addUtilities({
              [`.${className}`]: style,
            });
          } else {
            addUtilities({
              [`.${className}-${k}`]: style,
            });
          }
        });
      } else if (typeof values === 'string') {
        values.split(' ').forEach((val: string) => {
          const style: Record<string, string> = {};
          propList.forEach((p: string) => {
            style[p] = val;
          });
          addUtilities({
            [`.${className}-${val}`]: style,
          });
        });
      }
    }
  });
});
