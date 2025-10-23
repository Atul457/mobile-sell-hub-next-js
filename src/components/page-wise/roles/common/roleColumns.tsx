import { Box, IconButton, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import CommonChip from '@/components/common/CommonChip'

// import CommonChip from '@/components/common/CommonChip'
import { IRolePopulated } from '@/models/role.model'
import { helpers } from '@/utils/helpers'
import { utils } from '@/utils/utils'

type IRolesColumnsOnClickArgs = {
  view: boolean
  role: IRolePopulated
}

type IRolesColumns = {
  type: IRolePopulated['type']
  onClick: (view: IRolesColumnsOnClickArgs) => void
  permissions: ReturnType<typeof utils.helpers.role.getPermissions>
}

export const rolesColumns = (props: IRolesColumns): GridColDef<IRolePopulated>[] => {
  return helpers.getDataGridColumnsWithSpaces([
    {
      flex: 0.4,
      minWidth: 200,
      headerName: 'Name',
      field: 'name',
      sortable: true,
      renderCell: params => (
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
            title={params.row.name}
          >
            {params.row.name}
          </Typography>
        </Box>
      )
    },
    {
      ...(!(props.type === utils.CONST.ROLE.TYPES.ADMIN)
        ? {
          flex: 0.1,
          minWidth: 200,
          headerName: 'Default',
          field: (props.type === utils.CONST.ROLE.TYPES.USER
            ? 'defaultUserRole'
            : 'defaultAdminRole') as keyof IRolePopulated,
          sortable: true,
          renderCell: params => (
            <CommonChip
              variant='primary'
              label={
                (props.type === utils.CONST.ROLE.TYPES.USER
                  ? params.row.defaultUserRole
                  : params.row.defaultAdminRole)
                  ? 'Yes'
                  : 'No'
              }
            />
          )
        }
        : null)
    },

    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Created On',
      field: 'createdAt',
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
          title={utils.date.formatDate(params.row.createdAt)}
        >
          {utils.date.formatDate(params.row.createdAt)}
        </Typography>
      )
    },
    ...((props.permissions.read) ? [{
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
            alignItems: 'center',
            columnGap: 1
          }}
        >
          {(props.permissions.read) ? (
            <IconButton
              onClick={() => {
                props.onClick({
                  view: true,
                  role: params.row
                })
              }}
              sx={{
                color: 'text.primary'
              }}
            >
              <i className='tabler-eye text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
            </IconButton>
          ) : null}
          {(props.permissions.update) ? (
            <IconButton
              onClick={() => {
                props.onClick({
                  view: false,
                  role: params.row
                })
              }}
              sx={{
                color: 'text.primary'
              }}
            >
              <i className='tabler-edit text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
            </IconButton>
          ) : null}
        </Box>
      )
    }] : []) as GridColDef<IRolesColumns>[]
  ] as GridColDef<IRolePopulated>[])
}
