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
import { Button, ButtonProps, Grid, Typography } from '@mui/material'
import * as React from 'react'

import useStyles from './CustomButton.module'

export enum BUTTONTYPE {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  FACEBOOK = 'facebook',
  LEAVE = 'leave',
  TRANSPARENT = 'transparent',
}

export enum BUTTONSIZE {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface ICustomButtonProps extends ButtonProps {
  children: any
  buttonType: BUTTONTYPE
  labelStyle?: any
  fullWidth?: boolean
  onClick?: any
  loading?: boolean
  size?: BUTTONSIZE
  dataCy?: string
}

const CustomButton = (props: ICustomButtonProps): JSX.Element => {
  const {
    variant,
    children,
    href,
    fullWidth,
    className,
    labelStyle,
    onClick,
    buttonType,
    startIcon,
    type,
    disabled,
    endIcon,
    size = BUTTONSIZE.MEDIUM,
    dataCy,
  } = props
  const { classes } = useStyles(size)()

  const getButtonClass = (buttonType: BUTTONTYPE) => {
    switch (buttonType) {
      case BUTTONTYPE.PRIMARY:
        return classes.primary
      case BUTTONTYPE.SECONDARY:
        return classes.secondary
      case BUTTONTYPE.TERTIARY:
        return classes.tertiary
      case BUTTONTYPE.FACEBOOK:
        return classes.facebook
      case BUTTONTYPE.LEAVE:
        return classes.leave
      case BUTTONTYPE.TRANSPARENT:
        return classes.transparent
    }
  }

  return (
    <Grid
      className={classes.root}
      style={{ width: `${fullWidth ? '100%' : 'initial'}`, minWidth: `${fullWidth ? '100%' : ''}` }}
    >
      <Button
        style={{ width: `${fullWidth ? '100%' : 'initial'}`, minWidth: `${fullWidth ? '100%' : ''}` }}
        startIcon={startIcon}
        onClick={onClick}
        variant={variant}
        className={`${getButtonClass(buttonType)} ${className}`}
        href={href}
        fullWidth={fullWidth}
        type={type}
        disabled={disabled}
        endIcon={endIcon}
        size={size}
        data-cy={dataCy}
        id={dataCy}
      >
        <Typography className={labelStyle}>{children}</Typography>
      </Button>
    </Grid>
  )
}

export default CustomButton
