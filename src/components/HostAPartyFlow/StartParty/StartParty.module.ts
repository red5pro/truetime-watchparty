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
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: any) => {
  return {
    root: {},
    container: {
      marginTop: '5rem',
      marginLeft: '15%',
      [theme.breakpoints.down('sm')]: {
        marginTop: '3rem',
      },
    },

    buttonContainer: {
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    link: {
      fontWeight: 'normal',
      fontSize: '14px',
    },
    formContainer: {},
    textField: {
      height: '80px !important',
      width: '290px',
      padding: '9px 14px',
      margin: '9px 0',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid #655f5f',
      borderRadius: '4px',
      color: '#FFFFFF',
      fontFamily: 'inherit',
      letterSpacing: 'inherit',
      font: 'inherit',
    },
    selectField: {
      '& svg': {
        fill: 'white',
      },
    },
    errorTextField: {
      border: '1px solid #d32f2f',

      '& fieldset': {
        border: 'none',
      },
    },
    errorValidation: {
      color: '#d32f2f',
    },
    checkbox: {
      padding: '0',
      color: '#655f5f',
      '& svg': {
        fill: 'lightgray',
      },
    },
    item: {},
    menuItem: {
      backgroundColor: '#30303099',
      '&&.Mui-selected': {
        backgroundColor: '#3030305c',
      },
      '&&:hover': {
        backgroundColor: '#30303073',
      },
    },

    image: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      opacity: '0.6',
      zIndex: '-1',
    },
  }
})

export default useStyles
