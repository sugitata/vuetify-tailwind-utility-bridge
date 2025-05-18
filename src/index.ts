import plugin from 'tailwindcss/plugin';
import { vuetifyUtilities } from './generated/vuetifyUtilities';

export const vuetifyPlugin = plugin(function ({ addUtilities }) {
  // vuetifyUtilities配列からユーティリティを生成
  vuetifyUtilities.forEach((util) => {
    const props = util.props as Record<string, string>;
    const className = props.class || util.key;
    const property = props.property;
    const values = props.values;
    if (className && property && values) {
      // valuesがスペース区切りの場合
      values.split(' ').forEach((val: string) => {
        addUtilities({
          [`.${className}-${val}`]: {
            [property]: val,
          },
        });
      });
    }
  });
});
