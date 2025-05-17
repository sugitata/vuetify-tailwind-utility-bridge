export default function (addUtilities: any) {
  addUtilities({
    '.container': {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
    '.row': {
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: '-8px',
      marginRight: '-8px',
    },
    '.col': {
      flexGrow: 1,
      flexBasis: 0,
      maxWidth: '100%',
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    '.col-auto': {
      flex: '0 0 auto',
      width: 'auto',
      maxWidth: 'none',
    },
    '.col-6': {
      flex: '0 0 50%',
      maxWidth: '50%',
    },
    '.col-12': {
      flex: '0 0 100%',
      maxWidth: '100%',
    },
  });
}
