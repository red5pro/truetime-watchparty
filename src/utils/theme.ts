import { createTheme, Theme } from '@mui/material'
import '../assets/styles/index.css'

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

export const mergeThemes = () => {
  const theme = createTheme({
    palette: {
      text: {
        primary: '#FBFBFB',
      },
      primary: {
        main: '#FBFBFB',
      },
    },
    typography: {
      fontFamily: 'GeneralSans-Regular',
      fontSize: 14,
      h1: {
        fontSize: '90px !important',
        color: '#FBFBFB',
        fontFamily: 'GeneralSans-Regular',
        fontWeight: 600,
        fontStyle: 'normal',
        '@media (max-width:600px)': {
          fontSize: '60px !important',
        },
      },
      h2: {
        color: '#FBFBFB',
        fontWeight: 600,
        fontSize: '60px !important',
        '@media (max-width:600px)': {
          fontSize: '40px !important',
        },
      },
      h3: {
        color: '#FBFBFB',
        fontWeight: 600,
        fontSize: '40px !important',
        '@media (max-width:600px)': {
          fontSize: '30px !important',
        },
      },
      h4: {
        color: '#FBFBFB',
        fontWeight: 500,
        fontSize: '30px !important',
        '@media (max-width:600px)': {
          fontSize: '20px !important',
        },
      },
      h5: {
        color: '#FBFBFB',
        fontWeight: 500,
        fontSize: '20px !important',
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
            fontSize: '14px',
            fontFamily: 'GeneralSans-Regular',
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
            height: '35px',
            width: '290px',

            padding: '0',
            margin: '9px 0',
            backgroundColor: 'rgba(0, 0, 0, 0.3) !important',
            '& fieldset': {
              border: '1px solid #655f5f',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            '& fieldset:hover': {
              border: '1px solid #FFFFFF',
            },
            '&.Mui-focused fieldset': {
              border: '1px solid #FFFFFF',
            },
            '&:hover, &:focus, &:after, &:webkit-autofill': {
              backgroundColor: 'inherit',
              padding: '6px 14px',
            },
            '& input': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '6px 14px !important',

              '&:hover, &:focus, &:after, &:after': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '6px 14px !important',
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
            color: '#FFFFFF',
          },
          input: {
            backgroundColor: 'rgba(0, 0, 0, 0.3) !important',
            padding: '3px 14px !important',
            '&:hover, &:focus, &:after, &:after': {
              backgroundColor: 'rgba(0, 0, 0, 0.3) !important',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#655f5f',
            '&.Mui-focused': {},
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            paddingTop: 0,
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
  })

  return theme
}
