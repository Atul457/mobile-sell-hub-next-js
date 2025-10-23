'use client'

// Component Imports
import LayoutHeader from '@layouts/components/horizontal/Header'
import Navbar from '@layouts/components/horizontal/Navbar'
// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

import NavbarContent from './NavbarContent'
import Navigation from './Navigation'

const Header = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <>
      <LayoutHeader>
        <Navbar>
          <NavbarContent />
        </Navbar>
        {!isBreakpointReached && <Navigation />}
      </LayoutHeader>
      {isBreakpointReached && <Navigation />}
    </>
  )
}

export default Header
