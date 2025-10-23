// Type Imports
import type { ChildrenType } from '@core/types'

import StoreProvider from '@/store/contexts/StoreProvider'

// Context Imports
// Util Imports
import AuthProvider from '@/contexts/AuthProvider'
import ConfigProvider from '@/contexts/ConfigProvider'
import DataProvider from '@/contexts/DataProvider'
import InterceptorProvider from '@/contexts/InterceptorProvider'
import ModalProvider from '@/contexts/ModalProvider'
import SessionProvider from '@/contexts/SessionProvider'

type Props = ChildrenType

const CustomProviders = (props: Props) => {
  return (
    <DataProvider>
      <SessionProvider>
        <StoreProvider>
          <AuthProvider>
            <ModalProvider>
              <InterceptorProvider>
                <ConfigProvider>{props.children}</ConfigProvider>
              </InterceptorProvider>
            </ModalProvider>
          </AuthProvider>
        </StoreProvider>
      </SessionProvider>
    </DataProvider>
  )
}

export default CustomProviders
