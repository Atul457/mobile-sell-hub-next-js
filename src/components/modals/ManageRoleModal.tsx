// React Imports

// MUI Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, MenuItem, Typography } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import LabelStyled from '@/@core/components/mui/Label'
// Third-party Imports
import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { useModal } from '@/contexts/ModalProvider'
import { IRolePermission } from '@/models/rolePermission.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { RoleService } from '@/services/client/Role.service'
import { utils } from '@/utils/utils'

import CommonButton from '../common/CommonButton'
import CommonCheckbox from '../common/CommonCheckbox'
import CommonDialog from '../common/CommonDialog'

type FormData = (typeof commonSchemas.addRole)['__outputType']

const USER = utils.CONST.ROLE.TYPES.USER
const { NUMERIC_BOOLEAN_STATUS, BOOLEAN_STATUS } = utils.CONST.APP_CONST

let modules: IRolePermission['module'][] = ['user', 'profile', 'report', 'qr', 'package', 'transaction', 'role', 'test']
const rolePermission: IRolePermission['actions'] = ['read', 'create', 'update', 'delete']
// let moduleLableMapping: Partial<Record<IRolePermission['module'], string>> = {
//   user: 'Platform Users',
//   profile: 'Examinee Profiles',
//   report: 'Reports',
//   qr: 'QR Management',
//   package: 'Package ',
//   transaction: 'Transactions',
//   role: 'Roles',
//   test: 'Test'
// }

