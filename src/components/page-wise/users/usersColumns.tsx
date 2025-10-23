import { Box, IconButton, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid'
import Link from 'next/link'

import CommonChip from '@/components/common/CommonChip'
import UserPreview from '@/components/user/UserPreview'

import { IConfigProviderContext } from '@/contexts/ConfigProvider'
import { IRolePopulated } from '@/models/role.model'
import { IUser } from '@/models/user.model'
import { helpers } from '@/utils/helpers'
import { utils } from '@/utils/utils'

const NUMERIC_STATUS = utils.CONST.USER.NUMERIC_STATUS
const NUMERIC_TYPES = utils.CONST.USER.NUMERIC_TYPES
const { ADMIN, SUB_ADMIN } = utils.CONST.USER.TYPES

type IUsersColumns = {
  for?: 'employees',
  type: IRolePopulated['type']
  onUserStatusChangeBtnClick: (user: IUser) => void
  onEditButtonClick: (user: IUser) => void
  onDeleteButtonClick: (user: IUser) => void
  rolesMap: IConfigProviderContext["rolesMap"]
  permissions: ReturnType<typeof utils.helpers.role.getPermissions>
}

export const usersColumns = (props: IUsersColumns): GridColDef[] => {
  const forEmployees = props.for === 'employees'
  return helpers.getDataGridColumnsWithSpaces([
    {
      flex: 0.3,
      minWidth: 200,
      headerName: 'Name',
      field: 'firstName',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <UserPreview
          containerProps={{
            sx: {
              height: '100%',
              paddingTop: '5px'
            }
          }}
          type='user'
          variant='small'
          user={{
            ...params.row
          }}
        />
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Phone',
      field: 'phoneNumber',
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
            title={utils.number.formatNumber(params.row.phoneNumber)?.toString()}
          >
            {utils.number.formatNumber(params.row.phoneNumber)}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Signup Date',
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
    ...(!forEmployees
      ? [
        {
          flex: 0.2,
          minWidth: 200,
          headerName: 'Role',
          field: 'role',
          sortable: true,
          renderCell: (params: GridRenderCellParams<IUser, any, any, GridTreeNodeWithRender>
          ) => (
            <CommonChip
              variant='primary'
              label={props.rolesMap.get(params.row.roleId) ?? ''}
            />
          )
        }
      ]
      : []),
    ...(forEmployees
      ? [
        {
          flex: 0.2,
          minWidth: 150,
          headerName: 'Type',
          field: 'type',
          sortable: true,
          renderCell: (params: GridRenderCellParams) => (
            <CommonChip
              variant='primary'
              label={utils.helpers.getValue(
                NUMERIC_TYPES?.[params.row.type as Exclude<IUser['type'], undefined>]
              )}
            />
          )
        }
      ]
      : []),

    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Status',
      field: 'status',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <CommonChip
          variant={utils.helpers.user.getUserStatusVariant(params.row.status)}
          label={NUMERIC_STATUS[params.row.status as IUser['status']]}
          onClick={() => props.onUserStatusChangeBtnClick(params.row)}
        />
      )
    },

    ...((props.permissions.read) ? [{
      flex: 0.1,
      minWidth: 150,
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
          {(props.permissions.read && ![ADMIN, SUB_ADMIN].includes(params.row.type)) ? (
            <Link href={`/users/${params.row.id}`} className='inline-flex'>
              <IconButton
                sx={{
                  color: 'text.primary'
                }}
              >

                <i className='tabler-eye text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
              </IconButton>
            </Link>
          ) : []}
          {(!(params.row.type === utils.CONST.USER.TYPES.ADMIN) && props.permissions.update) ? (
            <IconButton
              onClick={() => props?.onEditButtonClick?.(params.row)}
              sx={{
                color: 'text.primary'
              }}
            >
              <i className='tabler-edit text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
            </IconButton>
          ) : []}

          {(!(params.row.type === utils.CONST.USER.TYPES.ADMIN) && props.permissions.delete) ? (
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
          ) : []}
        </Box>
      )
    }] : []) as GridColDef<IUsersColumns>[]
  ] as GridColDef<IUsersColumns>[])
}

