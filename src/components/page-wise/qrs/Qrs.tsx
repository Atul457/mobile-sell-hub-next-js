'use client'

// MUI imports
import { Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage'
import CommonWithDropdown from '@/components/common/CommonIconWithDropdown'

// Redux hook imports
import { useAppDispatch } from '@/store/hooks/hooks'

// Custom component imports
import CustomTextField from '@/@core/components/mui/TextField'
// Config imports
import themeConfig from '@/configs/themeConfig'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'
import { useModal } from '@/contexts/ModalProvider'
// Context imports
import { IInitialModalState } from '@/contexts/types'
// Model imports
import { IQr, IQrPopulated } from '@/models/qr.model'
// Service imports
import { QrService } from '@/services/client/Qr.service'
// Utility imports
import { utils } from '@/utils/utils'

// QR-related imports
// import Qr from './components/qr/Qr'
import useQrs from './hooks/useQrs'
import { qrsColumns } from './qrsColumns'

const { NUMERIC_STATUS, STATUS } = utils.CONST.QR

const Qrs = () => {

  // Hooks and state management
  const modalContext = useModal()
  const dispatch = useAppDispatch()
  const { qrs, list, onSearch: onSearch_, getListPayload, empty } = useQrs()

  const [_, setExporting] = useState(false)
  const [__, setSelected] = useState<IQrPopulated | null>(null)

  const { permissions } = useConfigProviderContext()
  const [qrPermissions] = useState(utils.helpers.role.getPermissions("qr", permissions));

  // Memoizing columns to avoid unnecessary re-renders
  const [qrColumns_] = useMemo(
    () => [
      qrsColumns({
        permissions: qrPermissions,
        onCopyButtonClick: qr => {
          utils.clipboard.copy(qr.qrCode).then(isCopied => {
            const successMessage = utils.CONST.RESPONSE_MESSAGES._SUCCESSFULLY.replace('[ITEM]', 'Code copied')
            if (isCopied) {
              utils.toast.success({
                message: utils.error.getMessage(successMessage, false)
              })
            } else {
              utils.toast.error({
                message: utils.error.getMessage(null)
              })
            }
          })
        },
        onViewButtonClick: qr => {
          setSelected(qr)
          utils.dom.onModalOpen()
        }
      })
    ],
    [setSelected]
  )

  useEffect(() => {
    list({})
  }, [dispatch])

  // Handle status change
  const handleTypeChange = (status: IQr['status'] | 0) => {
    list({ status })
  }

  // Debounced search function for better performance
  const onSearch = utils.debounce(query => {
    onSearch_(query)
  }, 300)

  // Handle pagination and sorting
  const onPaginationModalChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    list({ page: page + 1, limit: pageSize })
  }

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel.length > 0) {
      list({
        sort: sortModel[0].field,
        order: sortModel[0].sort
      })
    }
  }

  // Modal close handler
  // const onClose = () => {
  //     utils.dom.onModalClose()
  //     setSelected(null)
  // }

  // Modal opening for QR management
  const openQrManagementModal = (type: Exclude<IInitialModalState['manageQrs'], null>['type']) => {
    modalContext.openModal({
      type: 'manageQrs',
      props: {
        visible: true,
        type,
        onGenerate: () => {
          list({ page: 1 })
        }
      }
    })
  }

  // Exporting QR data to CSV
  const onExportButtonClick = async () => {
    try {
      const { VALUE_NOT_PROVIDED } = utils.CONST.APP_CONST
      const toastId = utils.toast.loading({ message: 'Fetching Qrs..' })

      setExporting(true)
      const payload = getListPayload({})
      const qs = new QrService()
      const response = await qs.list({ ...payload, all: true })

      utils.toast.updateLoading({
        loadingToastId: toastId,
        isError: false,
        message: 'Converting to csv..'
      })

      const qrs: IQrPopulated[] = response.data?.qrs ?? []
      const link = document.createElement('a')

      // Map Qr data for export
      const qrsToExport = qrs.map(qr => ({
        'Qr codes': qr.qrCode,
        Status: NUMERIC_STATUS[qr.status],
        'Used By': qr.usedBy ? utils.helpers.user.getFullName(qr.usedBy) : VALUE_NOT_PROVIDED,
        'Used On': qr.usedAt ? utils.date.formatDate(qr.usedAt) : VALUE_NOT_PROVIDED,
        'Created Date': utils.date.formatDate((qr as any).createdAt)
      }))

      let csv = utils.helpers.convertArrayOfObjectsToCSV(qrsToExport)
      const filename = 'qrs-export.csv'

      if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`
      }

      link.setAttribute('href', encodeURI(csv))
      link.setAttribute('download', filename)
      link.click()

      utils.toast.stopLoading({
        loadingToastId: toastId,
        isError: false,
        message: 'Qrs exported successfully'
      })

      setExporting(false)
    } catch (error) {
      utils.toast.error({ message: utils.error.getMessage(error) })
    }
  }

  return (
    <>
      {/* Qr Component for viewing details */}
      {/* <Qr qr={selected} onClose={onClose} /> */}

      {/* Card with DataGrid and filter/search */}
      <Card style={{ width: '100%' }}>
        <CardHeader
          sx={{ padding: 3, flexWrap: 'wrap' }}
          title={
            <Typography variant='h3' color='primary.main' sx={{ fontSize: theme => theme.typography.h3 }}>
              List of All QR Codes
            </Typography>
          }
          action={
            <div className='flex items-center flex-wrap max-md:space-y-2 md:space-x-2'>
              {/* Dropdown for selecting status */}
              <FormControl size='small' sx={{ width: { xs: '100%', md: 200 } }}>
                <CustomTextField
                  select
                  type='select'
                  SelectProps={{
                    MenuProps: themeConfig.components.select.MenuProps,
                    multiple: false,
                    onChange: e => handleTypeChange(Number(e.target.value) as IQr['status'])
                  }}
                  label={null}
                  sx={{ paddingInlineEnd: 0, width: '100%' }}
                  value={qrs.data.status}
                  onChange={e => handleTypeChange(Number(e.target.value) as IQr['status'])}
                >
                  <MenuItem value={-1}>All</MenuItem>
                  <MenuItem value={STATUS.USED}>{NUMERIC_STATUS[STATUS.USED]}</MenuItem>
                  <MenuItem value={STATUS.ACTIVE}>{NUMERIC_STATUS[STATUS.ACTIVE]}</MenuItem>
                </CustomTextField>
              </FormControl>

              {/* Search bar */}
              <CustomTextField
                label={null}
                sx={{ width: { xs: '100%', md: 200 } }}
                defaultValue=''
                onChange={e => onSearch(e.target.value)}
                placeholder='Enter Qr code'
              />

              {/* Dropdown menu for generate, import, export */}
              <CommonWithDropdown
                iconProps={{ className: 'text-textPrimary' }}
                menuOptions={[
                  { label: 'Generate', value: 1, onClick: () => openQrManagementModal('generate') },
                  ...qrPermissions.create ? [
                    { label: 'Import', value: 2, onClick: () => openQrManagementModal('import') },
                    { label: 'Export', value: 3, onClick: onExportButtonClick }
                  ] : []
                ]}
                component={
                  <i className='tabler-list text-xl cursor-pointer hover:text-[var(--mui-palette-hyperlink-main)]' />
                }
              />
            </div>
          }
        />
        <CardContent sx={{ padding: 0 }}>
          {/* DataGrid for listing QRs */}
          <DataGrid
            loading={qrs.status === 'loading'}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: { outline: 'transparent' },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: { outline: 'none' }
            }}
            autoHeight
            sortingMode='server'
            rowSelection={false}
            rows={qrs.data?.qrs}
            columns={qrColumns_}
            rowCount={qrs.data.totalCount}
            disableColumnMenu
            pageSizeOptions={[10, 25, 50]}
            paginationMode='server'
            paginationModel={{
              page: qrs.data.page - 1,
              pageSize: qrs.data.limit
            }}
            onPaginationModelChange={onPaginationModalChange}
            onSortModelChange={handleSortModelChange}
            slots={{
              noRowsOverlay: () => (
                <CustomNoRowsOverlay
                  message={empty ? ' It looks like there are currently no QR codes generated.' : 'No rows'}
                />
              )
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Qrs
