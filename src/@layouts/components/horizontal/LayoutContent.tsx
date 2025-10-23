'use client'

// Third-party Imports
// Config Imports
import themeConfig from '@configs/themeConfig'
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
// Type Imports
import type { ChildrenType } from '@core/types'
// Styled Component Imports
import StyledMain from '@layouts/styles/shared/StyledMain'
// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
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
      className={classnames(horizontalLayoutClasses.content, 'flex-auto', {
        [`${horizontalLayoutClasses.contentCompact} is-full`]: contentCompact,
        [horizontalLayoutClasses.contentWide]: contentWide
      })}
      style={{ padding: themeConfig.layoutPadding }}
    >
      {children}
    </StyledMain>
  )
}

export default LayoutContent
