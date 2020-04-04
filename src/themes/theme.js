import { tailwind } from '@theme-ui/presets'
import colors from './colors'

export default {
  ...tailwind,
  sizes: {
    ...tailwind.sizes,
    container: 768,
  },
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
      mx: 'auto',
      padding: '1',
      borderColor: 'primary',
      borderStyle: 'solid',
      borderWidth: 'thin',
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
