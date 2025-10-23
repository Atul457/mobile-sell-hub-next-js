// Next Imports
// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { Skin, SystemMode } from '@core/types'
// MUI Imports
import type { Theme } from '@mui/material/styles'
import { Public_Sans } from 'next/font/google'

import colorSchemes from './colorSchemes'
import customShadows from './customShadows'
// Theme Options Imports
import overrides from './overrides'
import shadows from './shadows'
import spacing from './spacing'
import typography from './typography'

const public_sans = Public_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] })

const theme = (settings: Settings, mode: SystemMode, direction: Theme['direction']): Theme => {
  return {
    direction,
    components: overrides(settings.skin as Skin),
    colorSchemes: colorSchemes(settings.skin as Skin),
    ...spacing,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10
      }
    },
    shadows: shadows(mode),
    typography: typography(public_sans.style.fontFamily),
    customShadows: customShadows(mode),
    mainColorChannels: {
      light: '47 43 61',
      dark: '225 222 245',
      lightShadow: '47 43 61',
      darkShadow: '19 17 32'
    }
  } as Theme
}

export default theme
