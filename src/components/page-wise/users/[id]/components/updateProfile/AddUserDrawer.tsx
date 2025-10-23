'use client'

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Divider, Drawer, IconButton, MenuItem, Typography } from '@mui/material'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
// import Autocomplete from 'react-google-autocomplete'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'
import CommonTooltip from '@/components/common/CommonTooltip'

import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { IRolePopulated } from '@/models/role.model'
import { IUser } from '@/models/user.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { UsersService } from '@/services/client/Users.service'
import { utils } from '@/utils/utils'

type IUsers = {
  roles: IRolePopulated[]
  onUpdate: Function
  onClose: Function
  visible: boolean
  user: IUser | null
}

type FormData = (typeof commonSchemas.createAdminUsers)['__outputType']

const USER_TYPES = utils.CONST.USER.TYPES
const DEFAULT_VALUE = {
  type: USER_TYPES.INDIVIDUAL,
  firstName: '',
  organizationName: '',
  lastName: '',
  email: '',
  address: '',
  phoneNumber: '',
  phoneNumber_: '',
  roleId: '0'
}

const AddUserDrawer = (props: IUsers) => {
  const [updating, setUpdating] = useState(false)

  const onClose = () => {
    props.onClose()
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.createAdminUsers),
    defaultValues: { ...DEFAULT_VALUE }
  })


  const isSubmitted_ = isSubmitted
  const visible = Boolean(props.visible || props.user)


  useEffect(() => {
    if (visible) {
      if (props.user) {
        const { role: _, addressMeta: __, ...rest } = props.user;
        reset({
          ...rest,
          phoneNumber_: rest.phoneNumber ?? '',
          roleId: rest.roleId as unknown as string
        })
      } else {
        reset({ ...DEFAULT_VALUE })
      }
    }
  }, [visible, props.user, reset])


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setUpdating(true)
      const usersService = new UsersService()
      let response;
      if (props.user) {
        response = await usersService.updateProfile(props.user?._id as string, { ...data })
      } else {
        response = await usersService.addProfile(data)
      }

      if (response.data) {
        await props.onUpdate(response.data)
      }

      utils.toast.success({ message: utils.error.getMessage(response.message) })
      onClose()
      setUpdating(false)
    } catch (error: any) {
      setUpdating(false)
      console.error(error)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  return (
    <Drawer
      anchor='right'
      open={visible}
      onClose={onClose}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true
      }}
      className={classNames('block', { static: !visible, absolute: visible })}
      PaperProps={{
        className: classNames('is-[500px] shadow-none rounded-s-[6px]', {
          static: false
        })
      }}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          width: 650
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute'
        }
      }}
    >
      <form
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 max-md:h-full'
      >
        <Box
          className='is-full mb-[-18px]'
          sx={{
            paddingInline: 6,
            paddingBlock: '15px'
          }}
        >
          <Typography
            variant='h4'
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {props.user ? 'Update Profile' : 'Add New Admin User'}
            <CommonTooltip
              tooltipProps={{
                placement: 'top'
              }}
              description=' An invitation will be sent to this email to join the platform with the assigned role.'
            >
              <IconButton
                sx={{
                  color: 'primary.main',
                  fontSize: '18px'
                }}
              >
                <i className='tabler-info-circle' />
              </IconButton>
            </CommonTooltip>
          </Typography>
        </Box>
        <Divider className='is-full ' />

        <Box
          sx={{
            paddingInline: 6,
            paddingBlock: 5,
            display: 'flex',
            flexDirection: 'column',
            rowGap: 3
          }}
          className='is-full  my-[-8px]'
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Email'
                disabled={!!props.user?.email}
                // className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                placeholder='Enter Email'
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
          <Controller
            name='phoneNumber_'
            control={control}
            render={({ field: { ref, ...field } }) => (
              <CustomTextField
                {...{
                  ...field,
                  onChange: e => {
                    let value = e.target.value
                    const value_ = utils.dom.onNumberTypeFieldChangeWithoutE(e.target.value, { maxLength: 10 })
                    setValue('phoneNumber', value_, {
                      shouldValidate: isSubmitted_
                    })
                    e.target.value = value
                    field.onChange(e)
                  }
                }}
                type='phone'
                inputRef={ref}
                fullWidth
                label='Mobile Number'
                placeholder='Enter your mobile number'
                {...(errors.phoneNumber && {
                  error: true,
                  helperText: errors.phoneNumber.message
                })}
              />
            )}
          />
          <Controller
            name='roleId'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Role'
                sx={{
                  paddingInlineEnd: 0
                }}
                select
                SelectProps={{
                  MenuProps: themeConfig.components.select.MenuProps,
                  multiple: false,
                }}
              >
                <MenuItem value="0">Select</MenuItem>
                {props.roles.map(currentRole => {
                  return (
                    <MenuItem key={currentRole.id} value={currentRole.id}>{currentRole.name}</MenuItem>
                  )
                })
                }
              </CustomTextField>
            )}
          />

        </Box>

        <CommonButton loading={updating} label={props.user ? 'Update' : 'Send Invite'} onClick={handleSubmit(onSubmit)} />

      </form>
    </Drawer>
  )
}

export default AddUserDrawer
