import { Button, ButtonProps, Grid, Typography } from '@mui/material'
import * as React from 'react'

import useStyles from './CustomButton.module'

export enum BUTTONTYPE {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

export enum BUTTONSIZE {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface ICustomButtonProps extends ButtonProps {
  children: any
  buttonType: BUTTONTYPE
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
    }
  }

  return (
    <Grid
      className={classes.root}
      style={{ width: `${fullWidth ? '100%' : 'initial'}` }}
      alignItems="center"
      justifyContent="center"
    >
      <Button
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
        <Typography>{children}</Typography>
      </Button>
    </Grid>
  )
}

export default CustomButton
