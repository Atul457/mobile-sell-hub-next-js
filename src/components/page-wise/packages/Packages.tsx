'use client'

import { Button, Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid'
import { useEffect, useMemo, useRef, useState } from 'react'

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage'

// import AlertModal from '@/components/modals/AlertModal';
import { useAppDispatch } from '@/store/hooks/hooks'

import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'
import { IPackagePopulated } from '@/models/package.model'
import { utils } from '@/utils/utils'

import PackageDrawer from './components/PackageDrawer'
import usePackages from './hooks/usePackages'
import { packagesColumns } from './packagesColumns'

const { NUMERIC_STATUS, STATUS } = utils.CONST.PACKAGE

type IPackagesProps = {}

const Packages = (_: IPackagesProps) => {
  const { packages, list, onSearch: onSearch_, update, empty, push } = usePackages()

  const selectedPackageRef = useRef<IPackagePopulated | null>(null)

  const [selected, setSelected] = useState<IPackagePopulated | null>(null)
  const [create, setCreate] = useState(false)
  const { permissions } = useConfigProviderContext()
  const [packagePermissions] = useState(utils.helpers.role.getPermissions("package", permissions));


  // console.debug({ permissions, packagePermissions })

  const dispatch = useAppDispatch()

  const packagesColumns_ = useMemo(() => {
    return packagesColumns({
      permissions: packagePermissions,
      onEditClick: package_ => {
        selectedPackageRef.current = package_
        utils.dom.onModalOpen()
        setSelected(package_)
      }
    })
  }, [packagePermissions])

  useEffect(() => {
    list({})
  }, [dispatch])

  // Handle type change
  const handleTypeChange = (status: IPackagePopulated['status'] | -1) => {
    list({
      status
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

  const onUpdate = (package_: IPackagePopulated) => {
    if (selectedPackageRef.current) {
      if (package_.isDefault !== selectedPackageRef.current.isDefault) {
        list({})
      } else {
        update(
          selectedPackageRef.current?._id as string,
          {
            ...selectedPackageRef.current,
            ...package_
          } as IPackagePopulated
        )
      }
    }
  }

  const onCreate = (package_: IPackagePopulated) => {
    if (package_.isDefault) {
      list({})
    } else {
      push({
        ...package_,
        id: package_._id
      } as IPackagePopulated)
    }
  }

  // Modal close handler
  const onClose = () => {
    utils.dom.onModalClose()
    setSelected(null)
    setCreate(false)
  }

  return (
    <>
      <PackageDrawer create={create} onUpdate={onUpdate} onCreate={onCreate} package_={selected} onClose={onClose} />

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
              List of All Packages
            </Typography>
          }
          action={
            <div className='flex flex-wrap space-x-2'>
              <FormControl size='small'>
                <CustomTextField
                  select
                  type='select'
                  SelectProps={{
                    MenuProps: themeConfig.components.select.MenuProps,
                    multiple: false,
                    onChange: e => {
                      handleTypeChange(Number(e.target.value) as IPackagePopulated['status'])
                    }
                  }}
                  label={null}
                  sx={{
                    paddingInlineEnd: 0,
                    width: 200
                  }}
                  value={packages.data.status}
                  onChange={e => {
                    handleTypeChange(Number(e.target.value) as 0 | 1 | 2)
                  }}
                >
                  <MenuItem value={-1}>All</MenuItem>
                  <MenuItem value={STATUS.ACTIVE}>{NUMERIC_STATUS[STATUS.ACTIVE]}</MenuItem>
                  <MenuItem value={STATUS.INACTIVE}>{NUMERIC_STATUS[STATUS.INACTIVE]}</MenuItem>
                </CustomTextField>
              </FormControl>

              <CustomTextField
                label={null}
                sx={{
                  width: 300
                }}
                defaultValue=''
                onChange={e => onSearch(e.target.value)}
                name='name'
                placeholder='Enter package name'
              />

              <Button onClick={() => setCreate(true)}>Add</Button>
            </div>
          }
        />
        <CardContent sx={{ padding: 0 }}>
          <DataGrid
            loading={packages.status === 'loading'}
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
            rows={packages.data?.packages}
            columns={packagesColumns_}
            rowCount={packages.data.totalCount}
            disableColumnMenu
            pageSizeOptions={[10, 25, 50]}
            paginationMode='server'
            paginationModel={{
              page: packages.data.page - 1,
              pageSize: packages.data.limit
            }}
            onPaginationModelChange={onPaginationModalChange}
            onSortModelChange={handleSortModelChange}
            slots={{
              noRowsOverlay: () => (
                <CustomNoRowsOverlay message={empty ? 'It seems there are no packages in the system.' : undefined} />
              )
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Packages
