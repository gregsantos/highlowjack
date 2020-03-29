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
        text: colors.main.mainText,
        background: colors.main.background,
        secondary: colors.main.secondaryColor,
      },
      dark: {
        text: colors.dark.mainText,
        background: colors.dark.background,
        secondary: colors.dark.secondaryColor,
      },
    },
  },
  styles: {
    ...tailwind.styles,
  },
  layout: {},
  buttons: {
    primary: {
      color: 'text',
      bg: 'primary',
    },
    secondary: {
      color: 'text',
      bg: colors.main.secondaryColor,
    },
  },
  text: {
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
}
