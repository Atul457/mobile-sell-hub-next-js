import { Box, IconButton, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Link from 'next/link'

import CommonChip from '@/components/common/CommonChip'

// import UserPreview from '@/components/user/UserPreview'
import { IReport } from '@/models/report.model'
import { helpers } from '@/utils/helpers'
// import { IUser } from '@/models/user.model'
import { utils } from '@/utils/utils'

type IReportColumns = {
  onDeleteButtonClick: (user: IReport) => void
  permissions: ReturnType<typeof utils.helpers.role.getPermissions>
}

const { CONST } = utils
const NUMERIC_STATUS = CONST.REPORT.NUMERIC_STATUS

export const reportsColumns = (props: IReportColumns): GridColDef[] => {
  return helpers.getDataGridColumnsWithSpaces([
    {
      flex: 0.2,
      minWidth: 200,
      headerName: 'Report ID',
      field: 'identifier',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            maxWidth: '100%'
          }}
        >
          <Typography
            variant='body2'
            className='ellipsis'
            sx={{
              color: 'text.primary',
              fontSize: theme => theme.typography.body2.fontSize
            }}
            title={params.row.identifier}
          >
            {params.row.identifier}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Price',
      field: 'amountPaid',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            maxWidth: '100%'
          }}
        >
          <Typography
            variant='body2'
            className='ellipsis'
            sx={{
              color: 'text.primary',
              fontSize: theme => theme.typography.body2.fontSize
            }}
          >
            {params?.row?.transaction?.amountPaid
              ? `$${utils.helpers.getValue(params.row.transaction.amountPaid)}`
              : 'Incl. in pkg.'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Status',
      field: 'status',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <CommonChip
          variant={utils.helpers.report.getReportStatusVariant(params.row.status)}
          label={NUMERIC_STATUS[params.row.status as IReport['status']]}
        />
      )
    },

    ...(props.permissions.read ? [{
      flex: 0.2,
      minWidth: 180,
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant='body2'
          sx={{
            color: 'text.primary',
            fontSize: theme => theme.typography.body2.fontSize,
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
          title={utils.date.formatDate(params.row.createdAt)}
        >
          {utils.date.formatDate(params.row.createdAt)}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerName: 'Actions',
      field: 'actions',
      cellClassName: 'flex justify-start items-center',
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {props.permissions.read ?
            <Link href={`/reports/${params.row.id}`} className='inline-flex'>
              <IconButton
                sx={{
                  color: 'text.primary'
                }}
              >
                <i className='tabler-eye text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
              </IconButton>
            </Link>
            : null}

          {props.permissions.delete ?
            <IconButton onClick={() => props?.onDeleteButtonClick?.(params.row)}>
              <Typography
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer'
                }}
              >
                <i className='tabler-trash text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
              </Typography>
            </IconButton>
            : null}
        </Box>
      )
    }] : []) as GridColDef<IReportColumns>[]
  ]) as GridColDef<IReportColumns>[]
}

