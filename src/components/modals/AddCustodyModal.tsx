import { yupResolver } from '@hookform/resolvers/yup'
import { Box, IconButton, InputAdornment } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import CustomTextField from '@/@core/components/mui/TextField'
import { useModal } from '@/contexts/ModalProvider'
import { commonSchemas } from '@/schemas/common.schemas'
import { ChainOfCustodyService } from '@/services/client/ChainOfCustody.service'
import { utils } from '@/utils/utils'

import CommonButton from '../common/CommonButton'
import CommonDialog from '../common/CommonDialog'
import Calendar from '../icons/Calendar'
import Clock from '../icons/Clock'

type FormData = (typeof commonSchemas.addCustody)['__outputType']

const AddCustodyModal = () => {
  const modalContext = useModal()

  const [loading, setLoading] = useState(false)

  const modal = modalContext.modals.addCustody
  const custodyData = modal?.custodyData

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.addCustody),
    defaultValues: {
      name: '',
      description: '',
      reportId: ''
    }
  })

  useEffect(() => {
    if (custodyData) {
      reset({
        ...custodyData
      })
    }
  }, [custodyData])

  useEffect(() => {
    if (modal?.reportId) {
      setValue('reportId', modal?.reportId)
    }
  }, [modal?.reportId])

  const handleClose = () => modalContext.closeModal('addCustody')

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setLoading(true)

    try {
      const cs = new ChainOfCustodyService()
      if (custodyData) {
        const response = await cs.update(custodyData._id, data)
        modal.update?.(response.data?.chainOfCustody)
        utils.toast.success({ message: response.message! })
        handleClose()
      } else {
        const response = await cs.create(data)
        modal?.push?.(response.data?.chainOfCustody)
        utils.toast.success({ message: response.message! })
        handleClose()
      }
    } catch (error: any) {
      setLoading(false)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  return (
    <CommonDialog open={true} onClose={handleClose} id='addCustodyModal'>
      <DialogTitle id='alert-dialog-title'>{modal?.editable ? 'Add' : 'View'}</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Name'
                placeholder='Enter your name'
                sx={{ mb: 4 }}
                InputProps={{
                  readOnly: true
                }}
                {...(errors.name && {
                  error: true,
                  helperText: utils.string.capitalize(errors.name.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 8, mb: 4 }}>
            <Controller
              name='date'
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <AppReactDatepicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date: Date | null) => field.onChange(date)}
                    placeholderText='Date'
                    popperPlacement='bottom-end'
                    customInput={
                      <CustomTextField
                        label='Date'
                        fullWidth
                        {...field}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={() => {}} onMouseDown={e => e.preventDefault()}>
                                <Calendar />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    }
                  />
                )
              }}
            />

            <Controller
              name='time'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AppReactDatepicker
                  showTimeSelect
                  selected={field.value ? new Date(field.value) : null}
                  timeIntervals={15}
                  showTimeSelectOnly
                  placeholderText='Time'
                  dateFormat='h:mm aa'
                  onChange={(date: Date | null) => field.onChange(date)}
                  customInput={
                    <CustomTextField
                      label='Time'
                      {...field}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => {}} onMouseDown={e => e.preventDefault()}>
                              <Clock />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  }
                />
              )}
            />
          </Box>

          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                rows={4}
                type='textarea'
                multiline
                label='Description'
                InputProps={{
                  readOnly: true
                }}
                placeholder='Write your description here'
                sx={{ mb: 4 }}
                {...(errors.name && {
                  error: true,
                  helperText: utils.string.capitalize(errors.name.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />
        </form>
      </DialogContent>
      {modal?.editable ? (
        <DialogActions className='dialog-actions-dense'>
          <CommonButton
            type='submit'
            variant='contained'
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            label='Done'
          />
        </DialogActions>
      ) : null}
    </CommonDialog>
  )
}

export default AddCustodyModal
