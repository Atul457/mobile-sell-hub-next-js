// Next Imports
// Component Imports
import Login from '@views/Login'
import type { Metadata } from 'next'

// Server Action Imports

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const LoginPage = () => {
  return <Login />
}

export default LoginPage
