import * as Yup from 'yup'

const testPassword = (value?: string) => {
  if (value) {
    return /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9]).{6,}$/.test(value)
  } else return false
}

export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email field is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password field is required'),
  // .test('', 'Password must include at least one number, one uppercase letter and one lowercase letter', (value) =>
  //   testPassword(value)
  // )
})

export const signUpValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email field is required'),
})

export const accountVerificationSchema = Yup.object().shape({
  ...validationSchema.shape,
  token: Yup.string().required('Token field is required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password Confirmation field is required'),
})
