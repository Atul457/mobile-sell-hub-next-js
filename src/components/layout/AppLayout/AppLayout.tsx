'use client'

import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

import StoreProvider from '@/store/contexts/StoreProvider'

import AuthProvider from '@/contexts/AuthProvider'

const AppLayout = (props: PropsWithChildren) => {
  return (
    <>
      <SessionProvider>
        <StoreProvider>
          <AuthProvider>{props.children}</AuthProvider>
        </StoreProvider>
      </SessionProvider>
      <ToastContainer />
    </>
  )
}

export default AppLayout
