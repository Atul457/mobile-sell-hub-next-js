import { Box, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Link from 'next/link'

import UserPreview from '@/components/user/UserPreview'

import { IProfile } from '@/models/profile.model'
import { utils } from '@/utils/utils'

const NUMERIC_GENDER_TYPES = utils.CONST.USER.NUMERIC_GENDER_TYPES
const VALUE_NOT_PROVIDED = utils.CONST.APP_CONST.VALUE_NOT_PROVIDED

type IProfilesColumns = {
  for?: 'allexamineeId',
  permissions: ReturnType<typeof utils.helpers.role.getPermissions>
}

export const profilesColumns = (props: IProfilesColumns): GridColDef[] => {
  const forAllExamineesId = props.for === 'allexamineeId'

  return [
    ...(forAllExamineesId
      ?
      [{
        flex: 0.3,
        minWidth: 150,
        headerName: 'Examinee ID',
        field: 'pid',
        sortable: false,
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
              title={params.row.pid}
            >
              {params.row.pid}
            </Typography>
          </Box>
        )
      }] : []),

    {
      flex: 0.3,
      minWidth: 200,
      headerName: 'Name',
      field: 'firstName',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => <UserPreview type='profile' user={params.row} />
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
            title={
              params.row.phoneNumber ? utils.number.formatNumber(params.row.phoneNumber)?.toString() : VALUE_NOT_PROVIDED
            }
          >
            {params.row.phoneNumber ? utils.number.formatNumber(params.row.phoneNumber) : VALUE_NOT_PROVIDED}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Gender',
      field: 'gender',
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
            {utils.helpers.getValue(NUMERIC_GENDER_TYPES?.[params.row.gender as Exclude<IProfile['gender'], undefined>])}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Date of Birth',
      field: 'dob',
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
            title={params.row.dob ? utils.date.formatDate(params.row.dob)?.toString() : VALUE_NOT_PROVIDED}
          >
            {params.row.dob ? utils.date.formatDate(params.row.dob)?.toString() : VALUE_NOT_PROVIDED}
          </Typography>
        </Box>
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

    ...(props.permissions.read ? [{
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
          <Link href={`/profiles/${params.row.id}`} className='inline-flex'>
            <i className='tabler-eye text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
          </Link>
        </Box>
      )
    }]
      : []) as GridColDef<IProfilesColumns>[]
  ] as GridColDef<IProfilesColumns>[]
}
