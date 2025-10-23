// MUI Imports
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import Navigation from '@components/layout/vertical/Navigation'
// Component Imports
import Providers from '@components/Providers'
import ScrollToTop from '@core/components/scroll-to-top'
// Type Imports
import type { ChildrenType } from '@core/types'
// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import HorizontalLayout from '@layouts/HorizontalLayout'
// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import Button from '@mui/material/Button'

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const mode = getMode()
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout
            navigation={<Navigation mode={mode} systemMode={systemMode} />}
            navbar={<Navbar />}

            // footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout
            header={<Header />}

            // footer={<HorizontalFooter />}
          >
            {children}
          </HorizontalLayout>
        }
      />
      <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop>
    </Providers>
  )
}

export default Layout
