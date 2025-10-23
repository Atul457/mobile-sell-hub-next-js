'use client'

import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'

import { useAppDispatch } from '@/store/hooks/hooks'

import CustomTextField from '@/@core/components/mui/TextField'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'
import { utils } from '@/utils/utils'

import useProfiles from './hooks/useProfiles'
import { profilesColumns } from './profilesColumns'

type IProfilesProps = {
  userId: string
}

const Profiles = (props: IProfilesProps) => {
  const { profiles, list, onSearch: onSearch_ } = useProfiles(props.userId ? { userId: props.userId } : undefined)
  const { permissions } = useConfigProviderContext()
  const [profilePermissions] = useState(utils.helpers.role.getPermissions("profile", permissions));

  const dispatch = useAppDispatch()

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
  const profilesColumns_ = useMemo(() => {
    return profilesColumns({
      permissions: profilePermissions,
      ...(props.userId && {
        for: 'allexamineeId'
      })
    })
  }, [props.userId])

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
            Examinees
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
              name='userName'
              placeholder='Enter name or email'
            />
          </div>
        }
      />
      <CardContent sx={{ padding: 0 }}>
        <DataGrid
          loading={profiles.status === 'loading'}
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
          rows={profiles.data?.profiles}
          columns={profilesColumns_}
          rowCount={profiles.data.totalCount}
          disableColumnMenu
          pageSizeOptions={[10, 25, 50]}
          paginationMode='server'
          paginationModel={{
            page: profiles.data.page - 1,
            pageSize: profiles.data.limit
          }}
          onPaginationModelChange={onPaginationModalChange}
          onSortModelChange={handleSortModelChange}
        />
      </CardContent>
    </Card>
  )
}

export default Profiles
