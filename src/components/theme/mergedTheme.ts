/*
 * We recommend using the merged theme if you want to override our core theme.
 * This means you can use our core theme and override it with your own customizations.
 * Write your overrides in the userTheme object in this file.
 * The userTheme object is merged with the coreTheme object within this file.
 * Export this file and import it in the `@components/theme/index.tsx` file to use the merged theme.
 */

// MUI Imports
// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
// Core Theme Imports
import coreTheme from '@core/theme'
import type { SystemMode } from '@core/types'
import type { Theme } from '@mui/material/styles'
import { deepmerge } from '@mui/utils'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  // display: 'swap'
})

const mergedTheme = (settings: Settings, mode: SystemMode, direction: Theme['direction']) => {
  // Vars
  const userTheme = {
    typography: {
      fontFamily: poppins.style.fontFamily,
      body0: {
        fontSize: {
          xs: 16,
          md: 19
        } as any
      },
      body1: {
        fontSize: {
          xs: 13,
          md: 16
        } as any
      },
      body2: {
        fontSize: {
          xs: 11,
          md: 14
        } as any
      },
      subtitle2: {
        fontSize: {
          xs: 11,
          md: 13
        } as any
      },
      subtitle1: {
        fontSize: {
          xs: 12,
          md: 15
        } as any
      },
      h3: {
        lineHeight: 1.4,
        fontSize: {
          xs: 18,
          md: 24
        } as any
      },
      h2: {
        fontSize: {
          xs: 22,
          md: 34
        } as any
      },
      h6: {
        fontSize: 15
      }
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          modal: {
            position: 'fixed !important' as any
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          labelSmall: {
            paddingInline: 20
          }
        }
      },
      MuiFormHelperText: {
        defaultProps: {
          sx: {
            fontSize: 12,
            fontWeight: 500
          }
        }
      },
      MuiDialogActions: {
        defaultProps: {
          sx: {
            padding: {
              xs: '1rem 1rem',
              md: '1.9rem 40px'
            } as any,
            marginTop: {
              xs: '2rem',
              md: '2rem'
            } as any
          }
        }
      },
      MuiDialogTitle: {
        defaultProps: {
          color: 'primary.main',
          fontWeight: 600,
          textAlign: 'center',
          sx: {
            fontSize: {
              md: 28,
              xs: 18
            } as any,
            padding: {
              xs: '1rem 1rem 1.5rem 1rem',
              md: '1.5rem 40px'
            } as any
          }
        }
      },
      MuiDialogContent: {
        defaultProps: {
          sx: {
            padding: {
              xs: '1rem 1rem',
              md: '1.5rem 40px'
            } as any
          }
        }
      }
    },
    colorSchemes: {
      light: {
        palette: {
          action: {
            hover: '#e1e1e1'
          },
          icon: {
            main: '#28282866'
          },
          customColors: {
            textGray60: '#28282899',
            primary: '#002047',
            primaryLight: '#ECF4FF',
            yellow: '#E68F3C',
            yellowLight: '#ffe0c3',
            textGray40: '#28282866',
            textGray84: '#282828D6',
            textGray100: '#282828',
            successLight: '#F0FFDF',
            success: '#62B007',
            amber: '#FFC107',
            amberLight: '#FFF8E1',
            cyan: '#00ACC1',
            cyanLight: '#E0F7FA',
            orangeLight: '#FFF2DC',
            placeholder: 'rgb(142, 142, 142)',
            errorLight: '#FFF0F0',
            error: '#F80000',
            placeholderLight: 'rgb(142, 142, 142, 0.46)'
          },
          hyperlink: {
            main: '#00BBFF'
          },
          ...({
            subTitle: {
              web: '#464255',
              mob: '#282828'
            }
          } as any)
        }
      }
    }
    // Write your overrides here.
  } as Theme

  return deepmerge(coreTheme(settings, mode, direction), userTheme)
}

export default mergedTheme
