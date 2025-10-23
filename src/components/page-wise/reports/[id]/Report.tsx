'use client'

import { Box, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { useCallback, useEffect, useState } from 'react'
import { HL7Message } from 'simple-hl7'

import CommonChip from '@/components/common/CommonChip'
import CommonEntityContainer from '@/components/common/CommonEntityContainer'
import CommonImage from '@/components/common/CommonImage'
import CommonKeyValueField from '@/components/common/CommonKeyValueField'
import CommonNotFound from '@/components/common/CommonNotFound'
import Loader from '@/components/Loader'
import UserPreview from '@/components/user/UserPreview'

import { IChainOfCustody } from '@/models/custody.model'
import { IFile } from '@/models/file.model'
import { IProfile } from '@/models/profile.model'
import { IReportPopulated } from '@/models/report.model'
// import { ITest } from '@/models/test.model'
import { IUser } from '@/models/user.model'
import { ReportService } from '@/services/client/Report.service'
import { utils } from '@/utils/utils'

import EditIcon from './components/EditIcon'
import ReportDetailCard from './components/ReportDetailCard'
import { DocumentPdf } from '../../pdf/Pdf'

type IReportProps = {
  id: string
  // package: IPackage | null
}

const { CONST } = utils
const NUMERIC_STATUS = CONST.REPORT.NUMERIC_STATUS
const { NUMERIC_ROLE_TYPES, NUMERIC_GENDER_TYPES } = CONST.USER

export type ICustomReport = IReportPopulated & {
  chainOfCustodyAdded: boolean
  chainOfCustodies: IChainOfCustody[]
  profile: IProfile & { createdAt: Date }
  video?: IFile & { createdAt: Date }
  createdAt: Date
  editable: boolean
}

const Report = (props: IReportProps) => {
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [report, setReport] = useState<ICustomReport | null>(null)
  const [getUrl, setGetUrl] = useState(false)

  const getReport = useCallback(async (reportId: string) => {
    setLoading(true)
    try {
      const rs = new ReportService()
      const response = await rs.get(reportId)
      setReport(response)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      utils.toast.error({ message: utils.error.getMessage(error) })
    }
  }, [])

  useEffect(() => {
    if (props.id) {
      getReport(props.id)
    }
  }, [props.id, getReport])

  const openVideo = async (file: IFile) => {
    if (file.filePath) {
      let url = `${utils.CONST.APP_CONST.CONFIG.STORAGE_PATH}${file.filePath}`
      if (utils.CONST.APP_CONST.isLocalStorageEnv) {
        window.open(`${utils.CONST.APP_CONST.CONFIG.STORAGE_PATH}${file.filePath}`, '_blank')
      } else {
        try {
          setGetUrl(true)
          const rs = new ReportService()
          const response = await rs.getVideoUrl(props.id)
          url = response
          setGetUrl(false)
        } catch (error) {
          setGetUrl(false)
          utils.toast.error({ message: utils.error.getMessage(error) })
        }
      }
      window.open(url, '_blank')
    }
  }

  const onDownloadReportClick = async () => {
    if (downloading) {
      return
    }
    if (!report?.hl7Message) {
      return utils.toast.error({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Report')
      })
    }

    let hl7Message = report?.hl7Message as HL7Message

    try {
      setDownloading(true)
      const blob = await pdf(
        <DocumentPdf
          message={hl7Message}
          reportId={report.identifier}
          collectedDate={report.updationDates[1]}
          profile={report.profile}
        />
      ).toBlob()
      saveAs(blob, `${report?.identifier ?? 'document'}.pdf`)
      utils.toast.success({
        message: 'Downloaded'
      })
    } catch (error) {
      console.error(error)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    } finally {
      setDownloading(false)
    }
  }

  if (loading)
    return (
      <Box className='min-h-[300px] flex items-center justify-center'>
        <Loader size='md' />
      </Box>
    )

  if (!report) {
    return (
      <Card>
        <CardContent>
          <CommonNotFound description='Report not found' withoutImage={true} />
        </CardContent>
      </Card>
    )
  }

  const reportInDraft = report.status === utils.CONST.REPORT.STATUS.DRAFT

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 4,
          columnGap: 2
        }}
      >
        <Link href='/reports'>
          {' '}
          <i className='tabler-arrow-left text-md mt-2' />
        </Link>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          Report Details
        </Typography>

        <CommonChip
          label={NUMERIC_STATUS[report.status]}
          variant={utils.helpers.report.getReportStatusVariant(report.status)}
        />

        <EditIcon report={report} setReport={setReport} />
        <Typography
          variant='body2'
          sx={{
            width: '100%',
            color: 'text.primary'
          }}
        >
          <span style={{ fontSize: '15px' }}>#{report.identifier}</span>
          <span style={{ marginLeft: '10px', fontSize: '13px' }}>
            {utils.date.formatDate((report as any).createdAt)}
          </span>
        </Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={reportInDraft ? 12 : 4} md={5}>
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: 6
              }}
            >
              {report.user ? (
                <CommonEntityContainer
                  title={`${NUMERIC_ROLE_TYPES[report.user.role as Exclude<IUser['role'], undefined>] ?? 'Individual'} Details`}
                >
                  <UserPreview type='profile' user={report.user} />

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: 1,
                      marginBlockStart: 2
                    }}
                  >
                    <CommonKeyValueField
                      key_='Phone Number'
                      value={utils.number.formatNumber(report.user.phoneNumber)?.toString()}
                    />

                    {utils.helpers.user.checkIsOrganiation(report.user.type) ? (
                      <CommonKeyValueField key_='Organization' value={report.user.organizationName} />
                    ) : null}
                  </Box>
                </CommonEntityContainer>
              ) : null}

              {report.profile ? (
                <CommonEntityContainer title='Examinee Details'>
                  <UserPreview type='profile' user={report.profile} />

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      rowGap: 1,
                      marginBlockStart: 2
                    }}
                  >
                    <CommonKeyValueField
                      key_='Phone Number'
                      value={utils.number.formatNumber(utils.helpers.getValue(report.profile?.phoneNumber))?.toString()}
                    />

                    <CommonKeyValueField
                      key_='Gender'
                      value={NUMERIC_GENDER_TYPES?.[report.profile.gender as Exclude<IProfile['gender'], undefined>]}
                    />

                    <CommonKeyValueField
                      key_='Date of Birth'
                      value={report.profile.dob ? utils.date.formatDate(report.profile.dob) : null}
                    />
                  </Box>
                </CommonEntityContainer>
              ) : null}

              <CommonEntityContainer
                title='Additional Information'
                contentProps={{
                  sx: {
                    rowGap: 2
                  }
                }}
              >
                {report.qr ? <CommonKeyValueField key_='Qr Code' value={report.qr.qrCode as string} /> : null}
                {report.transactionId && report.transaction ? (
                  <CommonKeyValueField
                    key_='Transaction'
                    value='View'
                    link={{
                      href: `/transactions?search=${report.transaction.transactionId}`
                    }}
                  />
                ) : null}

                {/* {report.video ?
                  <CommonButton label='view video' onClick={() => getUrl ? openVideo(report.video!) : undefined} /> :
                  null} */}

                {/* {report.video ? (
                  <CommonKeyValueField
                    key_='Video Uploaded'
                    value='View'
                    link={{
                      href: utils.helpers.getStoredEntityUrl(report.video?.filePath) ?? '#',
                      target: '_blank'
                    }}
                  />
                ) : null} */}

                <CommonKeyValueField
                  keyProps={{
                    marginBlockStart: 2
                  }}
                  key_='Package:'
                  withoutValue={true}
                />

                <CommonKeyValueField key_={report.qr?.package?.name} boldKey={false} withoutValue={true} />

                {/* {report.tests?.length ? (
                  report.tests.map(c => {
                    if (report.qr?.packageId?.withChainOfCustody && c.slug === "coc") {
                      return null
                    }
                    return <CommonKeyValueField key={c.name} key_={c.name} boldKey={false} withoutValue={true} />
                  })
                ) : (
                  null
                )} */}

                {/* {report.addOns?.length ? (
                  <Box
                    sx={{
                      marginBlockStart: 3
                    }}
                  >
                    <CommonKeyValueField key_='Add Ons:' withoutValue={true} />
                    {report.addOns.map(c => {
                      return (
                        <CommonKeyValueField
                          keyProps={{
                            sx: {
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }
                          }}
                          key={c.name}
                          key_={
                            <>
                              {c.name}
                              <span>${c.price}</span>
                            </>
                          }
                          boldKey={false}
                          withoutValue={true}
                        />
                      )
                    })}
                  </Box>
                )
                  : (
                    null
                  )} */}

                {report.transaction ? (
                  <Box
                    sx={{
                      marginBlockStart: 3
                    }}
                  >
                    <Divider
                      sx={{
                        marginBlock: 1
                      }}
                    />
                    <CommonKeyValueField
                      keyProps={{
                        sx: {
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }
                      }}
                      key_={
                        <>
                          Total
                          <span>${utils.helpers.getValue(report.transaction?.amountPaid)}</span>
                        </>
                      }
                      boldKey={false}
                      withoutValue={true}
                    />
                  </Box>
                ) : null}
              </CommonEntityContainer>



            </Box>
          </>
        </Grid>




        {!reportInDraft ? (
          <Grid item xs={12} lg={8} md={7}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: 6
              }}
            >
              {report.video ? (
                <Box
                  onClick={getUrl ? undefined : () => openVideo(report.video!)}
                  sx={{
                    cursor: getUrl ? 'progress' : 'pointer',
                  }}>
                  <CommonEntityContainer
                    title='Report Video'
                    containerProps={{
                      sx: {
                        width: {
                          xs: '100%',
                          lg: '40%'
                        },
                        display: 'flex',
                        alignItems: 'center'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                      <CommonImage className='w-[30px] h-auto mr-3' src='/images/icons/video.svg' width={50} height={60} />
                      <Typography
                        color='customColors.textGray100'
                        fontWeight={500}
                        variant='body1'
                        sx={{
                          fontSize: '15px'
                        }}
                      >
                        {report.video.fileName}
                      </Typography>

                      <Typography
                        color='customColors.textGray60'
                        variant='body1'
                        sx={{
                          fontSize: '12px'
                        }}
                      >
                        {utils.date.formatDate(report.video.createdAt, true)}
                      </Typography>
                    </Box>
                  </CommonEntityContainer>
                </Box>
              ) : null}
              <ReportDetailCard
                downloading={downloading}
                report={report}
                status={report.status}
                onDownloadClick={onDownloadReportClick} />

              {report?.chainOfCustodyAdded ? <ReportDetailCard data={report.chainOfCustodies} /> : null}
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </>
  )
}

export default Report
