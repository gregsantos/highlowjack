import { tailwind } from '@theme-ui/presets'
// import colors from './colors'

export default {
  ...tailwind,
  sizes: {
    ...tailwind.sizes,
    container: 768,
    sidebar: 420,
  },
  breakpoints: ['485px', '1000px', null],
  //  breakpoints: ['40em', '56em', '64em',],
  // this enables the color modes feature
  // and is used as the name for the top-level colors object
  initialColorMode: 'main',
  // optionally enable custom properties
  // to help avoid a flash of colors on page load
  useCustomProperties: true,
  colors: {
    ...tailwind.colors,
    modes: {
      main: {
        text: 'rgb(0, 0, 0)',
        background: 'rgb(255, 255, 255)',
        secondary: 'rgb(255,0,0)',
        inactive: 'rgb(211, 211, 211)',
        primaryButton: 'rgb(0, 0, 255)',
        mainText: 'rgb(0, 0, 0)',
        detailText: 'rgb(255, 255, 255)',
        secondaryColor: 'rgb(255,0,0)',
        overlayBackground: 'rgb(211, 211, 211)',
        overlayDetail: 'rgb(169,169,169)',
      },
      dark: {
        text: 'rgb(255, 255, 255)',
        background: 'rgb(40, 40, 40)',
        secondary: 'rgb(255,0,0)',
        inactive: 'rgb(120, 120, 120)',
        primaryButton: 'rgb(0, 0, 255)',
        mainText: 'rgb(255, 255, 255)',
        detailText: 'rgb(255, 255, 255)',
        secondaryColor: 'rgb(255,0,0)',
        overlayBackground: 'rgb(40, 40, 40)',
        overlayDetail: 'rgb(68,68,68)',
      },
    },
  },
  styles: {
    ...tailwind.styles,
  },
  layout: {
    container: {
      // container centers children on x and y axis
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      /* 
      mx: 'auto',
      padding: '1',
      borderColor: 'primary',
      borderStyle: 'solid',
      borderWidth: 'thin', */
    },
    header: {
      color: 'white',
      backgroundColor: 'primary',
    },
    footer: {
      color: 'secondary',
    },
  },
  buttons: {
    primary: {
      color: 'text',
      bg: 'primary',
    },
    secondary: {
      color: 'text',
      bg: 'secondary',
    },
    flatgreen: {
      color: 'white',
      fontSize: ['0.90em', '1.1em'],
      fontWeight: 'bold',
      bg: 'darkseagreen',
      margin: '0.75em 0.75em 0.75em 0em',
      padding: '.5em 1em',
    },
    green: {
      color: 'green',
      bg: 'darkseagreen',
      border: 'solid 3px indianred',
      margin: '0.75em 0.75em 0.75em 0em',
    },
    card: {
      color: 'green',
      bg: 'darkseagreen',
      fontSize: '.75em',
      border: 'solid 1px indianred',
      margin: '.25em .25em',
      padding: '2px 0px 0px 0px',
    },
    bidgroup: {
      color: 'green',
      bg: 'darkseagreen',
      fontSize: ['0.90em', '0.90em', '1em'],
      border: 'solid 2px indianred',
      mx: ['4px', null, '8px'],
      my: ['4px', null, '4px'],
    },
  },
  forms: {
    select: {
      color: 'indianred',
      border: 'solid 2px indianred',
      width: '100px',
      my: ['5px'],
    },
    radio: {
      color: 'indianred',
      '&:checked': {
        color: 'green',
      },
    },
  },
  text: {
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  links: {
    nav: {
      px: 2,
      py: 1,
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
    },
  },
}
