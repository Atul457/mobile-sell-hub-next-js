// React Imports

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, IconButton, InputAdornment, MenuItem } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Third-party Imports
import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { useModal } from '@/contexts/ModalProvider'
import { commonSchemas } from '@/schemas/common.schemas'
import { ProfileService } from '@/services/client/Profile.service'
import { utils } from '@/utils/utils'

import CommonButton from '../common/CommonButton'
import CommonDialog from '../common/CommonDialog'
import Calendar from '../icons/Calendar'

type IFormData = (typeof commonSchemas.addProfile)['__outputType']

const CONST = utils.CONST

const USER_GENDERS = [
  { ...CONST.USER.OBJECT_GENDER_TYPES.MALE },
  { ...CONST.USER.OBJECT_GENDER_TYPES.FEMALE },
  {
    ...CONST.USER.OBJECT_GENDER_TYPES.TRANS
  }
]

const AddUserModal = () => {
  // States
  const [loading, setLoading] = useState(false)

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitted }
  } = useForm<IFormData>({
    resolver: yupResolver(commonSchemas.addProfile),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: null,
      phoneNumber_: null,
      dob: null,
      gender: 0
    }
  })

  const isSubmitted_ = isSubmitted

  // Hooks
  const modalContext = useModal()

  const profile = modalContext.modals.profile

  // Functions

  const handleClose = () => {
    modalContext.openModal({
      type: 'profiles',
      props: {
        visible: true,
        visibility: 'visible'
      }
    })
    modalContext.closeModal('profile')
  }

  const onSubmit: SubmitHandler<IFormData> = async (credentials: IFormData) => {
    setLoading(true)
    try {
      const ps = new ProfileService()
      const response = await ps.create(credentials)
      profile?.onAddProfile?.(response.data?.profile)
      utils.toast.success({ message: response.message! })
      handleClose()
    } catch (error: any) {
      setLoading(false)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  return (
    <CommonDialog open={true} onClose={handleClose}>
      <DialogTitle id='alert-dialog-title'>Add Examinee</DialogTitle>
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
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='email'
                label='Email'
                placeholder='Enter examinee email'
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
                placeholder='Enter examinee mobile number'
                {...(errors.phoneNumber && {
                  error: true,
                  helperText: errors.phoneNumber.message
                })}
              />
            )}
          />

          <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
            <Controller
              name='gender'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                  label='Gender'
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
                  {...(errors.gender && {
                    error: true,
                    helperText: utils.string.capitalize(errors.gender.message, {
                      capitalizeAll: false
                    })
                  })}
                >
                  <MenuItem key='select-user-type' value={0} color='customColors.textGray40' disabled>
                    Gender
                  </MenuItem>

                  {USER_GENDERS.map(type => {
                    return (
                      <MenuItem key={type.LABEL} value={type.VALUE}>
                        {type.LABEL}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              )}
            />

            <Controller
              name='dob'
              control={control}
              render={({ field }) => (
                <Box className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'>
                  <AppReactDatepicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    placeholderText='Select'
                    maxDate={new Date()}
                    popperPlacement='bottom-start'
                    customInput={
                      <CustomTextField
                        label='Date of Birth'
                        fullWidth
                        {...field}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={() => {}} onMouseDown={e => e.preventDefault()}>
                                <Calendar />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        {...(errors.dob && {
                          error: true,
                          helperText: utils.string.capitalize(errors.dob.message, {
                            capitalizeAll: false
                          })
                        })}
                      />
                    }
                  />
                </Box>
              )}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <CommonButton
          type='button'
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          label='Done'
        />
      </DialogActions>
    </CommonDialog>
  )
}

export default AddUserModal
