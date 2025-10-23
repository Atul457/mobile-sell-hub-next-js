'use client'

import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage'
import CommonWithDropdown from '@/components/common/CommonIconWithDropdown'

// import AlertModal from '@/components/modals/AlertModal';
import { useAppDispatch } from '@/store/hooks/hooks'

import CustomTextField from '@/@core/components/mui/TextField'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'
import { useModal } from '@/contexts/ModalProvider'
import { IRole, IRolePopulated } from '@/models/role.model'
import { IUser } from '@/models/user.model'
import { UsersService } from '@/services/client/Users.service'
import { utils } from '@/utils/utils'

import useRoles from './hooks/useRoles'
import { rolesColumns } from './roleColumns'

const { NUMERIC_STATUS } = utils.CONST.USER

type IRolesDataGridProps = {
  type: IRole['type']
}

const RolesDataGrid = (props: IRolesDataGridProps) => {
  const { roles, list, onSearch: onSearch_, update, empty } = useRoles(props)
  const selectedRoleRef = useRef<IRolePopulated | null>(null)
  const { permissions } = useConfigProviderContext()
  const [rolePermissions] = useState(utils.helpers.role.getPermissions("role", permissions));
  const modalsContext = useModal()

  const dispatch = useAppDispatch()

  const onUserStatusChangeBtnClick = useCallback(
    (user: IUser) =>
      modalsContext.openModal({
        type: 'alert',
        props: {
          heading: `Confirmation`,
          description: `Are you sure you want to change the status of this user? Changing the 
      status of this user will make it [${NUMERIC_STATUS[user.status ? 0 : 1]}]. `,
          okButtonText: 'Yes',
          okButtonLoadingText: `Processing`,
          cancelButtonText: null,
          status: 'idle',
          visible: true,
          onOkClick: () => onUserStatusChangeConfimationClick(user)
        }
      }),
    []
  )

  const onRoleBtnClick = useCallback(
    (args: { role?: IRolePopulated; view?: boolean }) =>
      modalsContext.openModal({
        type: 'manageRoles',
        props: {
          type: props.type,
          data: args.role,
          view: args.view,
          visible: true,
          onCreate: () => {
            list({})
          },
          onUpdate: () => {
            list({})
          }
        }
      }),
    []
  )

  const rolesColumns_ = useMemo(() => {
    return rolesColumns({
      permissions: rolePermissions,
      type: props.type,
      onClick: args => {
        onRoleBtnClick(args)
      }
    })
  }, [onUserStatusChangeBtnClick, onRoleBtnClick, props.type])

  useEffect(() => {
    list({})
  }, [dispatch])

  const onSearch = utils.debounce(query => {
    onSearch_(query)
  }, 300)

  const onPaginationModalChange = ({ page, pageSize }: { page: number; pageSize: number }) => {
    list({
      page: page + 1,
      limit: pageSize
    })
  }

  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel.length > 0) {
      list({
        sort: sortModel[0].field,
        order: sortModel[0].sort
      })
    }
  }

  const onUserStatusChangeConfimationClick = async (user: IUser) => {
    const us = new UsersService()
    const response = await us.updateStatus(user.id, {
      ...user,
      status: user.status ? 0 : 1
    })
    onUpdate(response.data?.user)
  }

  const onUpdate = (role: IRolePopulated) => {
    if (selectedRoleRef.current) {
      update(
        selectedRoleRef.current?._id as string,
        {
          ...selectedRoleRef.current,
          ...role
        } as IRolePopulated
      )
    }
  }

  return (
    <Card style={{ width: '100%' }}>
      <CardHeader
        sx={{ padding: 3 }}
        title={
          <Typography
            variant='h3'
            color='primary.main'
            sx={{
              fontSize: theme => theme.typography.h3
            }}
          >
            {props.type === utils.CONST.ROLE_PERMISSION.TYPES.ADMIN ? 'Admin Roles' : 'List of All Roles'}
          </Typography>
        }
        action={
          <div className='flex items-center flex-wrap space-x-2'>
            <CustomTextField
              label={null}
              sx={{
                width: 300
              }}
              defaultValue=''
              onChange={e => onSearch(e.target.value)}
              // type='search'
              name='name'
              placeholder='Enter name'
            />
            <CommonWithDropdown
              iconProps={{ className: 'text-textPrimary' }}
              menuOptions={[
                ...rolePermissions.create ? [
                  { label: 'Add', value: 1, onClick: () => onRoleBtnClick({}) }
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
        <DataGrid
          loading={roles.status === 'loading'}
          sx={{
            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
              outline: 'transparent'
            },
            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
              outline: 'none'
            }
          }}
          autoHeight
          sortingMode='server'
          rowSelection={false}
          rows={roles.data?.roles}
          columns={rolesColumns_}
          rowCount={roles.data.totalCount}
          disableColumnMenu
          pageSizeOptions={[10, 25, 50]}
          paginationMode='server'
          paginationModel={{
            page: roles.data.page - 1,
            pageSize: roles.data.limit
          }}
          onPaginationModelChange={onPaginationModalChange}
          onSortModelChange={handleSortModelChange}
          slots={{
            noRowsOverlay: () => (
              <CustomNoRowsOverlay message={empty ? 'It seems there are no roles in the system.' : undefined} />
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

export default RolesDataGrid
