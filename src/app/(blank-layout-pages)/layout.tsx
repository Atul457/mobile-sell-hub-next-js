// Type Imports
// Component Imports
import Providers from '@components/Providers'
import type { ChildrenType } from '@core/types'
// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import BlankLayout from '@layouts/BlankLayout'

type Props = ChildrenType

const Layout = ({ children }: Props) => {
  // Vars
  const direction = 'ltr'
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
