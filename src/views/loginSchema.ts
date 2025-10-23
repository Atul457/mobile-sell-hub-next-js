import * as yup from 'yup'

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .test('email', 'Invalid email', value => {
      const exp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      
return exp.test(value ?? '')
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters and contain at least 1 letter')
    .max(10, 'Password must be at most 10 characters and contain at least 1 letter')
    .matches(/[a-zA-Z]/, 'Password must be at least 6 characters and contain at least 1 letter')
    .matches(/^\S*$/, 'Password cannot contain spaces')
})

export { loginSchema }
