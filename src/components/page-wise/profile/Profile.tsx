'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography } from '@mui/material'
// import { useRouter } from 'next/navigation'
// import { signOut, useSession } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { ChangeEventHandler, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import CommonButton from '@/components/common/CommonButton'

// import CommonButton from '@/components/common/CommonButton'
import { useAppDispatch } from '@/store/hooks/hooks'
import { useAppSelector } from '@/store/hooks/hooks'
import { userActions, userSelectors } from '@/store/slices/user/user.slice'

// Third-party Imports
import CustomTextField from '@/@core/components/mui/TextField'
import { useModal } from '@/contexts/ModalProvider'
// import { IUser } from '@/next-auth'
import { commonSchemas } from '@/schemas/common.schemas'
import { UserService } from '@/services/client/User.service'
import { utils } from '@/utils/utils'

// import AuthFooter from '@/views/auth/AuthFooter'
import ProfilePictureBox from './ProfilePictureBox'

type IProfilePicture = {
  src: string
  file: File
} | null

type FormData = (typeof commonSchemas.updateAdminProfileSchema)['__outputType']

const Profile = () => {
  const [updating, setUpdating] = useState(false)
  const [converting, setConverting] = useState(false)
  const [profilePictureUpdating, setProfilePictureUpdating] = useState(false)
  const [profilePicture, setProfilePicture] = useState<IProfilePicture>(null)

  // Hooks
  // const router = useRouter()
  const session = useSession()
  const dispatch = useAppDispatch()
  const user = useAppSelector(userSelectors.user)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.updateAdminProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: ''
      // addressMeta: utils.helpers.user.formatAddress()
    }
  })

  const STORAGE_PATH = utils.CONST.APP_CONST.CONFIG.STORAGE_PATH

  const userName = user ? utils.helpers.user.getFullName(user) : 'User name'
  const initials = userName
    .split(' ')
    .splice(0, 2)
    .map(name => name[0])
    .join('')

  // Hooks
  const modalContext = useModal()

  useEffect(() => {
    if (!user) {
      return
    }

    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })

    if (user.profilePicture) {
      const profilePicture = `${STORAGE_PATH}${user.profilePicture}`
      setProfilePicture({
        src: profilePicture,
        file: new File([], '')
      })
    }
  }, [user])

  // Functions

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      setUpdating(true)
      const userService = new UserService()
      const response = await userService.update(data)

      if (response.data) {
        dispatch(userActions.updateUser(response.data ?? {}))
        await session.update({
          info: response.data
        })
      }

      utils.toast.success({ message: utils.error.getMessage(response.message) })
      setUpdating(false)
    } catch (error: any) {
      setUpdating(false)
      console.error(error)
    }
  }

  const onRemoveProfilePicture = () => {
    setProfilePicture(null)
    uploadProfilePicture(null)
  }

  const uploadProfilePicture = async (file: File | null) => {
    setProfilePictureUpdating(true)
    try {
      const us = new UserService()
      const response = await us.uploadUserProfilePicture({
        file
      })
      dispatch(userActions.updateUser(response.data ?? {}))
      await session.update({
        info: response.data
      })
      utils.toast.success({ message: response.message ?? '' })
    } catch (error: any) {
      console.error(error)
      utils.toast.error({ message: utils.error.getMessage(error) })
    }
    setProfilePictureUpdating(false)
  }

  const profilePictureChange: ChangeEventHandler<HTMLInputElement> = async e => {
    try {
      let file: File | null = null
      const updated = await utils.helpers.user.profilePictureChange({
        e,
        setProfilePicture: (profilePicture: IProfilePicture) => {
          file = profilePicture?.file ?? null
          setProfilePicture(profilePicture)
        },
        setConverting
      })

      if (updated !== false) {
        await uploadProfilePicture(file)
      }
    } catch (error) {
      utils.toast.error({ message: utils.error.getMessage(error) })
      setProfilePictureUpdating(false)
      console.error(error)
    }
  }

  const onUpdatePasswordClick = () => {
    modalContext.openModal({
      type: 'updatePassword',
      props: {
        visible: true
      }
    })
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            position: 'relative',
            marginBottom: 10,
            marginTop: 4
          }}
        >
          <ProfilePictureBox
            isProfile={true}
            initials={initials}
            loading={converting || profilePictureUpdating}
            onChange={profilePictureChange}
            onRemove={onRemoveProfilePicture}
            src={profilePicture?.src ?? null}
          />
        </Box>

        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4 max-md:h-full'
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Email'
                // className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                placeholder='Enter email  '
                {...(errors.email && {
                  error: true,
                  helperText: utils.string.capitalize(errors.email.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

          <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
            <Controller
              name='firstName'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='First Name'
                  className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                  placeholder='Enter first name'
                  {...(errors.firstName && {
                    error: true,
                    helperText: utils.string.capitalize(errors.firstName.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )}
            />

            <Controller
              name='lastName'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Last Name'
                  className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                  placeholder='Enter last name'
                  {...(errors.lastName && {
                    error: true,
                    helperText: utils.string.capitalize(errors.lastName.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 10
            }}
          >
            <Typography
              color='hyperlink.main'
              variant='inherit'
              fontWeight={600}
              onClick={() => onUpdatePasswordClick()}
              sx={{
                cursor: 'pointer'
              }}
            >
              Change Password
            </Typography>
          </Box>
          <CommonButton loading={updating} label='Update' />
        </form>
      </Box>
    </>
  )
}

export default Profile
