import { Box } from '@mui/material'
// import { pdf } from '@react-pdf/renderer'
// import { saveAs } from 'file-saver'
import { ReactNode } from 'react'

// import { HL7Message } from 'simple-hl7'
import CommonButton from '@/components/common/CommonButton'
import CommonEntityContainer from '@/components/common/CommonEntityContainer'
import CommonNotFound from '@/components/common/CommonNotFound'
import EmptyChainOfCustody from '@/components/icons/EmptyChainOfCustody'

// import { DocumentPdf } from '@/components/page-wise/pdf/Pdf'
import { IChainOfCustody } from '@/models/custody.model'
import { IReport } from '@/models/report.model'
import { utils } from '@/utils/utils'

import EditIcon from './EditIcon'
import ReportStatusCard from './ReportStatusCard'
import { ICustomReport } from '../Report'

type Props = {
  data?: IChainOfCustody[]
  isFaded?: boolean
  status?: IReport['status']
  downloading?: boolean
  reportId?: string
  report?: ICustomReport
  setReport?: Function
  onDownloadClick?: Function
}

const NUMERIC_STATUS = utils.CONST.REPORT.NUMERIC_STATUS
const OBJECT_STATUSES = utils.CONST.REPORT.OBJECT_STATUSES
const STATUS = utils.CONST.REPORT.STATUS

const statuses = [
  {
    status: NUMERIC_STATUS[OBJECT_STATUSES.REJECTED.VALUE],
    value: OBJECT_STATUSES.REJECTED.VALUE,
    description: OBJECT_STATUSES.REJECTED.DESCRIPTION
  },
  {
    status: NUMERIC_STATUS[OBJECT_STATUSES.CHECKED.VALUE],
    value: OBJECT_STATUSES.CHECKED.VALUE,
    description: OBJECT_STATUSES.CHECKED.DESCRIPTION
  },
  {
    status: NUMERIC_STATUS[OBJECT_STATUSES.SUBMITTED.VALUE],
    value: OBJECT_STATUSES.SUBMITTED.VALUE,
    description: OBJECT_STATUSES.SUBMITTED.DESCRIPTION
  },
  {
    status: NUMERIC_STATUS[OBJECT_STATUSES.PENDING.VALUE],
    value: OBJECT_STATUSES.PENDING.VALUE,
    description: OBJECT_STATUSES.PENDING.DESCRIPTION
  }
]

const ReportDetailCard = (props: Props) => {
  // const [downloading, setDownloading] = useState(false)
  // const [report, _] = useState<ICustomReport | null>(null)
  let status_: string | null = null
  let description: string | null | undefined | ReactNode = null
  const updationDates = props.report?.updationDates ?? []

  const chainOfCustody = typeof props.status !== 'number'
  const reportStatus = props.status ?? OBJECT_STATUSES.DRAFT.VALUE

  // const onDownloadReportClick = async () => {
  //   if (downloading) {
  //     return
  //   }

  //   if (!report?.hl7Message) {
  //     return utils.toast.error({
  //       message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Report')
  //     })
  //   }

  //   let hl7Message = report?.hl7Message as HL7Message

  //   try {
  //     setDownloading(true)
  //     const blob = await pdf(
  //       <DocumentPdf
  //         message={hl7Message}
  //         reportId={report.identifier}
  //         collectedDate={report.updationDates[1]}
  //         profile={report.profile}
  //       />
  //     ).toBlob()
  //     saveAs(blob, `${report?.identifier ?? 'document'}.pdf`)
  //     utils.toast.success({
  //       message: 'Downloaded'
  //     })
  //   } catch (error) {
  //     utils.toast.success({
  //       message: utils.error.getMessage(error)
  //     })
  //   } finally {
  //     setDownloading(false)
  //   }
  // }

  return (
    <CommonEntityContainer
      title={
        chainOfCustody ? (
          'Chain of Custody'
        ) : (
          <>
            Status
            {props.report && props.setReport ? <EditIcon report={props.report} setReport={props.setReport} /> : null}
          </>
        )
      }
    >
      <Box
        className='space-y-6 border-container'
        sx={{ paddingLeft: props?.data?.length || !chainOfCustody ? '25px' : 0 }}
      >
        {!chainOfCustody ? (
          statuses.map((status, index) => {
            if (
              status.value > reportStatus ||
              (reportStatus === STATUS.REJECTED && [STATUS.REJECTED, STATUS.CHECKED].includes(status.value))
            )
              return null

            status_ = status.status
            description = status.description

            if (status.value === STATUS.REJECTED) {
              description = props.report?.rejectionReason
            } else if (status.value === STATUS.CHECKED) {
              description = (
                <>
                  {status.description}
                  <Box
                    sx={{
                      marginBlockStart: 2
                    }}
                  >
                    <CommonButton
                      loading={props.downloading}
                      disabled={props.downloading}
                      // onClick={onDownloadReportClick}
                      onClick={() => props.onDownloadClick?.()}
                      label='Download Report'
                      size='small'
                      sx={{
                        minWidth: '140px',
                        width: 'fit-content'
                      }}
                    />
                  </Box>
                </>
              )
            } else if (props.report?.status === STATUS.REJECTED && status.value === STATUS.SUBMITTED) {
              description = props.report?.rejectionReason ?? OBJECT_STATUSES.REJECTED.DESCRIPTION
              status_ = OBJECT_STATUSES.REJECTED.LABEL
            }

            return (
              <ReportStatusCard
                key={index}
                cursor={status.value === STATUS.CHECKED ? 'pointer' : 'default'}
                preventClick={status.value === STATUS.CHECKED}
                status={status_}
                date={updationDates?.[status.value]}
                complete={
                  reportStatus > status.value &&
                  !(reportStatus === STATUS.REJECTED && status.value === STATUS.SUBMITTED)
                }
                description={description}
              />
            )
          })
        ) : (
          <>
            {props?.data?.length ? (
              props?.data?.map((custody, index) => {
                return (
                  <ReportStatusCard
                    chainOfCustody={custody}
                    index={index}
                    key={custody?._id as string}
                    cursor='pointer'
                    reportId={custody.reportId as unknown as string}
                    complete={(props?.data?.length ?? 0) - index < (props?.data?.length ?? 0)}
                  />
                )
              })
            ) : (
              <CommonNotFound
                isModal={true}
                image={EmptyChainOfCustody}
                imageContainerProps={{
                  sx: {
                    minHeight: {
                      xs: 140,
                      lg: 200
                    },
                    maxWidth: {
                      lg: 240
                    }
                  }
                }}
                description='No chain of custody available yet'
              />
            )}
          </>
        )}
      </Box>
    </CommonEntityContainer>
  )
}

export default ReportDetailCard
