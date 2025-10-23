'use client'

// React Imports
import { useSettings } from '@core/hooks/useSettings'
import { IconButton, MenuItem } from '@mui/material'
// MUI Imports
import Avatar from '@mui/material/Avatar'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import MenuList from '@mui/material/MenuList'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
// Next Imports
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { useRef, useState } from 'react'

import CommonButton from '@/components/common/CommonButton'
import Loader from '@/components/Loader'

import { useAppSelector } from '@/store/hooks/hooks'
import { userSelectors } from '@/store/slices/user/user.slice'

// Hook Imports
import useLogout from '@/@core/hooks/useLogout'
import { utils } from '@/utils/utils'

// const baseUrl = utils.CONST.APP_CONST.CONFIG.STORAGE_PATH

const UserDropdown = () => {
  // States
  const { settings } = useSettings()
  const [open, setOpen] = useState(false)

  const { handleUserLogout } = useLogout()
  const user = useAppSelector(userSelectors.user)
  const userStatus = useAppSelector(userSelectors.userStatus)
  const loading = userStatus === 'loading'

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  if (loading) {
    return <Loader size='sm' />
  }

  const handlerRouteShift = () => {
    router.push('/profile')
  }

  const userName = user ? utils.helpers.user.getFullName(user) : 'User name'
  const STORAGE_PATH = utils.CONST.APP_CONST.CONFIG.STORAGE_PATH
  const profilePicture = user?.profilePicture ? `${STORAGE_PATH}${user.profilePicture}` : undefined

  const initials = !profilePicture
    ? userName
        .split(' ')
        .splice(0, 2)
        .map(name => name[0]?.toUpperCase())
        .join('')
    : undefined

  return (
    <>
      <IconButton
        onClick={() => handleUserLogout()}
        size='small'
        disabled={loading}
        sx={{
          background: 'none !important',
          minWidth: 'unset',
          height: 'fit-content',
          paddingRight: '0 !important',
          display: {
            xs: 'flex',
            lg: 'none'
          },
          alignItems: 'center',
          width: 'fit-content',
          border: 'none !important'
        }}
      >
        <i className='tabler-power text-[var(--mui-palette-subTitle-mob)] text-xl' />
      </IconButton>

      <Avatar
        ref={anchorRef}
        alt={userName}
        src={profilePicture}
        onClick={handleDropdownOpen}
        className='cursor-pointer max-lg:hidden lg:bs-[44px] lg:is-[44px]'
      >
        {initials}
      </Avatar>

      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar alt={userName} src={profilePicture}>
                      {initials}
                    </Avatar>
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {userName}
                      </Typography>
                      <Typography variant='caption'>{(user?.email ?? '').toLowerCase()}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />

                  <MenuItem
                    className='mli-2 gap-3'
                    onClick={e => {
                      handleDropdownClose(e)
                      handlerRouteShift()
                    }}
                  >
                    <i className='tabler-user text-[22px]' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>

                  <div className='flex items-center plb-2 pli-3'>
                    <CommonButton
                      fullWidth
                      type='button'
                      label='Logout'
                      color='error'
                      size='small'
                      loading={loading}
                      endIcon={<i className='tabler-logout' />}
                      onClick={() => handleUserLogout()}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    />
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
