'use client'

// React Imports
import Logo from '@components/layout/shared/Logo'
import { useSettings } from '@core/hooks/useSettings'
// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'
// Type Imports
import type { Mode, SystemMode } from '@core/types'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
// Component Imports
import VerticalNav, { NavHeader } from '@menu/vertical-menu'
// MUI Imports
import { styled, useColorScheme, useTheme } from '@mui/material/styles'
import { useEffect, useRef } from 'react'

import VerticalMenu from './VerticalMenu'

type Props = {
  mode: Mode
  systemMode: SystemMode
}

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-paper) ${
    theme.direction === 'rtl' ? '95%' : '5%'
  }, rgb(var(--mui-palette-background-paperChannel) / 0.85) 30%, rgb(var(--mui-palette-background-paperChannel) / 0.5) 65%, rgb(var(--mui-palette-background-paperChannel) / 0.3) 75%, transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = (props: Props) => {
  // Props
  const { mode, systemMode } = props

  // Hooks
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()

  // Refs
  const shadowRef = useRef(null)

  // Vars
  const { collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isServer = typeof window === 'undefined'
  const isSemiDark = settings.semiDark
  let isDark

  if (isServer) {
    isDark = mode === 'system' ? systemMode === 'dark' : mode === 'dark'
  } else {
    isDark = muiMode === 'system' ? muiSystemMode === 'dark' : muiMode === 'dark'
  }

  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      // @ts-expect-error: Unexpected
      if (!shadowRef.current.classList.contains('scrolled')) {
        // @ts-expect-error: Unexpected
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      // @ts-expect-error: Unexpected
      shadowRef.current.classList.remove('scrolled')
    }
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  return (
    // eslint-disable-next-line lines-around-comment
    // Sidebar Vertical Menu
    <VerticalNav
      customStyles={navigationCustomStyles(verticalNavOptions, theme)}
      collapsedWidth={71}
      backgroundColor='var(--mui-palette-background-paper)'
      // eslint-disable-next-line lines-around-comment
      // The following condition adds the data-mui-color-scheme='dark' attribute to the VerticalNav component
      // when semiDark is enabled and the mode or systemMode is light
      {...(isSemiDark &&
        !isDark && {
          'data-mui-color-scheme': 'dark'
        })}
    >
      {/* Nav Header including Logo & nav toggle icons  */}
      <NavHeader>
        <Logo />
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      <VerticalMenu scrollMenu={scrollMenu} />
    </VerticalNav>
  )
}

export default Navigation
