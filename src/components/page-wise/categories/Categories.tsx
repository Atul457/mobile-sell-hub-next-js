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
import { ICategory } from '@/models/category.model'
import { utils } from '@/utils/utils'

import { categoriesColumns } from './categoriesColumns'
import CategoryDrawer from './components/CategoryDrawer'
import useCategories from './hooks/useCategories'

const { NUMERIC_STATUS, STATUS } = utils.CONST.CATEGORY

type ICategoriesProps = {}

const Categories = (_: ICategoriesProps) => {
  const { categories, list, onSearch: onSearch_, update, empty, push } = useCategories()

  const selectedCategoryRef = useRef<ICategory | null>(null)

  const [selected, setSelected] = useState<ICategory | null>(null)
  const [create, setCreate] = useState(false)
  const { permissions: _permissions } = useConfigProviderContext()
  const [categoryPermissions] = useState({
    create: true,
    update: true,
    read: true,
    delete: true
  })

  // console.debug({ permissions, categoryPermissions })

  const dispatch = useAppDispatch()

  const categoriesColumns_ = useMemo(() => {
    return categoriesColumns({
      permissions: categoryPermissions,
      onEditClick: category => {
        selectedCategoryRef.current = category
        utils.dom.onModalOpen()
        setSelected(category)
      }
    })
  }, [categoryPermissions])

  useEffect(() => {
    list({})
  }, [dispatch])

  // Handle type change
  const handleTypeChange = (status: ICategory['status'] | -1) => {
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

  const onUpdate = (category: ICategory) => {
    if (selectedCategoryRef.current) {
      update(
        selectedCategoryRef.current?._id as string,
        {
          ...selectedCategoryRef.current,
          ...category
        } as ICategory
      )
    }
  }

  const onCreate = (category: ICategory) => {
    push({
      ...category,
      id: category._id
    } as ICategory)
  }

  // Modal close handler
  const onClose = () => {
    utils.dom.onModalClose()
    setSelected(null)
    setCreate(false)
  }

  return (
    <>
      <CategoryDrawer create={create} onUpdate={onUpdate} onCreate={onCreate} category={selected} onClose={onClose} />

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
              List of All Categories
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
                      handleTypeChange(Number(e.target.value) as ICategory['status'])
                    }
                  }}
                  label={null}
                  sx={{
                    paddingInlineEnd: 0,
                    width: 200
                  }}
                  value={categories.data.status}
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
                placeholder='Enter category name or description'
              />

              <Button onClick={() => setCreate(true)}>Add</Button>
            </div>
          }
        />
        <CardContent sx={{ padding: 0 }}>
          <DataGrid
            loading={categories.status === 'loading'}
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
            rows={categories.data?.categories}
            columns={categoriesColumns_}
            rowCount={categories.data.totalCount}
            disableColumnMenu
            pageSizeOptions={[10, 25, 50]}
            paginationMode='server'
            paginationModel={{
              page: categories.data.page - 1,
              pageSize: categories.data.limit
            }}
            onPaginationModelChange={onPaginationModalChange}
            onSortModelChange={handleSortModelChange}
            slots={{
              noRowsOverlay: () => (
                <CustomNoRowsOverlay message={empty ? 'It seems there are no categories in the system.' : undefined} />
              )
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}

export default Categories
