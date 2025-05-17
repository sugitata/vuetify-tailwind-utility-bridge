export default function (addUtilities: any) {
  addUtilities({
    '.flex-row': { flexDirection: 'row' },
    '.flex-column': { flexDirection: 'column' },
    '.flex-wrap': { flexWrap: 'wrap' },
    '.flex-nowrap': { flexWrap: 'nowrap' },

    '.justify-start': { justifyContent: 'flex-start' },
    '.justify-center': { justifyContent: 'center' },
    '.justify-end': { justifyContent: 'flex-end' },
    '.justify-space-between': { justifyContent: 'space-between' },
    '.justify-space-around': { justifyContent: 'space-around' },

    '.align-start': { alignItems: 'flex-start' },
    '.align-center': { alignItems: 'center' },
    '.align-end': { alignItems: 'flex-end' },
    '.align-stretch': { alignItems: 'stretch' },
  });
}
