import { Avatar } from '@mui/material'
import clsx from 'clsx'

import { IUser } from '@/models/user.model'
import { utils } from '@/utils/utils'

type IUserAvatarProps = {
  variant?: 'small'
  picture?: string | null
  firstName: IUser['firstName']
  lastName: IUser['lastName']
}

const UserAvatar = (props: IUserAvatarProps) => {
  const { picture, ...rest } = props

  const userName = utils.helpers.user.getFullName(rest)
  const STORAGE_PATH = utils.CONST.APP_CONST.CONFIG.STORAGE_PATH
  const profilePicture = picture ? `${STORAGE_PATH}${picture}` : undefined

  const initials = !profilePicture
    ? userName
        .split(' ')
        .splice(0, 2)
        .map(name => name[0]?.toUpperCase())
        .join('')
    : undefined

  return (
    <Avatar
      alt={userName}
      src={profilePicture}
      className={clsx('cursor-pointer max-lg:hidden lg:bs-[40px] lg:is-[40px]', props.variant === 'small' && 'text-sm')}
    >
      {initials}
    </Avatar>
  )
}

export default UserAvatar
