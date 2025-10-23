// React Imports

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, IconButton, InputAdornment, Typography } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import clsx from 'clsx'
import Papa from 'papaparse'
import { useRef, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { REPORT } from '@/constants/report.const'
import { useModal } from '@/contexts/ModalProvider'
import { IReport } from '@/models/report.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { ReportService } from '@/services/client/Report.service'
import FileValidatorService from '@/services/FileValidator.service'
import { utils } from '@/utils/utils'

import CommonButton from '../common/CommonButton'
import CommonDialog from '../common/CommonDialog'
import CommonTooltip from '../common/CommonTooltip'

type FormData = (typeof commonSchemas.generateReportQr)['__outputType']

const { OBJECT_STATUSES } = utils.CONST.REPORT

const ManageReportsModal = () => {
  const modalContext = useModal()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState(false)
  const [_, setConverting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const manageReports = modalContext.modals.manageReports

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.generateReportQr),
    defaultValues: {
      count: '' as unknown as number,
      qrs: []
    }
  })

  const generate = manageReports?.type === 'generate'

  const handleClose = () => modalContext.closeModal('manageReports')

  const onSubmit: SubmitHandler<FormData> = async (credentials: FormData) => {
    try {
      setLoading(true)
      const rs = new ReportService()
      const response = await rs.generateReportsQr(credentials)
      utils.toast.success({ message: response.message! })
      manageReports?.onGenerate?.()
      handleClose()
    } catch (error) {
      setLoading(false)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  const handleFileUpload = async (event: any) => {
    try {
      let file = event.target.files?.[0] ?? null
      event.target.value = ''

      const { MAX_FILE_SIZE, VALID_FILE_TYPES } = utils.CONST.QR

      if (!file) {
        return
      }

      const response = await FileValidatorService.validateFileData(
        { file },
        {
          maxFileSize: utils.file.convertValue(MAX_FILE_SIZE, 'MB', 'B'),
          validFileTypes: VALID_FILE_TYPES
        }
      )

      if (response.message) {
        utils.toast.info({ message: response.message })
        return
      }

      setConverting(true)

      // Inside the Papa.parse complete callback
      Papa.parse(file, {
        complete: (result: Papa.ParseResult<{ qrCode: string; status: string; reason?: string }>) => {
          let isValid = true
          let invalidQrsCount = 0
          const filteredData: { qrCode: string; status: IReport['status']; reason: IReport['rejectionReason'] }[] = []
          const requiredColumns = ['qrCode', 'status', 'reason']
          const actualColumns = Object.keys(result.data[0] || {})

          if (!requiredColumns.every(column => actualColumns.includes(column))) {
            return utils.toast.error({
              message: utils.CONST.RESPONSE_MESSAGES.CSV_MUST_CONTAIN_
            })
          }

          setSelectedFile(file)

          const lastElement = result.data[result.data.length - 1]

          if (lastElement.qrCode === '') {
            result.data.splice(result.data.length - 1, 1)
          }

          // Filter the data to include only required columns
          result.data.forEach(({ qrCode, status, reason }) => {
            isValid = Boolean(
              (qrCode?.trim().length &&
                /^[a-zA-Z0-9]{6}$/.test(qrCode) &&
                status.toLowerCase() === OBJECT_STATUSES.SUBMITTED.LABEL.toLocaleLowerCase()) ||
              status.toLowerCase() === OBJECT_STATUSES.REJECTED.LABEL.toLocaleLowerCase()
            )
            if (isValid) {
              const statusValue = REPORT.STATUS[status.toUpperCase() as keyof typeof REPORT.STATUS]
              filteredData.push({
                qrCode,
                status: statusValue,
                reason: reason ? reason : null
              }) // Add status field
            } else {
              invalidQrsCount++
            }
          })

          if (invalidQrsCount) {
            utils.toast.info({
              message: utils.CONST.RESPONSE_MESSAGES._SKIPPED_N_WITH_REASON
                .replace('[N]', invalidQrsCount.toString())
                .replace('[NOUN]', invalidQrsCount > 1 ? 'codes were' : 'code was')
            })
          }

          if (filteredData.length === 0) {
            setSelectedFile(null)
          }

          setValue('qrs', filteredData)
          setValue('count', filteredData.length, {
            shouldValidate: true
          })
        },
        header: true // Set to true if your CSV file has a header row
      })
    } catch (error) {
      console.error(error)
    } finally {
      setConverting(false)
    }
  }

  const onSelectFile = () => {
    setValue('count', 0)
    if (selectedFile) {
      setSelectedFile(null)
      return
    }
    if (fileInputRef?.current) {
      fileInputRef.current.click()
    }
  }

  const onDownloadDemoClick = () => {
    const link = document.createElement('a')
    let csv = utils.helpers.convertArrayOfObjectsToCSV([
      {
        qrCode: 'ABC123',
        status: 'submitted',
        reason: 'optional'
      },
      {
        qrCode: 'bBC123',
        status: 'rejected',
        reason: 'optional'
      }
    ])
    const filename = 'qrs-export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  return (
    <CommonDialog open={true} onClose={handleClose}>
      <DialogTitle>
        {generate ? (
          <>
            Generate Qrs Codes{' '}
            <CommonTooltip
              tooltipProps={{
                placement: 'top'
              }}
              description='Enter the desired quantity of QR codes. This number will determine the total number of codes to be generated'
            >
              <IconButton
                sx={{
                  color: 'primary.main'
                }}
              >
                <i className='tabler-info-circle' />
              </IconButton>
            </CommonTooltip>
          </>
        ) : (
          <>
            Import Qrs{' '}
            <CommonTooltip
              tooltipProps={{
                placement: 'top'
              }}
              description='The file to be imported must be in CSV format. The column containing the QR codes must have the header "qrCode","status" and "reason"'
            >
              <IconButton
                sx={{
                  color: 'primary.main'
                }}
              >
                <i className='tabler-info-circle' />
              </IconButton>
            </CommonTooltip>
          </>
        )}
      </DialogTitle>
      <DialogContent>
        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4 max-md:h-full'
        >
          {generate ? (
            <Controller
              name='count'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...{
                    ...field,
                    onChange: e => {
                      const value_ = utils.dom.onNumberTypeFieldChangeWithoutE(e.target.value)
                      e.target.value = value_
                      field.onChange(e)
                    }
                  }}
                  fullWidth
                  variant='filled'
                  label='Quantity'
                  sx={{
                    paddingInlineEnd: 0
                  }}
                  placeholder='Enter number of quantity'
                  type='text'
                  {...(errors.count && {
                    error: true,
                    helperText: utils.string.capitalize(errors.count.message, {
                      capitalizeAll: false
                    })
                  })}
                />
              )}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                rowGap: 4
              }}
            >
              <CustomTextField
                fullWidth
                variant='filled'
                label={null}
                value={selectedFile?.name || ''}
                placeholder='Select file'
                type='text'
                onClick={onSelectFile}
                sx={{
                  cursor: 'pointer'
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onMouseDown={e => e.preventDefault()}>
                        <i className={clsx(selectedFile ? 'tabler-x' : 'tabler-file-upload', 'text-[22px]')} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...(errors.count && {
                  error: true,
                  helperText: utils.string.capitalize(errors.count.message, {
                    capitalizeAll: false
                  })
                })}
              />

              <input
                id='file-input'
                type='file'
                ref={fileInputRef}
                accept='.csv, .xlsx'
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              <Typography
                variant='body2'
                onClick={onDownloadDemoClick}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: 'text.primary',
                  fontSize: theme => theme.typography.body2.fontSize,
                  display: 'flex',
                  fontWeight: 500,
                  alignItems: 'center'
                }}
              >
                Download Demo File
              </Typography>
            </Box>
          )}
        </form>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <CommonButton
          type='button'
          disabled={!watch('count')}
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          label={
            generate
              ? 'Generate'
              : watch('count')
                ? `Update ${watch('count')} Report${watch('count') ? 's' : ''}`
                : 'Update'
          }
        />
      </DialogActions>
    </CommonDialog>
  )
}

export default ManageReportsModal
