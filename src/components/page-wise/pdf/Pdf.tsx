'use client'

import { Box } from '@mui/material'
import { Document, Font, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { PropsWithChildren, useEffect, useRef, useState } from 'react'
import type { HL7Message } from 'simple-hl7'

import CommonButton from '@/components/common/CommonButton'

import { IProfile } from '@/models/profile.model'
import { utils } from '@/utils/utils'

import hl7Mesage from './hl7Message.json'

type IPdfProps = {
  message: HL7Message | null
}

type IDocumentPdfProps = {
  message: HL7Message
  profile?: IProfile
  collectedDate?: Date
  reportId?: string
}

type IBaseType = {
  type: 'string' | 'number' | 'boolean' | 'date'
}

type IItem = {
  key: string
  value: any
} & IBaseType

type IGetResultsData = {
  data: (string | undefined)[]
  error?: boolean
  title?: string
  isLast?: boolean
}

type IGetResultsArgs = {
  title?: string
  subTitle?: string
  data?: IGetResultsData[]
  isLast?: boolean
  type?: 'final' | 'results'
  centerHeaderText?: boolean
}

type IGetResults = (args: IGetResultsArgs) => JSX.Element

type IGetResultsRowArgs = IGetResultsData & {
  bold?: boolean
  variant?: 'gray'
  removeCellBlockBorders?: boolean
  removeBorders?: boolean
  leftAlignFirst?: boolean
}

type IGetResultsRow = (args: IGetResultsRowArgs) => JSX.Element
type IReportDetails = {
  patientName: string
  patientDob: string
  labName: string
  labAddress: string
  labPhoneNumber: string
  labDirector: string
} | null

type IListInfoItemsOptions = {
  valueProps?: {
    style: Partial<{
      maxWidth: string
      textAlign: string
    }>
  }
  keyProps?: {
    style: Partial<{
      minWidth: string
      textAlign: string
    }>
  }
}

const infoItemOptions: IListInfoItemsOptions = {
  keyProps: {
    style: {
      minWidth: '70px',
      textAlign: 'left'
    }
  },
  valueProps: {
    style: {
      maxWidth: '100px',
      textAlign: 'left'
    }
  }
}

let baseHeadingArray = ['Analyte', 'Result(ng/mL)', 'Cutoff(ng/mL)', 'Comments']
let headingsArray = baseHeadingArray

// Create styles
export const DocumentPdf = (props: IDocumentPdfProps) => {
  let hl7Message_ = props?.message

  const [labInfo, setLabInfo] = useState<IItem[]>([])
  const [testInfo, setTestInfo] = useState<IItem[]>([])
  const [patientInfo, setPatientInfo] = useState<IItem[]>([])
  const [finalResults, setFinalResults] = useState<IGetResultsData[]>([])
  const [reportDetails, setReportDetails] = useState<IReportDetails>(null)

  const finalReport = useRef(false)

  useEffect(() => {
    finalReport.current = false
  }, [])

  useEffect(() => {
    const { getSegmentsFromHl7Message, getFieldValue, formatHl7Date, getObxSegments } = utils.helpers.report

    let reportedDate: string | null = null

    const clinicInfo = getSegmentsFromHl7Message(hl7Message_, 'ORC')
    const testInfo = getSegmentsFromHl7Message(hl7Message_, 'OBR')
    const labInfo = hl7Message_?.header?.fields ?? []
    const confirmationResults = getObxSegments(hl7Message_)

    const results = confirmationResults.reduce((acc, segment) => {
      // F stands for final
      if (getFieldValue(segment.fields[10]) === 'F') {
        if (reportedDate === null) {
          reportedDate = formatHl7Date(getFieldValue(segment.fields[13] ?? '-'))
        }

        acc.push({
          isLast: false,
          error: getFieldValue(segment.fields[7]) === 'Positive',
          data: [
            getFieldValue(segment.fields[2], {
              joinWith: ' - ',
              blocksToSkip: {
                start: 1
              }
            }),
            getFieldValue(segment.fields[7]),
            getFieldValue(segment.fields[4]),
            [getFieldValue(segment.fields[6]), getFieldValue(segment.fields[5])].join(' ')
          ]
        })
      }
      return acc
    }, [] as IGetResultsData[])

    setFinalResults(results)

    const { profile, collectedDate } = props

    const { patientName, patientDob, labName, labAddress, labPhoneNumber, labDirector, labCiaId } = {
      patientName: utils.helpers.user.getFullName({
        firstName: profile?.firstName ?? '',
        lastName: profile?.lastName ?? ''
      }),
      patientDob: profile?.dob ? utils.date.formatDate(profile.dob) : '-',
      labName: getFieldValue(testInfo?.fields?.[19]),
      labAddress: getFieldValue(labInfo?.[2], {
        joinWithIndexed: {
          1: '\n',
          2: ''
        },
        joinWith: ', '
      }),
      labPhoneNumber: '(859) 215-7956',
      labDirector: 'Phillip R. Gibbs, PhD, NRCC',
      labCiaId: '18D2278838'
    }

    setPatientInfo([
      {
        key: 'Name',
        value: patientName,
        type: 'string'
      },
      {
        key: 'DOB',
        value: patientDob,
        type: 'date'
      }
    ])

    setReportDetails({
      patientName,
      patientDob,
      labName,
      labAddress: getFieldValue(labInfo?.[2], {
        joinWithIndexed: {
          1: ' ',
          2: ''
        },
        joinWith: ', '
      }),
      labPhoneNumber,
      labDirector
    })

    setLabInfo([
      {
        key: 'Lab name',
        value: labName,
        type: 'string'
      },
      {
        key: 'CLIA ID#',
        value: labCiaId,
        type: 'string'
      },
      {
        key: 'Address',
        value: labAddress,
        type: 'string'
      },
      {
        key: 'Office',
        value: labPhoneNumber,
        type: 'string'
      },
      {
        key: 'Lab Director',
        value: labDirector,
        type: 'string'
      }
    ])

    setTestInfo([
      {
        key: 'Specimen ID',
        value: getFieldValue(clinicInfo?.fields[2]),
        type: 'string'
      },
      {
        key: 'Type',
        value: utils.string.capitalizeFirstLetter(getFieldValue(testInfo?.fields?.[14])),
        type: 'string'
      },
      {
        key: 'Collected',
        value: collectedDate ? utils.date.formatDate(collectedDate) : '-',
        type: 'date'
      },
      {
        key: 'Received',
        value: formatHl7Date(getFieldValue(testInfo?.fields[5] ?? '-')),
        type: 'date'
      },
      {
        key: 'Reported',
        value: reportedDate,
        type: 'date'
      }
    ])
  }, [])

  const styles = StyleSheet.create({
    headerText: {
      marginBottom: 2,
      width: '100%',
      textAlign: 'right',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    baseTextStyle: {
      fontSize: 10,
      fontWeight: 'normal',
      fontFamily: 'Poppins',
      color: '#000'
    },
    infoBlockWrapper: {
      display: 'flex',
      width: '50%',
      flexDirection: 'column'
    },
    infoBlockHeader: {
      fontSize: 10,
      fontWeight: 700,
      fontFamily: 'Poppins',
      color: '#000',
      textAlign: 'center',
      borderBottom: '3px solid #005583',
      width: '96%',
      marginBottom: 5
    },
    footerPageInfoView: {
      bottom: -24,
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    footerPageInfoViewContent: {
      fontWeight: 'normal',
      fontFamily: 'Poppins',
      fontSize: 8,
      color: '#808080',
      width: '33.33%'
    },
    infoBlockOuterContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    infoBlockInfoView: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'row'
    },
    horizontalLine: {
      width: '100%',
      display: 'flex',
      borderBottom: '2px solid #005583',
      marginVertical: 5
    },
    table: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000'
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row'
    },
    tableCellHeader: {
      fontWeight: 700,
      padding: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderStyle: 'solid',
      borderWidth: 1,
      fontSize: 11,
      height: '100%',
      borderColor: '#000',
      width: '100%'
    },
    tableCell: {
      padding: 2,
      borderStyle: 'solid',
      borderWidth: 1,
      height: '100%',
      fontSize: 9,
      borderColor: '#000',
      width: '25%',
      textAlign: 'center'
    },
    footer: {
      position: 'absolute',
      bottom: 35,
      left: 15,
      right: 15
    },
    body: {
      paddingHorizontal: 15,
      paddingTop: 130,
      paddingBottom: 100,
      fontFamily: 'Poppins',
      fontWeight: 'normal',
      position: 'relative'
    },
    header: {
      position: 'absolute',
      top: 10,
      left: 15,
      right: 15
    },
    relative: {
      position: 'relative'
    }
  })

  Font.register({
    family: 'Poppins',
    fonts: [
      {
        src: '/fonts/poppins/Poppins-Bold.woff',
        fontWeight: 700
      },
      {
        src: '/fonts/poppins/Poppins-Regular.woff',
        fontWeight: 'normal'
      }
    ]
  })

  const getHorizontalLine = (variant: 'black' | 'blue') => {
    return (
      <View
        style={{
          ...styles.horizontalLine,
          ...(variant === 'black' && {
            borderColor: '#000'
          })
        }}
      />
    )
  }

  const getLogo = () => {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        src='/images/blank/novotech-pdf-logo.png'
        style={{
          width: 120,
          objectFit: 'contain'
        }}
      />
    )
  }

  const getPage = (args: PropsWithChildren) => {
    finalReport.current = false
    return (
      <Page
        size='A4'
        style={{
          ...styles.body,
          paddingTop: finalReport.current ? styles.body.paddingTop + 10 : styles.body.paddingTop
        }}
      >
        {/* Header */}
        <View style={styles.header} fixed>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              height: 100
            }}
          >
            {getLogo()}
          </View>

          <Text
            style={{
              fontSize: styles.baseTextStyle.fontSize + 3,
              width: '100%',
              display: 'flex',
              textAlign: 'center',
              fontFamily: 'Poppins',
              marginTop: 0,
              fontWeight: 700
            }}
          >
            Final Lab Report
          </Text>

          {finalReport.current
            ? getResultsRow({
              data: headingsArray,
              bold: true,
              variant: 'gray',
              removeBorders: true
            })
            : null}
        </View>

        {/* Header */}
        {args.children}

        <View style={styles.footer} fixed>
          <View style={styles.relative}>
            <Text
              style={{
                ...styles.baseTextStyle,
                fontSize: styles.baseTextStyle.fontSize - 2
              }}
            >
              These tests are considered a Laboratory Developed Test (LDT) and are not submit to clearance by the FDA.
              These tests have been internally validated according to the Clinical Laboratory Improvement Act of 1988
              (CLIA) and other applicable regulatory standards. These tests are intended to be used for clinical
              purposes and should not be regarded as investigational or for research. Urine toxicology tests are
              referenced to SV Diagnostics (CLIA #18D2272276) for testing and saliva toxicology tests are referenced to
              Limestone Laboratories Inc (CLIA#18D2278838) for testing.
            </Text>
            {getHorizontalLine('black')}
            <View style={styles.footerPageInfoView}>
              <Text
                style={{
                  ...styles.footerPageInfoViewContent,
                  textAlign: 'left'
                }}
              >
                {[reportDetails?.labName, reportDetails?.labAddress].join('\n')}
              </Text>

              <Text
                style={{
                  ...styles.footerPageInfoViewContent,
                  textAlign: 'center'
                }}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              />

              <Text
                style={{
                  ...styles.footerPageInfoViewContent,
                  textAlign: 'right'
                }}
              >
                {[
                  `Patient: ${reportDetails?.patientName} DOB: ${reportDetails?.patientDob}`,
                  `Sample ID: ${props.reportId ?? '-'}`
                ].join('\n')}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    )
  }

  const getValueToRender = (item: IItem) => {
    switch (item.type) {
      case 'boolean':
        return item.value ? 'Yes' : 'No'
      case 'date':
        return item.value ? utils.date.formatDate(item.value as Date) : '-'
      case 'number':
        return item.value
      case 'string':
        return item.value ? item.value : '-'
    }
  }

  const getInfoItem = (item: IItem, options?: IListInfoItemsOptions) => {
    const { valueProps, keyProps } = options ?? {}
    return (
      <>
        <Text
          style={{
            ...styles.baseTextStyle,
            fontWeight: 700,
            marginRight: 2,
            ...(keyProps?.style?.minWidth && {
              minWidth: keyProps?.style?.minWidth
            }),
            ...(keyProps?.style?.textAlign && {
              textAlign: keyProps?.style?.textAlign as any
            })
          }}
        >
          {utils.string.capitalizeFirstLetter(item.key, true)}:
        </Text>
        <Text
          style={{
            ...styles.baseTextStyle,
            ...(valueProps?.style?.maxWidth && {
              maxWidth: valueProps?.style?.maxWidth
            }),
            ...(valueProps?.style?.textAlign && {
              textAlign: valueProps?.style?.textAlign as any
            })
          }}
        >
          {getValueToRender(item)}
        </Text>
      </>
    )
  }

  const listInfoItems = (items: IItem[], options?: IListInfoItemsOptions) => {
    return (
      <View style={styles.infoBlockOuterContainer}>
        {items.map((info, index) => {
          return (
            <View
              key={`${Date.now()}${index}`}
              style={{
                ...styles.infoBlockInfoView
              }}
            >
              {getInfoItem(info, options)}
            </View>
          )
        })}
      </View>
    )
  }

  const getResultsRow: IGetResultsRow = args => {
    const { data, bold, error, leftAlignFirst, isLast } = args

    const cellStyle = {
      ...styles.tableCell,
      fontWeight: (bold ? 700 : 'normal') as any,
      color: error ? 'red' : 'black',
      width: `${100 / data.length}%`,
      ...(args.removeCellBlockBorders && {
        borderLeft: '#fff',
        borderRight: '#fff'
      }),
      ...(args.removeBorders && {
        borderColor: '#fff'
      })
    }

    return (
      <View
        style={{
          ...styles.tableRow,
          backgroundColor: args.variant === 'gray' ? '#D4D4D4' : '#fff',
          ...(isLast && {
            borderBottom: '1px solid #000'
          })
        }}
      >
        {data.map((value, index) => {
          return (
            <Text
              key={index}
              style={{
                ...cellStyle,
                ...(leftAlignFirst &&
                  index === 0 && {
                  textAlign: 'left'
                })
              }}
            >
              <>{value ?? null}</>
            </Text>
          )
        })}
      </View>
    )
  }

  const getResults: IGetResults = args => {
    const { title, data, centerHeaderText = false, type = 'results', isLast } = args

    finalReport.current = type !== 'results'

    if (finalReport.current) {
      finalReport.current = true
      headingsArray = ['Test', 'Result', 'Conc.', 'Cut-off']
    } else {
      finalReport.current = false
      headingsArray = baseHeadingArray
    }

    return (
      <View
        style={{
          ...styles.table,
          marginBottom: isLast ? 25 : 10,
          ...(finalReport.current && {
            borderLeft: '#fff',
            borderRight: '#fff'
          })
        }}
      >
        {title ? (
          <View
            style={{
              ...styles.tableRow,
              backgroundColor: '#005583',
              color: '#fff',
              ...(finalReport.current && {
                borderLeft: '#fff',
                borderRight: '#fff'
              })
            }}
          >
            <Text
              style={{
                ...styles.tableCellHeader,
                textAlign: centerHeaderText ? 'center' : 'left',
                ...(finalReport.current && {
                  borderLeft: '#fff',
                  borderRight: '#fff'
                })
              }}
            >
              {title}
            </Text>
          </View>
        ) : null}

        {getResultsRow({
          data: headingsArray,
          bold: true,
          variant: 'gray',
          removeBorders: finalReport.current
        })}

        {data?.map(({ data, error, title, isLast }) => {
          return (
            <>
              {title ? (
                <View
                  style={{
                    ...styles.tableRow,
                    width: '100%'
                  }}
                >
                  <Text
                    style={{
                      ...styles.tableCellHeader,
                      fontSize: styles.baseTextStyle.fontSize - 2,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      ...(finalReport.current && {
                        border: 'none'
                      })
                    }}
                  >
                    {title}
                  </Text>
                </View>
              ) : null}
              {getResultsRow({
                data: data,
                error,
                removeBorders: finalReport.current,
                leftAlignFirst: finalReport.current,
                isLast
              })}
            </>
          )
        })}
      </View>
    )
  }

  return (
    <Document>
      {getPage({
        children: (
          <>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                ...styles.baseTextStyle,
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 20
              }}
            >
              <View style={styles.infoBlockWrapper}>
                <Text style={styles.infoBlockHeader}>Patient Information</Text>
                {listInfoItems(patientInfo, infoItemOptions)}
              </View>
              <View style={styles.infoBlockWrapper}>
                <Text style={styles.infoBlockHeader}>Test Information</Text>
                {listInfoItems(testInfo, infoItemOptions)}
              </View>
              <View style={styles.infoBlockWrapper}>
                <Text style={styles.infoBlockHeader}>Clinic Information</Text>
                {listInfoItems(labInfo, infoItemOptions)}
              </View>
            </View>

            {/* {getHorizontalLine('blue')} */}

            {getResults({
              title: 'CONFIRMATION RESULTS DETAIL',
              type: 'final',
              centerHeaderText: true,
              data: finalResults?.length
                ? finalResults
                : [
                  {
                    title: 'Alkaloids, Not Otherwise Specified',
                    data: ['Caffeine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Cotinine', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },
                  {
                    title: 'Amphetamines',
                    data: ['Amphetamine', 'Detected', '> 50 ng/mL', '1 ng/mL', ''],
                    error: true
                  },
                  {
                    data: ['Methamphetamine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Methylone', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Phentermine', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Anticonvulsants',
                    data: ['10-11-Dihydro-10', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Carbamazepine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Oxcarbazepine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Topiramate', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Antidepressants',
                    data: ['Bupropion', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Citalopram', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Desmethylcitalopram', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Fluoxetine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Hydroxybupropion', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['mCPP', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['O-desmethylvenlafaxine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Paroxetine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Sertraline', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Trazodone', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Venlafaxine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Sertraline', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Antipsychotics',
                    data: ['9-Hydroxyrisperidone', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Clozapine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Desmethylclozapine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Quetiapine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Risperidone', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Barbiturates',
                    data: ['Amo-Pentobarbita', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Butabarbital', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Butalbital', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Phenobarbital', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Primidone', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Secobarbital', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Benzodiazepines',
                    data: ['2-Hydroxyethylflurazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['7-Aminoclonazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Alprazolam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Clonazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Desalkylflurazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Diazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Flurazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Hydroxyalprazolam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Hydroxymidazolam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Hydroxytriazolam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Lorazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Midazolam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Nordiazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Oxazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Temazepam', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Triazolam', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Buprenorphine / Naloxone',
                    data: ['6a-Naloxol', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Buprenorphine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Naloxone', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Norbuprenorphine', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Cannabinoids, Natural',
                    data: ['THC', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Cocaine',
                    data: ['Benzoylecgonine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Cocaethylene', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Cocaine', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Ecstasy',
                    data: ['MDA', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['MDMA', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Fentanyl',
                    data: ['Fentanyl', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Norfentanyl', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Gabapentin',
                    data: ['Gabapentin', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Heroin Metabolites',
                    data: ['6-MAC', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['6-MAM', 'Detected', '-', '1 ng/mL', ''],
                    error: true,
                    isLast: true
                  },

                  {
                    title: 'Ketamine',
                    data: ['Ketamine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Norketamine', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Methadone',
                    data: ['EDDP', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Methadone', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Methylphenidate',
                    data: ['Ritalinic Acid', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  },

                  {
                    title: 'Opiates',
                    data: ['Codeine', 'Not Detected', '-', '1 ng/mL', '']
                  },
                  {
                    data: ['Morphine', 'Not Detected', '-', '1 ng/mL', ''],
                    isLast: true
                  }
                ]
            })}
          </>
        )
      })}
    </Document>
  )
}

const Pdf = (props?: Partial<IPdfProps>) => {
  const save = async () => {
    const blob = await pdf(<DocumentPdf message={(props?.message ?? hl7Mesage) as any} />).toBlob()
    saveAs(blob, 'document.pdf')
  }

  return (
    <>
      <Box
        sx={{
          marginBottom: 10
        }}
      >
        <DocumentPdf message={(props?.message ?? hl7Mesage) as any} />
      </Box>
      <Box>
        <CommonButton label='Save' onClick={save} />
      </Box>
    </>
  )
}

export default Pdf
