// Import all Horizontal Nav components and export them
import type { HorizontalNavProps } from '../components/horizontal-menu/HorizontalNav'
import HorizontalNav from '../components/horizontal-menu/HorizontalNav'
import type { MenuProps } from '../components/horizontal-menu/Menu'
import Menu from '../components/horizontal-menu/Menu'
import type { MenuItemProps } from '../components/horizontal-menu/MenuItem'
import MenuItem from '../components/horizontal-menu/MenuItem'
import type { SubMenuProps } from '../components/horizontal-menu/SubMenu'
import SubMenu from '../components/horizontal-menu/SubMenu'

export default HorizontalNav
export { Menu, MenuItem, SubMenu }
export type { HorizontalNavProps, MenuItemProps, MenuProps, SubMenuProps }
