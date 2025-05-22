import plugin from 'tailwindcss/plugin';
import { vuetifyUtilities } from './generated/vuetifyUtilities';

import type { ThemeDefinition } from 'vuetify/lib/framework';

export interface VuetifyTailwindPluginOptions {
  theme?: ThemeDefinition;
}

export const vuetifyPlugin = plugin.withOptions(
  (options: VuetifyTailwindPluginOptions = {}) => {
    return function ({ addUtilities }) {
      // 既存のユーティリティ生成
      vuetifyUtilities.forEach((util) => {
        const props = util.props as Record<string, any>;
        const className = props.class || util.key;
        const property = props.property;
        const values = props.values;
        // typographyユーティリティの場合は特別扱い
        if (
          util.key === 'typography' &&
          typeof values === 'object' &&
          values !== null
        ) {
          Object.entries(values).forEach(([k, v]) => {
            if (typeof v === 'object' && v !== null) {
              // font-familyが配列の場合はカンマ区切りに変換
              const style: Record<string, string> = {};
              Object.entries(v).forEach(([prop, val]) => {
                if (Array.isArray(val)) {
                  style[prop] = val.join(', ');
                } else {
                  style[prop] = String(val);
                }
              });
              addUtilities({
                [`.${className}-${k}`]: style,
              });
            }
          });
          return;
        }
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

      // Vuetify Theme.colors からユーティリティ生成
      if (options.theme?.colors) {
        const colorUtils: Record<string, Record<string, string>> = {};
        Object.entries(options.theme.colors).forEach(([key, value]) => {
          colorUtils[`.text-${key}`] = { color: String(value) };
          colorUtils[`.bg-${key}`] = { backgroundColor: String(value) };
        });
        addUtilities(colorUtils);
      }
    };
  }
);
