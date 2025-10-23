'use client'

// MUI imports
import { Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage'
import CommonWithDropdown from '@/components/common/CommonIconWithDropdown'

// Redux hook imports
import { useAppDispatch } from '@/store/hooks/hooks'

// Custom component imports
import CustomTextField from '@/@core/components/mui/TextField'
// Config imports
import themeConfig from '@/configs/themeConfig'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'
//  import { useConfigProviderContext } from '@/contexts/ConfigProvider'
import { useModal } from '@/contexts/ModalProvider'
import { IInitialModalState } from '@/contexts/types'
// Model imports
import { IReport, IReportPopulated } from '@/models/report.model'
import { ReportService } from '@/services/client/Report.service'
// Utility imports
import { utils } from '@/utils/utils'

// Report-related imports
import Report from './[id]/components/ReportDrawer'
import useReports from './hooks/useReports'
import { reportsColumns } from './reportsColumns'

const { NUMERIC_STATUS, STATUS } = utils.CONST.REPORT

type IReportProps = {
  userId?: string
  profileId?: string
}

const Reports = (props: IReportProps) => {

  const deleted = useRef(false)
  const modalContext = useModal()
  // Hooks and state management
  const dispatch = useAppDispatch()
  const {
    reports,
    list,
    onSearch: onSearch_,
    update,
    empty
  } = useReports({
    userId: props.userId,
    profileId: props.profileId
  })

  const [selected, setSelected] = useState<IReportPopulated | null>(null)
  const { permissions } = useConfigProviderContext()
  const [reportPermissions] = useState(utils.helpers.role.getPermissions("report", permissions));
  const addUser = modalContext.modals.addUser

  useEffect(() => {
    list({})
  }, [dispatch])

  // Handle status change
  const handleTypeChange = (status: IReport['status'] | -1) => {
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
  const onClose = () => {
    utils.dom.onModalClose()
    setSelected(null)
  }

  const openReportManagementModal = (type: Exclude<IInitialModalState['manageReports'], null>['type']) => {
    modalContext.openModal({
      type: 'manageReports',
      props: {
        visible: true,
        type,
        onGenerate: () => {
          list({ page: 1 })
        }
      }
    })
  }

  const onUpdate = ({ status }: IReportPopulated) => {
    if (selected) {
      update(
        selected?._id as string,
        {
          ...selected,
          status
        } as IReportPopulated
      )
    }
  }

  const onDeleteConfimation = async (user: IReport) => {
    try {
      const us = new ReportService()
      const response = await us.delete(user.id)
      utils.toast.success({ message: response.message! })
      addUser?.delete?.()
      deleted.current = true
      list({})
    } catch (error) {
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  const onDeleteButtonClick = useCallback((user: IReport) => {
    modalContext.openModal({
      type: 'alert',
      props: {
        heading: 'Delete Report',
        description:
          'Are you sure you want to delete this report? All information associated with this report will be permanently removed.',
        onOkClick: () => onDeleteConfimation(user),
        visible: true,
        status: 'idle',
        okButtonText: 'Delete',
        cancelButtonText: 'Cancel',

      }
    })
  }, [])

  const reportColumns_ = useMemo(() => {
    return reportsColumns({
      ...(props.userId && {
        for: 'employees',
      }),
      permissions: reportPermissions,

      onDeleteButtonClick: user => {
        onDeleteButtonClick(user)
      }
    })
  }, [onDeleteButtonClick])

  return (
    <>
      {/* Report Component for viewing details */}
      <Report onUpdate={onUpdate} report={selected} onClose={onClose} />

      {/* Card with DataGrid and filter/search */}
      <Card style={{ width: '100%' }}>
        <CardHeader
          sx={{ padding: 3, flexWrap: 'wrap' }}
          title={
            <Typography variant='h3' color='primary.main' sx={{ fontSize: theme => theme.typography.h3 }}>
              {props.userId ? 'Reports' : 'List of All Reports'}
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
                    value: reports.data.status,
                    onChange: e => { handleTypeChange(Number(e.target.value) as IReport['status']) }
                  }}
                  label={null}
                  sx={{ paddingInlineEnd: 0, width: '100%' }}
                  value={reports.data.status}
                  onChange={e => { handleTypeChange(Number(e.target.value) as IReport['status']) }}
                >
                  <MenuItem value={-1}>All</MenuItem>
                  <MenuItem value={STATUS.DRAFT}>{NUMERIC_STATUS[STATUS.DRAFT]}</MenuItem>
                  <MenuItem value={STATUS.PENDING}>{NUMERIC_STATUS[STATUS.PENDING]}</MenuItem>
                  <MenuItem value={STATUS.SUBMITTED}>{NUMERIC_STATUS[STATUS.SUBMITTED]}</MenuItem>
                  <MenuItem value={STATUS.CHECKED}>{NUMERIC_STATUS[STATUS.CHECKED]}</MenuItem>
                </CustomTextField>
              </FormControl>

              {/* Search bar */}
              <CustomTextField
                label={null}
                sx={{ width: { xs: '100%', md: 300 } }}
                defaultValue=''
                onChange={e => onSearch(e.target.value)}
                placeholder='Search by Report Id or Qr Code'
              />

              {/* Dropdown menu for import */}
              <CommonWithDropdown
                iconProps={{ className: 'text-textPrimary' }}
                menuOptions={[
                  ...reportPermissions.create ? [
                    { label: 'Import', value: 1, onClick: () => openReportManagementModal('import') }
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
            loading={reports.status === 'loading'}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: { outline: 'transparent' },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: { outline: 'none' }
            }}
            autoHeight
            sortingMode='server'
            rowSelection={false}
            rows={reports.data?.reports}
            columns={reportColumns_}
            rowCount={reports.data.totalCount}
            disableColumnMenu
            pageSizeOptions={[10, 25, 50]}
            paginationMode='server'
            paginationModel={{
              page: reports.data.page - 1,
              pageSize: reports.data.limit
            }}
            onPaginationModelChange={onPaginationModalChange}
            onSortModelChange={handleSortModelChange}
            slots={{
              noRowsOverlay: () => (
                <CustomNoRowsOverlay message={empty ? 'There are no reports available at this time.' : undefined} />
              )
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Reports
