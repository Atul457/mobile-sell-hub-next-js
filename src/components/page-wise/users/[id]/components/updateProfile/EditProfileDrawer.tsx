'use client'

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Divider, Drawer, IconButton, InputAdornment, Typography } from '@mui/material'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import Autocomplete from 'react-google-autocomplete'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'

import CustomTextField from '@/@core/components/mui/TextField'
import { IUser } from '@/models/user.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { UsersService } from '@/services/client/Users.service'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { utils } from '@/utils/utils'

type IUsers = {
  onUpdate: Function
  onClose: Function
  users: IUser | null
}

type FormData = (typeof commonSchemas.updateProfileSchemaWithType)['__outputType']

const USER_TYPES = utils.CONST.USER.TYPES
const DEFAULT_VALUE = {
  type: USER_TYPES.INDIVIDUAL,
  firstName: '',
  organizationName: '',
  lastName: '',
  address: '',
  phoneNumber: '',
  phoneNumber_: '',
  addressMeta: utils.helpers.user.formatAddress()
}

const EditProfileDrawer = (props: IUsers) => {
  const [updating, setUpdating] = useState(false)
  const user = props.users

  const onClose = () => {
    props.onClose()
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.updateProfileSchemaWithType),
    defaultValues: { ...DEFAULT_VALUE }
  })
  const isSubmitted_ = isSubmitted
  const coporateAccount = [USER_TYPES.GOVT_ORGANISATION, USER_TYPES.CORPORATE_EMPLOYER].includes(
    watch('type') as IUser['type']
  )
  useEffect(() => {
    if (!user) {
      return
    }

    reset({
      ...DEFAULT_VALUE,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.type,
      address: user.address ?? '',
      addressMeta: (user.addressMeta && user.address
        ? utils.helpers.user.formatAddress(user.addressMeta)
        : null) as IUser['addressMeta'],
      phoneNumber: user.phoneNumber ?? '',
      phoneNumber_: user.phoneNumber ?? '',
      organizationName: user.organizationName ?? ''
    })
  }, [user?._id])

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      if (!user) {
        throw ErrorHandlingService.notFound({
          message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'User')
        })
      }

      setUpdating(true)
      delete data.phoneNumber_
      const usersService = new UsersService()
      const response = await usersService.updateProfile(user.id, {
        ...data,
        addressMeta: data.address ? data.addressMeta : null
      })

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

  const onPlaceSelected = (data: google.maps.places.PlaceResult) => {
    const extractionResult = utils.helpers.extractAddressDetails(data)
    const formattedAddress = utils.helpers.user.formatAddress({
      ...extractionResult,
      city: extractionResult.city ?? '',
      zipCode: extractionResult.postal_code ?? '',
      state: extractionResult.administrative_area_level_2 ?? ''
    })
    setValue('addressMeta', (data.formatted_address ?? null ? formattedAddress : null) as any)
    setValue('address', data.formatted_address ?? '', {
      shouldValidate: isSubmitted_
    })
  }

  const clearInputField = () => {
    setValue('address', '')
    setValue('addressMeta', null as any, {
      shouldValidate: isSubmitted_
    })
  }


  return (
    <Drawer
      anchor='right'
      open={Boolean(props.users)}
      onClose={onClose}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true
      }}
      className={classNames('block', { static: !props.users, absolute: Boolean(props.users) })}
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
            Update Profile
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
          <CustomTextField fullWidth label='Email' disabled={true} value={user?.email} placeholder='Enter your email' />

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

          {[USER_TYPES.GOVT_ORGANISATION, USER_TYPES.CORPORATE_EMPLOYER].includes(watch('type') as IUser['type']) ? (
            <>
              <Controller
                name='organizationName'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Organization'
                    placeholder='Enter your organization name'
                    {...(errors.organizationName && {
                      error: true,
                      helperText: utils.string.capitalize(errors.organizationName.message, {
                        capitalizeAll: false
                      })
                    })}
                  />
                )}
              />
            </>
          ) : null}

          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                // className='pac-conatiner pac-logo'
                InputProps={{
                  inputComponent: Autocomplete,
                  inputProps: {
                    apiKey: 'AIzaSyAEL_XNWS1BWGXfvpUeKU11PBZ0jl1z2tc',
                    ...field,
                    onPlaceSelected,
                    options: {
                      types: ['address'],
                      fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
                    }
                  },
                  endAdornment: !watch('address') ? undefined : (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={clearInputField} onMouseDown={e => e.preventDefault()}>
                        <i className='tabler-x !text-[#28282866]' />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                label={`${coporateAccount ? 'Company' : 'Home'} Address`}
                placeholder={`Enter your ${coporateAccount ? 'company' : 'home'} address`}
                {...(errors.address && {
                  error: true,
                  helperText: utils.string.capitalize(errors.address.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

          {watch('address') && (
            <>
              <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
                <Controller
                  name='addressMeta.appartment'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      InputProps={{
                        inputProps: {
                          ...field,
                          onPlaceSelected,
                          options: {
                            types: ['address'],
                            fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
                          }
                        }
                      }}
                      label='Suite, Apartment, Unit'
                      placeholder='Enter Suite, Apartment, Unit'
                      className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                      {...(errors.addressMeta?.appartment && {
                        error: true,
                        helperText: utils.string.capitalize(errors.addressMeta.appartment.message, {
                          capitalizeAll: false
                        })
                      })}
                    />
                  )}
                />

                <Controller
                  name='addressMeta.city'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      InputProps={{
                        inputProps: {
                          ...field,
                          onPlaceSelected,
                          options: {
                            types: ['address'],
                            fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
                          }
                        }
                      }}
                      label='City'
                      placeholder='Enter City'
                      className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                      {...(errors.addressMeta?.city && {
                        error: true,
                        helperText: utils.string.capitalize(errors.addressMeta.city.message, {
                          capitalizeAll: false
                        })
                      })}
                    />
                  )}
                />
              </Box>
              <Box display='flex' flexWrap='wrap' justifyContent='space-between'>
                <Controller
                  name='addressMeta.state'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      InputProps={{
                        // inputComponent: Autocomplete,
                        inputProps: {
                          ...field,
                          onPlaceSelected,
                          options: {
                            types: ['address'],
                            fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
                          }
                        }
                      }}
                      label='State'
                      placeholder='Enter State'
                      className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                      {...(errors.addressMeta?.state && {
                        error: true,
                        helperText: utils.string.capitalize(errors.addressMeta.state.message, {
                          capitalizeAll: false
                        })
                      })}
                    />
                  )}
                />

                <Controller
                  name='addressMeta.zipCode'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      InputProps={{
                        inputProps: {
                          ...field,
                          onPlaceSelected,
                          options: {
                            types: ['address'],
                            fields: ['address_components', 'geometry.location', 'place_id', 'formatted_address']
                          }
                        }
                      }}
                      label='Zip Code'
                      placeholder='Enter Zip Code'
                      className='max-lg:w-[calc(50%-6px)] lg:w-[calc(50%-8px)]'
                      {...(errors.addressMeta?.zipCode && {
                        error: true,
                        helperText: utils.string.capitalize(errors.addressMeta.zipCode.message, {
                          capitalizeAll: false
                        })
                      })}
                    />
                  )}
                />
              </Box>
            </>
          )}

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

          {/* <CustomTextField
            fullWidth
            variant='filled'
            label='Password'
            sx={{
              paddingInlineEnd: 0
            }}
            placeholder='Enter your password'
            type='password'
            value='000000000'
          /> */}
        </Box>

        <CommonButton loading={updating} label='Update' onClick={handleSubmit(onSubmit)} />

        {/* <AuthFooter>
          <CommonButton loading={updating} label='Update' />
          <Box justifyContent='center' display='flex'>
            <Typography
              // color='hyperlink.main'
              color='red'
              variant='inherit'
              fontWeight={600}
              onClick={() => deleteAccountButtonClick()}
              sx={{
                cursor: 'pointer'
              }}
            >
              Delete Account
            </Typography>
          </Box>
        </AuthFooter> */}
      </form>
    </Drawer>
  )
}

export default EditProfileDrawer
