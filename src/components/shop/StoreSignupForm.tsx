'use client'

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Divider, IconButton, InputAdornment, Typography } from '@mui/material'
import clsx from 'clsx'
import {  useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'

import CustomTextField from '@/@core/components/mui/TextField'
import { commonSchemas } from '@/schemas/common.schemas'
import { utils } from '@/utils/utils'


type FormData = (typeof commonSchemas.storeSchema)['__outputType']


const DEFAULT_VALUE: FormData = {
  firstName:'',
  lastName:'',
  email:'',
  storeName: '',
  password: '',
  confirmPassword:'',
}

const StoreSignupForm = () => {

  const [loading, setLoading] = useState(false)
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isCPasswordShown, setCIsPasswordShown] = useState(false)
 const handleClickShowPassword = () => setIsPasswordShown(show => !show)
   const handlecClickShowPassword = () => setCIsPasswordShown(show => !show)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.storeSchema),
    defaultValues: { ...DEFAULT_VALUE }
  })



  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
    console.log(data)
    } catch (error) {
      console.error(error)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form noValidate autoComplete='off' className='w-full'>
        <Box
          className='is-full'
          sx={{
            paddingBlock: '15px'
          }}
        >
          <Typography
            variant='h6'
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Register shop
          </Typography>
        </Box>

        <Divider className='is-full' />

        <Box
          sx={{
            paddingBlock: 5,
            display: 'flex',
            flexDirection: 'column',
            rowGap: 4
          }}
          className='is-full'
        >
          <Controller
            name='firstName'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  type='text'
                  label='First Name'
                  placeholder='Enter First name'
                  {...(errors.firstName && {
                    error: true,
                    helperText: utils.string.capitalize(errors.firstName.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )
            }}
          />
          <Controller
            name='lastName'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  type='text'
                  label='Last Name'
                  placeholder='Enter last name'
                  {...(errors.lastName && {
                    error: true,
                    helperText: utils.string.capitalize(errors.lastName.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )
            }}
          />

           <Controller
            name='storeName'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  type='text'
                  label='Store Name'
                  placeholder='Enter store name'
                  {...(errors.storeName && {
                    error: true,
                    helperText: utils.string.capitalize(errors.storeName.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )
            }}
          />

          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Email'
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

          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                variant='filled'
                label='Enter Password'
                sx={{
                  paddingInlineEnd: 0
                }}
                placeholder='Enter  password'
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={clsx(!isPasswordShown ? 'tabler-eye-off' : 'tabler-eye', '!text-[#28282866]')} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...(errors.password && {
                  error: true,
                  helperText: utils.string.capitalize(errors.password.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                variant='filled'
                label='Confirm Password'
                sx={{
                  paddingInlineEnd: 0
                }}
                placeholder='Enter password again'
                type={isCPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handlecClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={clsx(!isCPasswordShown ? 'tabler-eye-off' : 'tabler-eye', '!text-[#28282866]')} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...(errors.confirmPassword && {
                  error: true,
                  helperText: utils.string.capitalize(errors.confirmPassword.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

        </Box>
      </form>

      <div className='is-full flex flex-col space-y-2 webkit-bottom'>
        <CommonButton
          label="Register"
          size='small'
          fullWidth
          loading={loading}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
        />
      </div>
      </>
  )
}

export default StoreSignupForm
