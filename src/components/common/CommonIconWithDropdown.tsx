import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { ReactNode, useEffect, useState } from 'react'

// Define the type for the menu option
interface MenuOption {
  label: string | ReactNode
  value?: any
  onClick?: () => void
}

export interface CommonIconWithDropdownProps {
  iconProps?: IconButtonProps
  component: ReactNode
  menuOptions: MenuOption[]
  onValueChange?: (selectedOption: MenuOption['value']) => void
}

const CommonIconWithDropdown: React.FC<CommonIconWithDropdownProps> = props => {
  const { component, menuOptions, onValueChange, iconProps = {} } = props

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedValue, setSelectedValue] = useState<MenuOption['value']>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (value: MenuOption['value'], onClick: MenuOption['onClick']) => {
    setSelectedValue(value)
    onClick?.()
    handleClose()
  }

  useEffect(() => {
    if (selectedValue && onValueChange) {
      onValueChange(selectedValue)
      setSelectedValue(null)
    }
  }, [selectedValue, onValueChange])

  return (
    <div>
      <IconButton {...iconProps} onClick={handleClick}>
        {component}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {menuOptions.map((option, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(option.label, option.onClick)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default CommonIconWithDropdown
