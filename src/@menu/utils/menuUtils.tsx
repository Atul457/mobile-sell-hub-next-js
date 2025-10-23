// React Imports
// Third-party Imports
import type { CSSObject } from '@emotion/styled'
import type { ReactElement, ReactNode } from 'react'
import { Children, isValidElement } from 'react'

// Util Imports
import { menuClasses } from './menuClasses'
// Component Imports
import {
  Menu as HorizontalMenu,
  MenuItem as HorizontalMenuItem,
  SubMenu as HorizontalSubMenu
} from '../horizontal-menu'
// Styled Component Imports
import StyledMenuIcon from '../styles/StyledMenuIcon'
// Type Imports
import type { ChildrenType, RenderExpandedMenuItemIcon } from '../types'
import { Menu as VerticalMenu, MenuItem as VerticalMenuItem, SubMenu as VerticalSubMenu } from '../vertical-menu'

type RenderMenuIconParams = {
  level?: number
  active?: boolean
  disabled?: boolean
  styles?: CSSObject
  icon?: ReactElement
  renderExpandedMenuItemIcon?: RenderExpandedMenuItemIcon
  isBreakpointReached?: boolean
}

export const confirmUrlInChildren = (children: ChildrenType['children'], url: string): boolean => {
  if (!children) {
    return false
  }

  if (Array.isArray(children)) {
    return children.some((child: ReactNode) => confirmUrlInChildren(child, url))
  }

  if (isValidElement(children)) {
    const { component, href, children: subChildren } = children.props

    if (component && component.props.href) {
      return component.props.href === url
    }

    if (href) {
      return href === url
    }

    if (subChildren) {
      return confirmUrlInChildren(subChildren, url)
    }
  }

  return false
}

/*
 * Reason behind mapping the children of the horizontal-menu component to the vertical-menu component:
 * The Horizontal menu components will not work inside of Vertical menu on small screens.
 * So, we have to map the children of the horizontal-menu components to the vertical-menu components.
 * We also kept the same names and almost similar props for menuitem and submenu components for easy mapping.
 */
export const mapHorizontalToVerticalMenu = (children: ChildrenType['children']) => {
  return Children.map(children, child => {
    if (isValidElement(child)) {
      const { children, verticalMenuProps, ...rest } = child.props

      switch (child.type) {
        case HorizontalMenuItem:
          return <VerticalMenuItem {...rest}>{children}</VerticalMenuItem>
        case HorizontalSubMenu:
          return <VerticalSubMenu {...rest}>{mapHorizontalToVerticalMenu(children)}</VerticalSubMenu>
        case HorizontalMenu:
          return <VerticalMenu {...verticalMenuProps}>{mapHorizontalToVerticalMenu(child.props.children)}</VerticalMenu>
        default:
          return child
      }
    }

    return null
  })
}

/*
 * Render all the icons for Menu Item and SubMenu components for all the levels more than 0
 */
export const renderMenuIcon = (params: RenderMenuIconParams) => {
  const { icon, level, active, disabled, styles, renderExpandedMenuItemIcon, isBreakpointReached } = params

  if (icon && (level === 0 || (!isBreakpointReached && level && level > 0))) {
    return (
      <StyledMenuIcon className={menuClasses.icon} rootStyles={styles}>
        {icon}
      </StyledMenuIcon>
    )
  }

  if (
    level &&
    level !== 0 &&
    renderExpandedMenuItemIcon &&
    renderExpandedMenuItemIcon.icon !== null &&
    (!renderExpandedMenuItemIcon.level || renderExpandedMenuItemIcon.level >= level)
  ) {
    const iconToRender =
      typeof renderExpandedMenuItemIcon.icon === 'function'
        ? renderExpandedMenuItemIcon.icon({ level, active, disabled })
        : renderExpandedMenuItemIcon.icon

    if (iconToRender) {
      return (
        <StyledMenuIcon className={menuClasses.icon} rootStyles={styles}>
          {iconToRender}
        </StyledMenuIcon>
      )
    }
  }

  return null
}
