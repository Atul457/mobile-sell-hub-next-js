// Third-party Imports
import type { CSSObject } from '@emotion/styled'
import styled from '@emotion/styled'

// Style Imports
import { menuButtonStyles } from '../../components/vertical-menu/MenuButton'
// Type Imports
import type { MenuItemProps } from '../../components/vertical-menu/MenuItem'
// Util Imports
import { menuClasses } from '../../utils/menuClasses'

type StyledVerticalMenuItemProps = Pick<MenuItemProps, 'rootStyles' | 'disabled'> & {
  level: number
  menuItemStyles?: CSSObject
  isCollapsed?: boolean
  isPopoutWhenCollapsed?: boolean
  buttonStyles?: CSSObject
}

const StyledVerticalMenuItem = styled.li<StyledVerticalMenuItemProps>`
  position: relative;
  margin-block-start: 4px;
  ${({ menuItemStyles }) => menuItemStyles};
  ${({ rootStyles }) => rootStyles};

  > .${menuClasses.button} {
    ${({ level, disabled, isCollapsed, isPopoutWhenCollapsed }) =>
      menuButtonStyles({
        level,
        disabled,
        isCollapsed,
        isPopoutWhenCollapsed
      })};
    ${({ buttonStyles }) => buttonStyles};
  }
`

export default StyledVerticalMenuItem
