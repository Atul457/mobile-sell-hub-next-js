'use client'

// React Imports
// Config Imports
import themeConfig from '@configs/themeConfig'
// Type Imports
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
// Third-party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
// MUI Imports
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
// Next Imports
import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'

import { useModal } from '@/contexts/ModalProvider'
import { commonSchemas } from '@/schemas/common.schemas'
import { utils } from '@/utils/utils'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 490
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 490
  }
}))

const lightIllustration = '/images/blank/Alt Front Image Masked.png'

type FormData = (typeof commonSchemas.login)['__outputType']

const Login = () => {
  const params = useSearchParams()

  // States
  const [loading, setLoading] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [token] = useState(params.get('token') ?? null)
  const [invitationToken] = useState(params.get('invitation-token') ?? null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.login),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Hooks
  const modalContext = useModal()

  useEffect(() => {
    const token_ = token ?? invitationToken
    if (token_) {
      setTimeout(() => {
        modalContext.openModal({
          type: 'resetPassword',
          props: {
            visible: true,
            token: token_,
            isInvitationToken: !!invitationToken
          }
        })
      }, 0)
    }
  }, [token])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (credentials: FormData) => {
    setLoading(true)
    try {
      const data = await signIn('credentials', {
        data: JSON.stringify(credentials),
        type: 'login',
        redirect: false
      })

      if (data?.error) {
        utils.toast.error({ message: utils.error.getMessage(data?.error) })
        setLoading(false)
      } else {
        window.location.href = '/portal'
      }
    } catch (error: any) {
      utils.toast.error({ message: utils.error.getMessage(error) })
      setLoading(false)
      console.error(error)
    }
  }

  const onForgotPasswordClick = () => {
    modalContext.openModal({
      type: 'forgotPassword',
      props: {
        visible: true
      }
    })
  }

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex bs-full items-center justify-center flex-1 bg-custom-gradient min-bs-[calc(100dvh-48px)] relative p-6 max-md:hidden'>
        <LoginIllustration src={lightIllustration} alt='character-illustration' />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!`}</Typography>
          </div>
          <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
                  label='Password'
                  sx={{
                    paddingInlineEnd: 0
                  }}
                  placeholder='Enter your password'
                  type={isPasswordShown ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i
                            className={clsx(!isPasswordShown ? 'tabler-eye-off' : 'tabler-eye', '!text-[#28282866]')}
                          />
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

            <Box justifyContent='flex-end' display='flex'>
              <Typography
                className='cursor-pointer custom-link primary'
                onClick={() => onForgotPasswordClick()}
                fontSize={12}
                textAlign='right'
                component='div'
                color='primary.main'
                fontWeight={600}
              >
                Forgot Password?
              </Typography>
            </Box>

            <CommonButton loading={loading} label='Sign In' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
