// React Imports

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, IconButton, MenuItem } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useRef, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { useAppSelector } from '@/store/hooks/hooks'
import { userSelectors } from '@/store/slices/user/user.slice'

// Third-party Imports
import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { useModal } from '@/contexts/ModalProvider'
import { IUser } from '@/models/user.model'
import { IUserCreatorMapping } from '@/models/userCreatorMapping.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { UserCreatorMappingService } from '@/services/client/UserCreatorMapping.service'
import { IGenerateResFn } from '@/utils/generateRes'
import { utils } from '@/utils/utils'

import CommonButton from '../common/CommonButton'
import CommonDialog from '../common/CommonDialog'

type FormData = (typeof commonSchemas.addUser)['__outputType']

const CONST = utils.CONST

const USER_ROLE_TYPES = [{ ...CONST.USER.OBJECT_ROLE_TYPES.MANAGER }, { ...CONST.USER.OBJECT_ROLE_TYPES.STAFF }]

const USER_STATUSES = [{ ...CONST.USER.OBJECT_STATUSES.INACTIVE }, { ...CONST.USER.OBJECT_STATUSES.ACTIVE }]

const STAFF_ROLE = utils.CONST.USER.ROLES.STAFF!

const AddUserModal = () => {
  // States
  const deleted = useRef(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted }
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.addUser),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      phoneNumber_: '',
      // role: 0
    }
  })

  const isSubmitted_ = isSubmitted

  // Hooks
  const modalContext = useModal()
  const loggedInUser = useAppSelector(userSelectors.user)

  const addUser = modalContext.modals.addUser
  const editable = addUser?.editable
  const deletable = true

  const user = addUser?.user

  useEffect(() => {
    const user = addUser?.user?.user
    if (user) {
      reset({
        ...user,
        phoneNumber_: user.phoneNumber,
        status: user.status
      } as any)

    }
  }, [addUser?.user])

  // Functions

  const handleClose = () => modalContext.closeModal('addUser')

  const onSubmit: SubmitHandler<FormData> = async (credentials: FormData) => {
    setLoading(true)
    try {
      const ucms = new UserCreatorMappingService()
      let response: IGenerateResFn | null = null
      if (user) {
        response = await ucms.update(user._id as string, credentials)
        if (addUser?.update) {
          addUser.update(response.data?.user as IUserCreatorMapping & { user: IUser })
        }
      } else {
        response = await ucms.create(credentials)
        if (addUser?.push) {
          addUser.push(response.data?.user as IUserCreatorMapping & { user: IUser })
        }
      }
      utils.toast.success({ message: response.message! })
      handleClose()
    } catch (error: any) {
      setLoading(false)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  const onAlertClose = () => {
    if (deleted.current) {
      return true
    }
    modalContext.openModal({
      type: 'addUser',
      props: {
        ...addUser,
        visible: true,
        visibility: 'visible'
      }
    })
  }

  const onDeleteConfimation = async () => {
    try {
      const ucms = new UserCreatorMappingService()
      const response = await ucms.delete(user!._id as string)
      utils.toast.success({ message: response.message! })
      addUser?.delete?.()
      deleted.current = true
      handleClose()
    } catch (error) {
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  const onDeleteButtonClick = () => {
    modalContext.openModal({
      type: 'addUser',
      props: {
        update: addUser?.update,
        push: addUser?.push,
        editable,
        user: addUser?.user,
        visible: true,
        visibility: 'hidden'
      }
    })

    modalContext.openModal({
      type: 'alert',
      props: {
        heading: 'Alert',
        description:
          'Are you sure you want to delete your profile? If you proceed, you will lose access to all account data, including profile information, payment history etc. This action is permanent and cannot be undone.',
        onOkClick: onDeleteConfimation,
        onClose: onAlertClose,
        visible: true,
        status: 'idle',
        okButtonText: 'Yes'
      }
    })
  }

  return (
    <CommonDialog
      open={true}
      onClose={handleClose}
      sx={{
        visibility: addUser?.visibility
      }}
    >
      <DialogTitle id='alert-dialog-title' className='relative flex justify-center items-center'>
        {!user ? 'Add' : 'Update User Information'}
        {user && deletable ? (
          <IconButton
            onClick={onDeleteButtonClick}
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
              fontSize: theme => theme.typography.body0.fontSize,
              color: 'primary.main',
              right: {
                xs: 16,
                lg: 20
              }
            }}
          >
            <i className='tabler-trash' />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4 max-md:h-full'
        >
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
                  placeholder='Enter your first name'
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
                  placeholder='Enter your last name'
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
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Email'
                type='email'
                placeholder='Enter your email'
                disabled={!!user}
                {...(errors.email && {
                  error: true,
                  helperText: utils.string.capitalize(errors.email.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

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
            name='role'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                disabled={!editable}
                fullWidth
                label='Role'
                sx={{
                  paddingInlineEnd: 0
                }}
                select
                SelectProps={{
                  MenuProps: themeConfig.components.select.MenuProps,
                  multiple: false,
                  onChange: e => {
                    field.onChange(e)
                  }
                }}
                {...(errors.role && {
                  error: true,
                  helperText: utils.string.capitalize(errors.role.message, {
                    capitalizeAll: false
                  })
                })}
              >
                <MenuItem key='select-user-type' value={0} color='customColors.textGray40' disabled>
                  Select Role
                </MenuItem>

                {USER_ROLE_TYPES.map(type => {
                  // if (loggedInUser && loggedInUser!.role! >= type.VALUE! && !user) {
                  //     return null
                  // }

                  // if (loggedInUser && loggedInUser!.role! > type.VALUE!) {
                  //     return null
                  // }

                  return (
                    <MenuItem
                      key={type.LABEL}
                      value={type.VALUE}
                      disabled={!!(loggedInUser && loggedInUser!.role! > type.VALUE!)}
                    >
                      {type.LABEL}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
            )}
          />

          {user && user.user.status !== utils.CONST.USER.STATUS.PENDING ? (
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  defaultValue={-1}
                  disabled={!editable}
                  fullWidth
                  label='Status'
                  sx={{
                    paddingInlineEnd: 0
                  }}
                  select
                  SelectProps={{
                    MenuProps: themeConfig.components.select.MenuProps,
                    multiple: false,
                    onChange: e => {
                      field.onChange(e)
                    }
                  }}
                  {...(errors.status && {
                    error: true,
                    helperText: utils.string.capitalize(errors.status.message, {
                      capitalizeAll: false
                    })
                  })}
                >
                  <MenuItem key='select-user-type' value={-1} color='customColors.textGray40' disabled>
                    Select Status
                  </MenuItem>

                  {USER_STATUSES.map((type, index) => {
                    return (
                      <MenuItem
                        key={`type-${index}`}
                        value={type.VALUE}
                        disabled={(loggedInUser?.role ?? STAFF_ROLE) > user.user.role!}
                      >
                        {type.LABEL}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              )}
            />
          ) : null}
        </form>
      </DialogContent>
      {editable && (
        <DialogActions className='dialog-actions-dense'>
          <CommonButton
            type='button'
            variant='contained'
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            label={user ? 'Update' : 'Done'}
          />
        </DialogActions>
      )}
    </CommonDialog>
  )
}

export default AddUserModal
