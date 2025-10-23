'use client'

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Divider, Drawer, MenuItem, Typography } from '@mui/material'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'

import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { ICategory } from '@/models/category.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { CategoryService } from '@/services/client/Category.service'
import { utils } from '@/utils/utils'

type ICategoryProps = {
  create: boolean
  onCreate: Function
  onUpdate: Function
  onClose: Function
  category: ICategory | null
}

type FormData = (typeof commonSchemas.addCategory)['__outputType']

const { NUMERIC_STATUS, STATUS } = utils.CONST.CATEGORY

const DEFAULT_VALUE: FormData = {
  name: '',
  description: '',
  status: STATUS.ACTIVE
}

const CategoryDrawer = (props: ICategoryProps) => {
  const { category, create } = props

  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.addCategory),
    defaultValues: { ...DEFAULT_VALUE }
  })

  useEffect(() => {
    if (props.category) {
      reset({
        ...props.category
      })
    } else {
      reset({ ...DEFAULT_VALUE })
    }
  }, [props.category, create])

  const onClose = () => {
    props.onClose()
  }

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      if (!category && !props.create) throw utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG

      setLoading(true)

      let response = utils.generateRes({ status: true })

      const ps = new CategoryService()
      if (category?._id) {
        response = await ps.update(category?._id as string, data)
        props.onUpdate(response.data?.category)
      } else {
        response = await ps.create(data)
        props.onCreate(response.data?.category)
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
      open={Boolean(props.category || props.create)}
      onClose={onClose}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true
      }}
      className={classNames('block', { static: !props.category, absolute: Boolean(props.category || props.create) })}
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
            {props.create ? 'Create' : 'Update'} Category
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
        <CommonButton
          label={create ? 'Create' : 'Update'}
          fullWidth
          loading={loading}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </Drawer>
  )
}

export default CategoryDrawer
