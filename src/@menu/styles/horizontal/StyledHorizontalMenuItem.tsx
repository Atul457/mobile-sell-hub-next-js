// Third-party Imports
import type { CSSObject } from '@emotion/styled'
import styled from '@emotion/styled'

// Style Imports
import { menuButtonStyles } from '../../components/horizontal-menu/MenuButton'
// Type Imports
import type { MenuItemProps } from '../../components/horizontal-menu/MenuItem'
// Util Imports
import { menuClasses } from '../../utils/menuClasses'

type StyledHorizontalMenuItemProps = Pick<MenuItemProps, 'rootStyles' | 'disabled'> & {
  level: number
  menuItemStyles?: CSSObject
  buttonStyles?: CSSObject
}

const StyledHorizontalMenuItem = styled.li<StyledHorizontalMenuItemProps>`
  position: relative;
  ${({ level }) => level === 0 && { borderRadius: '6px', overflow: 'hidden' }}
  ${({ menuItemStyles }) => menuItemStyles};
  ${({ rootStyles }) => rootStyles};

  > .${menuClasses.button} {
    ${({ level, disabled }) =>
      menuButtonStyles({
        level,
        disabled
      })};
    ${({ buttonStyles }) => buttonStyles};
  }
`

export default StyledHorizontalMenuItem
