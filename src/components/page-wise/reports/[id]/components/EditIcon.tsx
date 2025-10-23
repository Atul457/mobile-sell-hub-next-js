import { IconButton } from '@mui/material'
import { useState } from 'react'

import { utils } from '@/utils/utils'

import ReportDrawer from './ReportDrawer'
import { ICustomReport } from '../Report'

type IEditReportIconProps = {
  report: ICustomReport
  setReport: Function
}

const STATUS = utils.CONST.REPORT.STATUS

const EditIcon = (props: IEditReportIconProps) => {
  const { report, setReport } = props
  const { status } = props.report

  const [showDrawer, setShowDrawer] = useState(false)

  const handleModal = (open = true) => {
    setShowDrawer(open)
    if (open) utils.dom.onModalOpen()
    else utils.dom.onModalClose()
  }

  const onReportStatusUpdate = ({ status, updationDates, rejectionReason }: ICustomReport) => {
    if (report) {
      setReport({
        ...report,
        status,
        rejectionReason,
        updationDates
      } as ICustomReport)
    }
  }

  if (status === STATUS.DRAFT || status === STATUS.CHECKED) return null

  return (
    <>
      <ReportDrawer
        report={showDrawer ? report : null}
        onClose={() => {
          handleModal(false)
        }}
        onUpdate={onReportStatusUpdate}
      />

      <IconButton
        sx={{
          padding: 0,
          '&:hover': {
            backgroundColor: 'transparent !important', // Remove hover background effect
            boxShadow: 'none !important' // Remove any shadow or effect on hover
          }
        }}
        disableFocusRipple={true}
        className='text-textPrimary'
        onClick={() => {
          handleModal()
        }}
      >
        <i className='tabler-edit text-lg cursor-pointer hover:text-[var(--mui-palette-hyperlink-main)]' />
      </IconButton>
    </>
  )
}

export default EditIcon
