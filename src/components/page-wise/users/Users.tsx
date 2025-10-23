'use client'

import { Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage'
import CommonIconWithDropdown from '@/components/common/CommonIconWithDropdown'

import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'
import { useModal } from '@/contexts/ModalProvider'
import { IRole } from '@/models/role.model'
import { IUser } from '@/models/user.model'
import { UsersService } from '@/services/client/Users.service'
import { utils } from '@/utils/utils'

import AddUserDrawer from './[id]/components/updateProfile/AddUserDrawer'
import EditProfileDrawer from './[id]/components/updateProfile/EditProfileDrawer'
import useUsers from './hooks/useUsers'
import { usersColumns } from './usersColumns'
import useRoles from '../roles/common/hooks/useRoles'

const { NUMERIC_TYPES, NUMERIC_STATUS, TYPES } = utils.CONST.USER
const { TYPES: ROLE_TYPES, } = utils.CONST.ROLE

type IUsersProps = {
  userId?: string
  isSubAdminListing?: boolean
}

const Users = (props: IUsersProps) => {

  const { isSubAdminListing, userId } = props;

  const deleted = useRef(false)
  const {
    users,
    list,
    onSearch: onSearch_,
    update,
    empty
  } = useUsers({
    ...isSubAdminListing && {
      type: TYPES.SUB_ADMIN,
    },
    ...userId && { userId }
  })

  const {
    roles: { data: { roles } },
    list: listRoles,
  } = useRoles({
    type: isSubAdminListing ? ROLE_TYPES.ADMIN : ROLE_TYPES.USER
  })

  const selectedUserRef = useRef<IUser | null>(null)
  const modalsContext = useModal()
  const { rolesMap } = useConfigProviderContext()
  const [selected, setSelected] = useState<IUser | null>(null)
  const [selectedAdminUser, setSelectedAdminUser] = useState<IUser | null>(null)
  const [create, setCreate] = useState(false)
  const { permissions } = useConfigProviderContext()
  const [userPermissions] = useState(utils.helpers.role.getPermissions("user", permissions));

  const addUser = modalsContext.modals.addUser

  const onUserStatusChangeBtnClick = useCallback(
    (user: IUser) =>
      modalsContext.openModal({
        type: 'alert',
        props: {
          heading: `Confirmation`,
          description: `Are you sure you want to change the status of this user? Changing the 
      status of this user will make it [${NUMERIC_STATUS[(user.status === 3) ? 1 : (user.status) ? 0 : 1]}]. `,
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

  useEffect(() => {
    list({})
    listRoles({})
  }, [])

  // Handle type change
  const handleTypeChange = (type: IUser['type']) => {
    list({
      type,
    })
  }

  const handleRoleChange = (role: IRole['id']) => {
    list({
      role
    })
  }

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
      status: (user.status === 3) ? 1 : (user.status) ? 0 : 1
    })
    onUpdate(response.data?.user)
    list({})
  }

  const onDeleteConfimation = async (user: IUser) => {
    try {
      const us = new UsersService()
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

  const onDeleteButtonClick = useCallback((user: IUser) => {
    modalsContext.openModal({
      type: 'alert',
      props: {
        heading: 'Delete User',
        description:
          `Are you sure you want to delete this ${isSubAdminListing ? 'admin' : ''} user? This will erase all associated data and restrict  ${isSubAdminListing ? 'admin' : 'user'} to access account.`,
        onOkClick: () => onDeleteConfimation(user),
        // onClose: onAlertClose,
        visible: true,
        status: 'idle',
        okButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    })
  }, [])

  const usersColumns_ = useMemo(() => {
    return usersColumns({
      ...((props.userId || !isSubAdminListing) && {
        for: 'employees'
      }),
      permissions: userPermissions,
      rolesMap,
      type: ROLE_TYPES.ADMIN,
      onEditButtonClick: user => {
        selectedUserRef.current = user
        utils.dom.onModalOpen();
        if (user.type !== 1 && user.type !== 7) {
          setSelected(user)
        } else {
          setSelectedAdminUser(user);
        }
      },
      onUserStatusChangeBtnClick: user => {
        selectedUserRef.current = user
        onUserStatusChangeBtnClick(user)
      },
      onDeleteButtonClick: user => {
        onDeleteButtonClick(user)
      }
    })
  }, [onUserStatusChangeBtnClick, onDeleteButtonClick, rolesMap, userPermissions])

  const onUpdate = (data: IUser) => {
    if (selected) {
      update(
        selected?._id as string,
        {
          ...selected,
          ...data
        } as IUser
      )
    }
    list({})
  }

  const onClose = () => {
    utils.dom.onModalClose()
    setSelected(null)
    setSelectedAdminUser(null)
    setCreate(false)
  }

  return (
    <>
      <EditProfileDrawer users={selected} onUpdate={onUpdate} onClose={onClose} />
      <AddUserDrawer
        user={selectedAdminUser}
        roles={roles} visible={create} onUpdate={onUpdate} onClose={onClose} />
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
              {props.userId ? 'Employees' : `List of All${isSubAdminListing ? " Admin" : ""} Users`}
            </Typography>
          }
          action={
            <div className='flex items-center flex-wrap space-x-2'>
              {!isSubAdminListing ?
                <FormControl size='small'>
                  <CustomTextField
                    select
                    type='select'
                    SelectProps={{
                      MenuProps: themeConfig.components.select.MenuProps,
                      multiple: false,
                      onChange: e => {
                        handleTypeChange(Number(e.target.value) as IUser['type'])
                      }
                    }}
                    label={null}
                    sx={{
                      paddingInlineEnd: 0,
                      width: 200
                    }}
                    value={users.data.type}
                    onChange={e => {
                      handleTypeChange(Number(e.target.value) as IUser["type"])
                    }}
                  >
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={TYPES.INDIVIDUAL}>{NUMERIC_TYPES[TYPES.INDIVIDUAL]}</MenuItem>
                    <MenuItem value={TYPES.CORPORATE_EMPLOYER}>{NUMERIC_TYPES[TYPES.CORPORATE_EMPLOYER]}</MenuItem>
                    <MenuItem value={TYPES.GOVT_ORGANISATION}>{NUMERIC_TYPES[TYPES.GOVT_ORGANISATION]}</MenuItem>
                    <MenuItem value={TYPES.ORGANIZATION_SUB_USER}>{NUMERIC_TYPES[TYPES.ORGANIZATION_SUB_USER]}</MenuItem>
                    <MenuItem value={TYPES.THIRD_PARTY_ADMINISTRATOR}>
                      {NUMERIC_TYPES[TYPES.THIRD_PARTY_ADMINISTRATOR]}
                    </MenuItem>
                  </CustomTextField>
                </FormControl>
                :
                <FormControl size='small'>
                  <CustomTextField
                    select
                    type='select'
                    defaultValue={0}
                    SelectProps={{
                      MenuProps: themeConfig.components.select.MenuProps,
                      multiple: false,
                      onChange: e => {
                        handleRoleChange(e.target.value as IRole['roleId'])
                      }
                    }}
                    label={null}
                    sx={{
                      paddingInlineEnd: 0,
                      width: 200
                    }}
                  >
                    <MenuItem value={0}>All</MenuItem>
                    {roles.map(currentRole => {
                      return (
                        <MenuItem key={currentRole.id} value={currentRole.id}>{currentRole.name}</MenuItem>
                      )
                    })
                    }
                  </CustomTextField>
                </FormControl>}

              <CustomTextField
                label={null}
                // autoFocus
                sx={{
                  width: 300
                }}
                defaultValue=''
                onChange={e => onSearch(e.target.value)}
                // type='search'
                name='userName'
                placeholder='Enter user name or email'
              />

              {isSubAdminListing ?
                <CommonIconWithDropdown
                  iconProps={{ className: 'text-textPrimary' }}
                  menuOptions={[
                    ...userPermissions.create ? [
                      { label: 'Add', value: 1, onClick: () => setCreate(true) }
                    ] : [],
                  ]}
                  component={
                    <i className='tabler-list text-xl cursor-pointer hover:text-[var(--mui-palette-hyperlink-main)]' />
                  }

                /> :
                null}

            </div>
          }
        />
        <CardContent sx={{ padding: 0 }}>
          <DataGrid
            loading={users.status === 'loading'}
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
            rows={users.data?.users}
            columns={usersColumns_}
            rowCount={users.data.totalCount}
            disableColumnMenu
            pageSizeOptions={[10, 25, 50]}
            paginationMode='server'
            paginationModel={{
              page: users.data.page - 1,
              pageSize: users.data.limit
            }}
            onPaginationModelChange={onPaginationModalChange}
            onSortModelChange={handleSortModelChange}
            slots={{
              noRowsOverlay: () => (
                <CustomNoRowsOverlay message={empty ? 'It seems there are no users in the system.' : undefined} />
              )
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Users
