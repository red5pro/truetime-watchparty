import { createTheme, Theme } from '@mui/material'

export const THEME_WRAPPER = 'emw'

export interface DefaultAppTheme extends Theme {
  button: {
    primaryColor: string
    primaryButtonColor: string
    primaryButtonBorder: string
    primaryButtonFontColor: string
    primaryButtonColorHover: string
    primaryButtonBorderHover: string
    primaryButtonFontColorHover: string
    //secondary pallete
    secondaryButtonColor: string
    secondaryButtonBorder: string
    secondaryButtonFontColor: string
    secondaryButtonColorHover: string
    secondaryButtonBorderHover: string
    secondaryButtonFontColorHover: string
    secondaryColor: string
    //tertiary pallete
    tertiaryColor: string
  }
}

const fontFamily = [
  'GeneralSans-Variable',
  'GeneralSans-VariableItalic',
  'GeneralSans-Extralight',
  'GeneralSans-ExtralightItalic',
  'GeneralSans-Light',
  'GeneralSans-LightItalic',
  'GeneralSans-Regular',
  'GeneralSans-Italic',
  'GeneralSans-Medium',
  'GeneralSans-MediumItalic',
  'GeneralSans-Semibold',
  'GeneralSans-SemiboldItalic',
  'GeneralSans-Bold',
  'GeneralSans-BoldItalic',
].join(',')

export const mergeThemes = () => {
  const theme = createTheme(
    {
      shape: {
        borderRadius: 17.5,
      },

      palette: {
        text: {
          primary: '#ffffff',
        },
        primary: {
          main: '#FFFFFF',
        },
      },
      typography: {
        fontFamily: 'GeneralSans-Regular',
        fontSize: 12,
        h1: {
          fontSize: '90px',
          color: '#FFFFFF',
          fontFamily: 'GeneralSans-Regular',
          fontWeight: 600,
          fontStyle: 'normal',
        },
        h2: {
          color: '#FFFFFF',
        },
        h3: {
          color: '#FFFFFF',
        },
        h4: {
          color: '#FFFFFF',
        },
        h5: {
          color: '#FFFFFF',
        },
      },
      components: {
        MuiLink: {
          styleOverrides: {
            root: {
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              body1: {
                fontSize: `initial`,
                fontFamily: 'GeneralSans-Regular',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: 'none',
              borderRadius: '5px',
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              color: 'lightgray',
              width: '100%',
              marginTop: 10,
              marginBottom: 10,
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              '& fieldset': {
                border: `2px solid #E6E6E6`,
                color: 'rgba(0, 0, 0, 0.6)',
              },
              '& fieldset:hover': {
                border: `2px solid #E6E6E6`,
                color: 'rgba(0, 0, 0, 0.6)',
              },
              '&.Mui-focused fieldset': {
                borderColor: `#0C9ED9 !important`,
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              '&.Mui-focused fieldset': {
                borderColor: '#3F51B5',
              },
              borderRadius: '4px',
              color: '#464547',
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              '&.Mui-focused': {
                color: '#0C9ED9 !important',
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            outlined: {
              padding: '15px',
              borderRadius: '15px',
              boxShadow: 'none',
            },
            contained: {
              padding: '15px',
              borderRadius: '15px',
              boxShadow: 'none',
            },
            text: {
              padding: '15px',
              borderRadius: '15px',
              textTransform: 'capitalize',
              fontWeight: 600,
              fontStyle: 'normal',
            },
          },
        },
      },
    },
    {
      button: {
        // primaryColor: primaryColor,
        // primaryButtonColor: primaryButtonColor,
        // primaryButtonBorder: primaryButtonBorder,
        // primaryButtonFontColor: primaryButtonFontColor,
        // primaryButtonColorHover: primaryButtonColorHover,
        // primaryButtonBorderHover: primaryButtonBorderHover,
        // primaryButtonFontColorHover: primaryButtonFontColorHover,
        //secondary pallete
        // secondaryButtonColor: secondaryButtonColor,
        // secondaryButtonBorder: secondaryButtonBorder,
        // secondaryButtonFontColor: secondaryButtonFontColor,
        // secondaryButtonColorHover: secondaryButtonColorHover,
        // secondaryButtonBorderHover: secondaryButtonBorderHover,
        // secondaryButtonFontColorHover: secondaryButtonFontColorHover,
        // secondaryColor: secondaryColor,
        //tertiary pallete
        // tertiaryColor: tertiaryColor,
      },
    }
  )
  return theme
}
