import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormControl, IconButton } from '@mui/material'
import { Field } from 'formik'
import { TextField } from 'formik-mui'
import React from 'react'

import useTextFieldStyles from './Field.module'

interface IPasswordField {
  label: string
  id: string
  inputProps?: any
  fullWidth: boolean
  error?: boolean
  success?: boolean
  handleChange: any
  type: any
  form: any
  placeholder?: string
  disabled: boolean
  required: boolean
  maxLength?: number
  min?: number
  max?: number
  onKeyPress?: any
}

const PasswordField = (props: IPasswordField) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const { fullWidth, inputProps = {}, label, id, placeholder, disabled, required, onKeyPress } = props
  const { classes } = useTextFieldStyles()

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return (
    <FormControl className={classes.formField}>
      <Field
        id={id}
        name={id}
        label={label}
        variant="outlined"
        component={TextField}
        placeholder={placeholder ?? ''}
        disabled={disabled}
        type={showPassword ? 'text' : 'password'}
        inputProps={{ ...inputProps }}
        required={required}
        fullWidth={fullWidth}
        className={classes.input}
        onKeyPress={onKeyPress}
      />
      <IconButton onClick={handleClickShowPassword} className={classes.icon} edge="end">
        {!showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </FormControl>
  )
}

export default PasswordField
