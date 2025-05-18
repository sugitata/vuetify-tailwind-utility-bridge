const plugin = require('tailwindcss/plugin');
const { vuetifyUtilities } = require('./generated/vuetifyUtilities');

const vuetifyPlugin = plugin(function ({ addUtilities }) {
  // 試しに text-brand-primary を追加
  // addUtilities({
  //   '.text-brand-primary': {
  //     color: 'red',
  //   },
  // });

  // vuetifyUtilities配列からユーティリティを生成
  vuetifyUtilities.forEach((util) => {
    const props = util.props;
    const className = props.class || util.key;
    const property = props.property;
    const values = props.values;
    if (className && property && values) {
      const propList = property.split(' ');
      if (typeof values === 'object' && values !== null) {
        Object.entries(values).forEach(([k, v]) => {
          const style = {};
          propList.forEach((p) => {
            style[p] = String(v);
          });
          addUtilities({
            [`.${className}-${k}`]: style,
          });
        });
      } else if (typeof values === 'string') {
        values.split(' ').forEach((val) => {
          const style = {};
          propList.forEach((p) => {
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

module.exports = vuetifyPlugin;
