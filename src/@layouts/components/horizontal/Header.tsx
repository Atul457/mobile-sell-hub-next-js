'use client'

// MUI Imports
// Config Imports
import themeConfig from '@configs/themeConfig'
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
// Type Imports
import type { ChildrenType } from '@core/types'
import type { CSSObject } from '@emotion/styled'
// Styled Component Imports
import StyledHeader from '@layouts/styles/horizontal/StyledHeader'
// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useTheme } from '@mui/material/styles'
// Third-party Imports
import classnames from 'classnames'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Header = (props: Props) => {
  // Props
  const { children, overrideStyles } = props

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()

  // Vars
  const { navbarContentWidth } = settings

  const headerFixed = themeConfig.navbar.type === 'fixed'
  const headerStatic = themeConfig.navbar.type === 'static'
  const headerBlur = themeConfig.navbar.blur === true
  const headerContentCompact = navbarContentWidth === 'compact'
  const headerContentWide = navbarContentWidth === 'wide'

  return (
    <StyledHeader
      theme={theme}
      overrideStyles={overrideStyles}
      className={classnames(horizontalLayoutClasses.header, {
        [horizontalLayoutClasses.headerFixed]: headerFixed,
        [horizontalLayoutClasses.headerStatic]: headerStatic,
        [horizontalLayoutClasses.headerBlur]: headerBlur,
        [horizontalLayoutClasses.headerContentCompact]: headerContentCompact,
        [horizontalLayoutClasses.headerContentWide]: headerContentWide
      })}
    >
      {children}
    </StyledHeader>
  )
}

export default Header
