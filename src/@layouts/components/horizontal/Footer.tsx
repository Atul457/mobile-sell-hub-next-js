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
import StyledFooter from '@layouts/styles/horizontal/StyledFooter'
// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'
import { useTheme } from '@mui/material/styles'
// Third-party Imports
import classnames from 'classnames'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Footer = (props: Props) => {
  // Props
  const { children, overrideStyles } = props

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()

  // Vars
  const { footerContentWidth } = settings

  const footerStatic = themeConfig.footer.type === 'static'
  const footerFixed = themeConfig.footer.type === 'fixed'
  const footerContentCompact = footerContentWidth === 'compact'
  const footerContentWide = footerContentWidth === 'wide'

  return (
    <StyledFooter
      theme={theme}
      overrideStyles={overrideStyles}
      className={classnames(horizontalLayoutClasses.footer, {
        [horizontalLayoutClasses.footerStatic]: footerStatic,
        [horizontalLayoutClasses.footerFixed]: footerFixed,
        [horizontalLayoutClasses.footerContentCompact]: footerContentCompact,
        [horizontalLayoutClasses.footerContentWide]: footerContentWide
      })}
    >
      <div className={horizontalLayoutClasses.footerContentWrapper}>{children}</div>
    </StyledFooter>
  )
}

export default Footer
