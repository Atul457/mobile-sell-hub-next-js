'use client'

// MUI Imports
import { Box, Divider, Drawer, MenuItem, Typography } from '@mui/material'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

// Hook Imports
import CommonButton from '@/components/common/CommonButton'

import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { IReportPopulated } from '@/models/report.model'
import { ReportService } from '@/services/client/Report.service'
import { utils } from '@/utils/utils'

type IQrProps = {
  onUpdate: Function
  onClose: Function
  report: IReportPopulated | null
}

const { NUMERIC_STATUS, STATUS } = utils.CONST.REPORT

const ReportDrawer = (props: IQrProps) => {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<IReportPopulated | null>(null)
  const [reportStatus, setReportStatus] = useState<IReportPopulated['status']>(0)
  const [rejectionReason, setRejectionReason] = useState<IReportPopulated['rejectionReason']>('')

  useEffect(() => {
    if (props.report?._id) {
      setReport(props.report)
      setReportStatus(props.report.status)
      setRejectionReason(props.report.rejectionReason ?? '')
    } else {
      setReport(null)
    }
  }, [props.report?._id])

  const onClose = () => {
    props.onClose()
  }

  const onStatusChange = (status: IReportPopulated['status']) => {
    setReportStatus(status)
    if (status === STATUS.REJECTED) {
      setRejectionReason('')
    }
  }

  const handleSubmit = async () => {
    try {
      if (!report) throw utils.CONST.RESPONSE_MESSAGES.SOMETHING_WENT_WRONG

      setLoading(true)

      const rs = new ReportService()
      const response = await rs.update(report?._id as string, {
        status: reportStatus,
        rejectionReason: reportStatus === STATUS.REJECTED ? rejectionReason : null
      })

      props.onUpdate(response.data?.report)

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
      open={Boolean(props.report)}
      onClose={onClose}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true
      }}
      className={classNames('block', { static: !props.report, absolute: Boolean(props.report) })}
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
            Update Status
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
          <CustomTextField
            select
            type='select'
            SelectProps={{
              MenuProps: themeConfig.components.select.MenuProps,
              multiple: false
            }}
            label='Status'
            sx={{ paddingInlineEnd: 0, width: '100%' }}
            value={reportStatus}
            onChange={e => onStatusChange(Number(e.target.value) as IReportPopulated['status'])}
          >
            <MenuItem value={STATUS.PENDING}>{NUMERIC_STATUS[STATUS.PENDING]}</MenuItem>
            <MenuItem value={STATUS.SUBMITTED}>{NUMERIC_STATUS[STATUS.SUBMITTED]}</MenuItem>
            <MenuItem value={STATUS.REJECTED}>{NUMERIC_STATUS[STATUS.REJECTED]}</MenuItem>
          </CustomTextField>

          {reportStatus === STATUS.REJECTED && (
            <CustomTextField
              label='Rejection Reason'
              sx={{ paddingInlineEnd: 0, width: '100%' }}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
          )}
        </Box>
      </form>

      <div className='is-full p-6 flex flex-col space-y-2 webkit-bottom'>
        <CommonButton label='Update' fullWidth loading={loading} variant='contained' onClick={handleSubmit} />
      </div>
    </Drawer>
  )
}

export default ReportDrawer
