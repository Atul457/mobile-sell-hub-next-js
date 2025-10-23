'use client'

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Divider, Drawer, InputAdornment, MenuItem, Typography } from '@mui/material'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'

import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { IPackagePopulated } from '@/models/package.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { PackageService } from '@/services/client/Package.service'
import { utils } from '@/utils/utils'

type IPackageProps = {
  create: boolean
  onCreate: Function
  onUpdate: Function
  onClose: Function
  package_: IPackagePopulated | null
}

type FormData = (typeof commonSchemas.addPackage)['__outputType']

const { NUMERIC_STATUS, STATUS } = utils.CONST.PACKAGE
const { NUMERIC_BOOLEAN_STATUS, BOOLEAN_STATUS } = utils.CONST.APP_CONST

const DEFAULT_VALUE: FormData = {
  name: '',
  price: 0,
  identifier: '',
  description: '',
  status: STATUS.ACTIVE,
  isDefault: 0,
  withChainOfCustody: 0
}

const PackageDrawer = (props: IPackageProps) => {
  const { package_, create } = props

  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.addPackage),
    defaultValues: { ...DEFAULT_VALUE }
  })

  useEffect(() => {
    if (props.package_) {
      reset({
        ...props.package_,
        isDefault: props.package_.isDefault ? 1 : 0,
        withChainOfCustody: props.package_.withChainOfCustody ? 1 : 0
      })
    } else {
      reset({ ...DEFAULT_VALUE })
    }
  }, [props.package_, create])

  const onClose = () => {
    props.onClose()
  }

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      if (!package_ && !props.create) throw utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG

      setLoading(true)

      let response = utils.generateRes({ status: true })

      const ps = new PackageService()
      if (package_?._id) {
        response = await ps.update(package_?._id as string, data)
        props.onUpdate(response.data?.package)
      } else {
        response = await ps.create(data)
        props.onCreate(response.data?.package)
      }

      utils.toast.success({ message: response.message! })
      onClose()
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
    <Drawer
      anchor='right'
      open={Boolean(props.package_ || props.create)}
      onClose={onClose}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true
      }}
      className={classNames('block', { static: !props.package_, absolute: Boolean(props.package_ || props.create) })}
      PaperProps={{
        className: classNames('is-[400px] shadow-none rounded-s-[6px]', {
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
      <form noValidate autoComplete='off' className='w-full'>
        <Box
          className='is-full'
          sx={{
            paddingInline: 6,
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
            {props.create ? 'Create' : 'Update'} Package
          </Typography>
        </Box>

        <Divider className='is-full' />

        <Box
          sx={{
            paddingInline: 6,
            paddingBlock: 5,
            display: 'flex',
            flexDirection: 'column',
            rowGap: 4
          }}
          className='is-full'
        >
          <Controller
            name='name'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  type='text'
                  label='Name'
                  placeholder='Enter name'
                  {...(errors.name && {
                    error: true,
                    helperText: utils.string.capitalize(errors.name.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )
            }}
          />

          <Controller
            name='identifier'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  type='text'
                  placeholder='Enter identifier'
                  label='Identifier'
                  {...(errors.identifier && {
                    error: true,
                    helperText: utils.string.capitalize(errors.identifier.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )
            }}
          />

          <Controller
            name='price'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...{
                    ...field,
                    onChange: e => {
                      e.target.value = utils.dom.onNumberTypeFieldChangeWithoutE(e.target.value, {
                        min: 0,
                        dontReturnBlank: true
                      })
                      field.onChange(e)
                    }
                  }}
                  InputProps={{
                    className: 'price-input',
                    sx: {
                      paddingLeft: 0
                    },
                    startAdornment: (
                      <InputAdornment
                        position='end'
                        sx={{
                          paddingRight: '0 !important',
                          color: 'primary.main'
                        }}
                      >
                        <Typography variant='body2'>$</Typography>
                      </InputAdornment>
                    )
                  }}
                  type='text'
                  label='Price'
                  placeholder='Enter price'
                  {...(errors.price && {
                    error: true,
                    helperText: utils.string.capitalize(errors.price.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )
            }}
          />

          <Controller
            name='withChainOfCustody'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  select
                  type='select'
                  defaultValue={-1}
                  SelectProps={{
                    MenuProps: themeConfig.components.select.MenuProps,
                    multiple: false,
                    onChange: e => {
                      field.onChange(e)
                    }
                  }}
                  label='Include Chain Of Custody'
                  sx={{ paddingInlineEnd: 0, width: '100%' }}
                  {...(errors.status && {
                    error: true,
                    helperText: utils.string.capitalize(errors.status.message, {
                      capitalizeAll: false
                    })
                  })}
                >
                  <MenuItem value={BOOLEAN_STATUS.YES}>{NUMERIC_BOOLEAN_STATUS[BOOLEAN_STATUS.YES]}</MenuItem>
                  <MenuItem value={BOOLEAN_STATUS.NO}>{NUMERIC_BOOLEAN_STATUS[BOOLEAN_STATUS.NO]}</MenuItem>
                </CustomTextField>
              )
            }}
          />

          <Controller
            name='isDefault'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  select
                  type='select'
                  defaultValue={-1}
                  SelectProps={{
                    MenuProps: themeConfig.components.select.MenuProps,
                    multiple: false,
                    onChange: e => {
                      field.onChange(e)
                    }
                  }}
                  label='Default'
                  sx={{ paddingInlineEnd: 0, width: '100%' }}
                  {...(errors.isDefault && {
                    error: true,
                    helperText: utils.string.capitalize(errors.isDefault.message, {
                      capitalizeAll: false
                    })
                  })}
                >
                  <MenuItem value={BOOLEAN_STATUS.YES}>{NUMERIC_BOOLEAN_STATUS[BOOLEAN_STATUS.YES]}</MenuItem>
                  <MenuItem value={BOOLEAN_STATUS.NO}>{NUMERIC_BOOLEAN_STATUS[BOOLEAN_STATUS.NO]}</MenuItem>
                </CustomTextField>
              )
            }}
          />

          <Controller
            name='description'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  fullWidth
                  rows={4}
                  type='textarea'
                  multiline
                  label='Description'
                  placeholder='Enter description'
                  sx={{ mb: 4 }}
                  {...(errors.description && {
                    error: true,
                    helperText: utils.string.capitalize(errors.description.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )
            }}
          />

          <Controller
            name='status'
            control={control}
            render={({ field }) => {
              return (
                <CustomTextField
                  {...field}
                  select
                  type='select'
                  defaultValue={-1}
                  SelectProps={{
                    MenuProps: themeConfig.components.select.MenuProps,
                    multiple: false,
                    onChange: e => {
                      field.onChange(e)
                    }
                  }}
                  label='Status'
                  sx={{ paddingInlineEnd: 0, width: '100%' }}
                  {...(errors.status && {
                    error: true,
                    helperText: utils.string.capitalize(errors.status.message, {
                      capitalizeAll: false
                    })
                  })}
                >
                  <MenuItem value={STATUS.ACTIVE}>{NUMERIC_STATUS[STATUS.ACTIVE]}</MenuItem>
                  <MenuItem value={STATUS.INACTIVE}>{NUMERIC_STATUS[STATUS.INACTIVE]}</MenuItem>
                </CustomTextField>
              )
            }}
          />
        </Box>
      </form>

      <div className='is-full p-6 flex flex-col space-y-2 webkit-bottom'>
        <CommonButton label='Update' fullWidth loading={loading} variant='contained' onClick={handleSubmit(onSubmit)} />
      </div>
    </Drawer>
  )
}

export default PackageDrawer
