import { Box, BoxProps, Typography } from '@mui/material'
import Link from 'next/link'

import { IProfile } from '@/models/profile.model'
import { IUser } from '@/models/user.model'
import { utils } from '@/utils/utils'

import UserAvatar from './UserAvatar'

type ICommonUserDetailsProps = {
  containerProps?: BoxProps
  variant?: 'small' | 'data-grid'
  type: 'user' | 'profile'
  user: Omit<IUser | (IProfile & { profilePicture?: string }), 'email'> & {
    email?: IUser['email']
  }
}

const UserPreview = (props: ICommonUserDetailsProps) => {
  const { user, containerProps, variant } = props

  return (
    <Box
      {...containerProps}
      sx={{
        ...containerProps?.sx,
        display: 'flex',
        alignItems: user?.email ? 'flex-start' : 'center',
        columnGap: 2,
        ...(variant === 'data-grid' && {
          height: '100%',
          display: 'inline-flex'
        })
      }}
    >
      {props.type === 'user' ? (
        <UserAvatar
          variant={
            (['data-grid', 'small'] as ICommonUserDetailsProps['variant'][]).includes(props.variant)
              ? 'small'
              : undefined
          }
          picture={user.profilePicture}
          firstName={user.firstName}
          lastName={user.lastName}
        />
      ) : null}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'calc(100% - 48px)'
        }}
      >
        <Link href={`/${props.type === 'user' ? 'users' : 'profiles'}/${user._id}`} className='leading-1 flex'>
          <Typography
            variant='body2'
            sx={{
              color: 'text.primary',
              fontSize: theme => theme.typography.body2.fontSize,
              display: 'flex',
              fontWeight: 500,
              alignItems: 'center'
            }}
            className='custom-link hyperlink ellipsis'
            title={utils.helpers.user.getFullName(user)}
          >
            {utils.helpers.user.getFullName(user)}
          </Typography>
        </Link>
        {user?.email ? (
          <Typography
            variant='subtitle1'
            className='ellipsis'
            sx={{
              color: 'text.primary',
              fontSize: theme => theme.typography.subtitle2?.fontSize
            }}
            title={utils.helpers.getValue(user?.email)}
          >
            {utils.helpers.getValue(user?.email)}
          </Typography>
        ) : null}
      </Box>
    </Box>
  )
}

export default UserPreview