const ManageRoleModal = () => {
  // States
  const [loading, setLoading] = useState(false)
  const [selectAll, setSelectAll] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
    watch,
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(commonSchemas.addRole),
    defaultValues: {
      name: '',
      type: USER,
      markDefault: BOOLEAN_STATUS.NO
    }
  })

  const isSubmitted_ = isSubmitted

  const modalContext = useModal()

  const manageRoles = modalContext.modals.manageRoles
  const forUser = manageRoles?.type === utils.CONST.ROLE.TYPES.USER
  const role = manageRoles?.data ?? null
  const view = manageRoles?.view ?? false

  useEffect(() => {
    const manageRoles_ = manageRoles?.data
    if (manageRoles_) {
      let { permissions = [], ...role } = manageRoles_
      let permissionsObj = {}
      const markDefault = (role.type === utils.CONST.ROLE.TYPES.USER ? role.defaultUserRole : role.defaultAdminRole)
        ? 1
        : 0
      permissions.forEach(currentPermission => {
        permissionsObj = {
          ...permissionsObj,
          [currentPermission.module]: {
            create: currentPermission.actions.includes('create'),
            read: currentPermission.actions.includes('read'),
            update: currentPermission.actions.includes('update'),
            delete: currentPermission.actions.includes('delete')
          }
        }
      })
      reset({
        ...role,
        markDefault,
        ...permissionsObj
      })
    } else {
      setValue('type', manageRoles?.type ?? USER)
    }
  }, [manageRoles?.data])

  useEffect(() => {
    let selectAll = false
    if (forUser) {
      const allUserPermissionsSelected = rolePermission.every(role => watch(`user.${role}.` as any))
      selectAll = allUserPermissionsSelected
    } else {
      const allPermissionsSelected = modules.every(module => {
        return rolePermission.every(role => watch(`${module}.${role}.` as any))
      })
      selectAll = allPermissionsSelected
    }
    setSelectAll(selectAll)
  }, [watch(), forUser, setSelectAll])

  const handleClose = () => modalContext.closeModal('manageRoles')

  const onSubmit: SubmitHandler<FormData> = async (credentials: FormData) => {
    setLoading(true)
    try {
      if (!role && view) {
        throw new Error('Role not found')
      }

      const roleId = role?._id as string

      const formattedPermissions: Record<string, string[]> = {}

      // Iterate through each module
      modules.forEach(module_ => {
        const selectedPermissions = rolePermission.filter(role => watch(`${module_}.${role}` as any))
        if (selectedPermissions.length > 0) {
          if (!(module_ != 'user' && forUser)) {
            formattedPermissions[module_] = selectedPermissions
          }
        }
      })

      const updatedCredentials = {
        ...credentials,
        permissions: formattedPermissions
      }

      const us = new RoleService()

      let response

      if (roleId) {
        response = await us.update(roleId, updatedCredentials)
        manageRoles?.onUpdate(response)
      } else {
        response = await us.create(updatedCredentials)
        manageRoles?.onCreate(response)
      }
      utils.toast.success({ message: response.message! })
      handleClose()
    } catch (error: any) {
      setLoading(false)
      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)

    modules.forEach(module_ => {
      rolePermission.forEach(role => {
        setValue(`${module_}.${role}` as any, !selectAll, {
          shouldValidate: isSubmitted_
        })
      })
    })
  }
  return (
    <CommonDialog open={true} onClose={handleClose}>
      <DialogTitle id='alert-dialog-title'>{manageRoles?.data ? 'Manage Role' : 'Create Role'}</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='space-y-7'>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Name'
                type='text'
                placeholder='Enter role name'
                {...(errors.name && {
                  error: true,
                  helperText: utils.string.capitalize(errors.name.message, {
                    capitalizeAll: false
                  })
                })}
              />
            )}
          />
          {/* !role && manageRoles?.type === utils.CONST.ROLE.TYPES.USER  */}
          {forUser ? (
            <Controller
              name='markDefault'
              control={control}
              render={({ field }) => {
                return (
                  <CustomTextField
                    {...field}
                    select
                    type='select'
                    SelectProps={{
                      MenuProps: themeConfig.components.select.MenuProps,
                      multiple: false
                    }}
                    defaultValue={1}
                    label='Default'
                    sx={{ paddingInlineEnd: 0, width: '100%' }}
                    {...(errors.markDefault && {
                      error: true,
                      helperText: utils.string.capitalize(errors.markDefault.message, {
                        capitalizeAll: false
                      })
                    })}
                  >
                    <MenuItem value={BOOLEAN_STATUS.NO}>{NUMERIC_BOOLEAN_STATUS[BOOLEAN_STATUS.NO]}</MenuItem>
                    <MenuItem value={BOOLEAN_STATUS.YES}>{NUMERIC_BOOLEAN_STATUS[BOOLEAN_STATUS.YES]}</MenuItem>
                  </CustomTextField>
                )
              }}
            />
          ) : null}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 4
            }}
          >
            <Typography
              variant='h6'
              sx={{
                minWidth: '100px',
                color: 'primary.main'
              }}
            >
              Role Permissions
            </Typography>
            <Box
              sx={{
                color: 'primary.main',
                fontSize: theme => theme.typography.fontSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography
                sx={{
                  // minWidth: '100px',
                  color: 'primary.main',
                  fontSize: theme => theme.typography.fontSize
                }}
              >
                Administrator Access
              </Typography>
              <Typography
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={handleSelectAll}
              >
                <CommonCheckbox checked={selectAll} onClick={handleSelectAll} />
                <Typography
                  sx={{
                    // minWidth: '100px',
                    color: 'primary.main',
                    fontSize: theme => theme.typography.fontSize
                  }}
                >
                  Select All
                </Typography>
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: 3
              }}
            >
              {modules.map((module_, moduleIndex) => {
                if (forUser && module_ != 'user') {
                  return null
                }
                const isReadChecked = watch(`${module_}.read` as any);
                return (
                  <Box
                    key={moduleIndex}
                    sx={{
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 3
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        minWidth: '100px',
                        color: 'primary.main',
                        fontSize: theme => theme.typography.fontSize
                      }}
                    >
                      {/* {utils.string.capitalize(moduleLableMapping[module_] ? moduleLableMapping[module_] : module_)} */}
                      {utils.string.capitalize(module_)}
                    </Typography>
                    <Box
                      className='flex'
                      sx={{
                        display: 'flex',
                        columnGap: 10
                      }}
                    >
                      {rolePermission.map((role, item) => {
                        const isReadRole = role === 'read';
                        const isDisabled = !isReadRole && !isReadChecked;
                        const checked = watch(`${module_}.${role}` as any) ?? false;
                        return (
                          <LabelStyled
                            key={item}
                            sx={{ color: 'primary.main', alignItems: 'center', marginBottom: 0, top: 0 }}
                          >
                            <Controller
                              control={control}
                              name={`${module_}.${role}` as any}
                              render={({ field }) => {
                                return (
                                  <CommonCheckbox
                                    checked={checked}
                                    onClick={() => {
                                      // Handle "View" (read) checkbox logic
                                      if (isReadRole) {
                                        // If "read" is unchecked, uncheck all others
                                        rolePermission.forEach((otherRole) => {
                                          if (otherRole !== 'read') {
                                            setValue(`${module_}.${otherRole}` as any, false, {
                                              shouldValidate: isSubmitted_,
                                            });
                                          }
                                        });
                                      }
                                      setValue(`${module_}.${role}` as any, !checked, {
                                        shouldValidate: isSubmitted_,
                                      });
                                    }}
                                    disabled={isDisabled}
                                    {...field}
                                  />
                                )
                              }}
                            />
                            {role === 'read' ? 'View' : utils.string.capitalize(role)}
                          </LabelStyled>
                        )
                      })}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </form>
      </DialogContent>
      {manageRoles?.view !== true ? (
        <DialogActions className='dialog-actions-dense'>
          <CommonButton
            type='button'
            variant='contained'
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            label={manageRoles?.data ? 'Update' : 'Create'}
          />
        </DialogActions>
      ) : null}
    </CommonDialog>
  )
}

export default ManageRoleModal
