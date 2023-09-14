/*
Copyright © 2015 Infrared5, Inc. All rights reserved.

The accompanying code comprising examples for use solely in conjunction with Red5 Pro (the "Example Code")
is  licensed  to  you  by  Infrared5  Inc.  in  consideration  of  your  agreement  to  the  following
license terms  and  conditions.  Access,  use,  modification,  or  redistribution  of  the  accompanying
code  constitutes your acceptance of the following license terms and conditions.

Permission is hereby granted, free of charge, to you to use the Example Code and associated documentation
files (collectively, the "Software") without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The Software shall be used solely in conjunction with Red5 Pro. Red5 Pro is licensed under a separate end
user  license  agreement  (the  "EULA"),  which  must  be  executed  with  Infrared5,  Inc.
An  example  of  the EULA can be found on our website at: https://account.red5pro.com/assets/LICENSE.txt.

The above copyright notice and this license shall be included in all copies or portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING  BUT
NOT  LIMITED  TO  THE  WARRANTIES  OF  MERCHANTABILITY, FITNESS  FOR  A  PARTICULAR  PURPOSE  AND
NONINFRINGEMENT.   IN  NO  EVENT  SHALL INFRARED5, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN  AN  ACTION  OF  CONTRACT,  TORT  OR  OTHERWISE,  ARISING  FROM,  OUT  OF  OR  IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { createTheme, Theme } from '@mui/material'
import type {} from '@mui/x-date-pickers/themeAugmentation'
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
            paddingBottom: 0,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              color: 'gray',
              backgroundColor: 'lightgray',
              borderColor: 'lightgray',
            },
          },
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
      MuiCalendarPicker: {
        styleOverrides: {
          root: {
            backgroundColor: '#655f5f',
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            backgroundColor: '#999999',
          },
        },
      },
      MuiClockPicker: {
        styleOverrides: {
          root: {
            backgroundColor: '#999999',
          },
        },
      },
    },
  })

  return theme
}
