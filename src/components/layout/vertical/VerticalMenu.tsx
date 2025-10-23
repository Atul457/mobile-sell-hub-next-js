'use client'

// MUI Imports
// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'
import useVerticalNav from '@menu/hooks/useVerticalNav'
// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

import verticalMenuData from '@/data/navigation/verticalMenuData'

import useLogout from '@/@core/hooks/useLogout'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const { handleUserLogout } = useLogout()
  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = useVerticalNav()
  const [menuData] = useState(verticalMenuData())

  const { permissions } = useConfigProviderContext()

  // Vars
  const { transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {menuData.map((item, index) => {

          if (item.module && item.action) {
            // if (!permissions[item.module]?.includes(item.action)) {
            //   return null
            // }

            if (!permissions[item.module]?.includes("read")) {
              return null
            }
          }

          if (item.options) {
            return (
              <SubMenu
                key={`currMenuItem${index}`}
                label={item.label}
                onClick={item?.clickAction === 'logout' ? () => handleUserLogout() : undefined}
                icon={typeof item.icon === 'string' ? <i className={item.icon} /> : item.icon}
              >
                {item.options.map((currOption, index_) => {
                  return (
                    <MenuItem
                      key={`subMenuItem${index_}`}
                      href={currOption?.href}
                      onClick={currOption?.clickAction === 'logout' ? () => handleUserLogout() : undefined}
                      icon={typeof currOption.icon === 'string' ? <i className={currOption.icon} /> : currOption.icon}
                    >
                      {currOption.label}
                    </MenuItem>
                  )
                })}
              </SubMenu>
            )
          }

          return (
            <MenuItem
              key={`menuItem${index}`}
              href={item?.href}
              subUrls={item?.subUrls}
              onClick={item?.clickAction === 'logout' ? () => handleUserLogout() : undefined}
              icon={typeof item.icon === 'string' ? <i className={item.icon} /> : item.icon}
            >
              {item.label}
            </MenuItem>
          )
        })}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
