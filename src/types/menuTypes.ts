// React Imports
import type {
  MenuItemProps as HorizontalMenuItemProps,
  SubMenuProps as HorizontalSubMenuProps
} from '@menu/horizontal-menu'
// Type Imports
import type {
  MenuItemProps as VerticalMenuItemProps,
  MenuSectionProps as VerticalMenuSectionProps,
  SubMenuProps as VerticalSubMenuProps
} from '@menu/vertical-menu'
// MUI Imports
import type { ChipProps } from '@mui/material/Chip'
import type { ReactElement, ReactNode } from 'react'

import { IRolePermission } from '@/models/rolePermission.model'

type ICustomVerticalMenuItemDataType = {
  icon?: ReactElement | string
  subUrls?: string[]
  href: string
  module?: IRolePermission['module']
  clickAction?: 'logout'
  action?: IRolePermission['actions'][0]
  options?: (VerticalMenuItemDataType | VerticalSubMenuDataType)[]
}

// Vertical Menu Data
export type VerticalMenuItemDataType = Omit<VerticalMenuItemProps, 'children' | 'icon' | 'prefix' | 'suffix'> & {
  label: ReactNode
  prefix?: ReactNode | ChipProps
  suffix?: ReactNode | ChipProps
} & ICustomVerticalMenuItemDataType

export type VerticalSubMenuDataType = Omit<VerticalSubMenuProps, 'children' | 'icon' | 'prefix' | 'suffix'> & {
  children?: VerticalMenuDataType[]
  prefix?: ReactNode | ChipProps
  suffix?: ReactNode | ChipProps
} & ICustomVerticalMenuItemDataType

export type VerticalSectionDataType = Omit<VerticalMenuSectionProps, 'children'> & {
  isSection: boolean
  children?: VerticalMenuDataType[]
}

export type VerticalMenuDataType = VerticalMenuItemDataType | VerticalSubMenuDataType

// export type VerticalMenuDataType = VerticalMenuItemDataType | VerticalSubMenuDataType | VerticalSectionDataType

// Horizontal Menu Data
export type HorizontalMenuItemDataType = Omit<HorizontalMenuItemProps, 'children' | 'icon' | 'prefix' | 'suffix'> & {
  label: ReactNode
  prefix?: ReactNode | ChipProps
  suffix?: ReactNode | ChipProps
} & ICustomVerticalMenuItemDataType

export type HorizontalSubMenuDataType = Omit<HorizontalSubMenuProps, 'children' | 'icon' | 'prefix' | 'suffix'> & {
  children: HorizontalMenuDataType[]
  prefix?: ReactNode | ChipProps
  suffix?: ReactNode | ChipProps
} & ICustomVerticalMenuItemDataType

export type HorizontalMenuDataType = HorizontalMenuItemDataType | HorizontalSubMenuDataType
