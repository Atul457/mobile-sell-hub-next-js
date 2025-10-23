// Third-party Imports
import Logo from '@components/layout/shared/Logo'
// Type Imports
import type { ChildrenType } from '@core/types'
import NavCollapseIcons from '@menu/components/vertical-menu/NavCollapseIcons'
// Component Imports
import NavHeader from '@menu/components/vertical-menu/NavHeader'
// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'
// Util Imports
import { mapHorizontalToVerticalMenu } from '@menu/utils/menuUtils'
import PerfectScrollbar from 'react-perfect-scrollbar'

const VerticalNavContent = ({ children }: ChildrenType) => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  // Vars
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <>
      <NavHeader>
        <Logo />
        <NavCollapseIcons
          lockedIcon={<i className='tabler-circle-dot text-xl' />}
          unlockedIcon={<i className='tabler-circle text-xl' />}
          closeIcon={<i className='tabler-x text-xl' />}
        />
      </NavHeader>
      <ScrollWrapper
        {...(isBreakpointReached
          ? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
          : { options: { wheelPropagation: false, suppressScrollX: true } })}
      >
        {mapHorizontalToVerticalMenu(children)}
      </ScrollWrapper>
    </>
  )
}

export default VerticalNavContent
