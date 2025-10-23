'use client'

// Third-party Imports
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
// Type Imports
import type { ChildrenType } from '@core/types'
// Styled Component Imports
import StyledMain from '@layouts/styles/shared/StyledMain'
// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import classnames from 'classnames'

const LayoutContent = ({ children }: ChildrenType) => {
  // Hooks
  const { settings } = useSettings()

  // Vars
  const contentCompact = settings.contentWidth === 'compact'
  const contentWide = settings.contentWidth === 'wide'

  return (
    <StyledMain
      isContentCompact={contentCompact}
      className={classnames(verticalLayoutClasses.content, 'flex-auto', {
        [`${verticalLayoutClasses.contentCompact} is-full`]: contentCompact,
        [verticalLayoutClasses.contentWide]: contentWide
      })}
    >
      {children}
    </StyledMain>
  )
}

export default LayoutContent
