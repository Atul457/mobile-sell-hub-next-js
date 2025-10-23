import { Box, IconButton, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import CommonChip from '@/components/common/CommonChip'

import { IPackagePopulated } from '@/models/package.model'
import { helpers } from '@/utils/helpers'
import { utils } from '@/utils/utils'

const NUMERIC_STATUS = utils.CONST.PACKAGE.NUMERIC_STATUS

type IPackagesColumns = {
  onEditClick: (package_: IPackagePopulated) => void
  permissions: ReturnType<typeof utils.helpers.role.getPermissions>
}

export const packagesColumns = (props: IPackagesColumns): GridColDef<IPackagePopulated>[] => {
  return helpers.getDataGridColumnsWithSpaces([
    {
      flex: 0.3,
      minWidth: 200,
      headerName: 'Identifier',
      field: 'identifier',
      sortable: true,
      renderCell: params => (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography
            variant='body2'
            className='ellipsis'
            sx={{
              color: 'text.primary',
              fontSize: theme => theme.typography.body2.fontSize
            }}
            title={utils.helpers.getValue(params.row.identifier)}
          >
            {utils.helpers.getValue(params.row.identifier)}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.3,
      minWidth: 200,
      headerName: 'Name',
      field: 'name',
      sortable: true,
      renderCell: params => (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography
            variant='body2'
            className='ellipsis'
            sx={{
              color: 'text.primary',
              fontSize: theme => theme.typography.body2.fontSize
            }}
            title={utils.helpers.getValue(params.row.name)}
          >
            {utils.helpers.getValue(params.row.name)}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 100,
      headerName: 'Price',
      field: 'price',
      sortable: true,
      renderCell: params => (
        <Typography
          variant='body2'
          sx={{
            color: 'text.primary',
            fontSize: theme => theme.typography.body2.fontSize,
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          ${params.row.price ? utils.helpers.getValue(params.row.price) : 0}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Status',
      field: 'status',
      sortable: true,
      renderCell: params => (
        <CommonChip
          variant={utils.helpers.user.getUserStatusVariant(params.row.status)}
          label={NUMERIC_STATUS[params.row.status]}
          onClick={() => props.onEditClick(params.row)}
        />
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Created At',
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
    ...(props.permissions.update ? [{
      flex: 0.1,
      minWidth: 100,
      headerName: 'Actions',
      field: 'actions',
      cellClassName: 'flex justify-start items-center',
      sortable: false,
      renderCell: params => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <IconButton
            onClick={() => props.onEditClick(params.row)}
            sx={{
              color: 'text.primary'
            }}
          >
            <i className='tabler-edit text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
          </IconButton>
        </Box>
      )
    }] : []) as GridColDef<IPackagePopulated>[],
  ] as GridColDef<IPackagePopulated>[],
  )
}
