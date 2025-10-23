'use client'

import { createContext, PropsWithChildren, useContext, useEffect } from 'react'

import useLogout from '@/@core/hooks/useLogout'

import { useModal } from './ModalProvider'

type IInterceptorProviderContext = {}

type IInterceptorProviderProps = PropsWithChildren & {}

const InterceptorProviderContext = createContext<IInterceptorProviderContext>({})

const useInterceptorProviderContext = () => useContext(InterceptorProviderContext)

const InterceptorProvider = (props: IInterceptorProviderProps) => {
  // States
  const modalContext = useModal()
  const { handleUserLogout } = useLogout()

  // Hooks

  useEffect(() => {
    const handleEvent = (e: Event) => {
      if (e instanceof CustomEvent) {
        if (e.detail?.data?.logout) {
          modalContext.resetModalsState()
          modalContext.openModal({
            type: 'alert',
            props: {
              status: 'idle',
              heading: 'Info',
              description: e.detail?.message,
              onOkClick: async () => {
                await handleUserLogout(true)
              },
              visible: true,
              okButtonText: 'Logout'
            }
          })
        }
      }
    }

    window.addEventListener('httpInterceptor', handleEvent)

    return () => {
      window.removeEventListener('httpInterceptor', handleEvent)
    }
  }, [modalContext])

  return <InterceptorProviderContext.Provider value={{}}>{props.children}</InterceptorProviderContext.Provider>
}

export default InterceptorProvider

export { useInterceptorProviderContext }
