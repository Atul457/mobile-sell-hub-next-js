// Third-party Imports
// Type Imports
import type { ChildrenType } from '@core/types'
// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import classnames from 'classnames'

const Navbar = ({ children }: ChildrenType) => {
  return (
    <div className={classnames(horizontalLayoutClasses.navbar, 'flex items-center justify-between is-full')}>
      {children}
    </div>
  )
}

export default Navbar
