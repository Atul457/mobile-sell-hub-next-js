'use client'

// Third-party Imports
import useLayoutInit from '@core/hooks/useLayoutInit'
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
// Type Imports
import type { ChildrenType, SystemMode } from '@core/types'
import classnames from 'classnames'

// Util Imports
import { blankLayoutClasses } from './utils/layoutClasses'

type Props = ChildrenType & {
  systemMode: SystemMode
}

const BlankLayout = (props: Props) => {
  // Props
  const { children, systemMode } = props

  // Hooks
  const { settings } = useSettings()

  useLayoutInit(systemMode)

  return (
    <div className={classnames(blankLayoutClasses.root, 'is-full bs-full')} data-skin={settings.skin}>
      {children}
    </div>
  )
}

export default BlankLayout
