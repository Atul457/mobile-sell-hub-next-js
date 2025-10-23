import { Box, IconButton, Link, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import CommonChip from '@/components/common/CommonChip'
import UserPreview from '@/components/user/UserPreview'

import { IQr, IQrPopulated } from '@/models/qr.model'
import { helpers } from '@/utils/helpers'
import { utils } from '@/utils/utils'

const NUMERIC_STATUS = utils.CONST.QR.NUMERIC_STATUS
const { VALUE_NOT_PROVIDED } = utils.CONST.APP_CONST

type IQrColumns = {
  onViewButtonClick: (qr: IQrPopulated) => void
  onCopyButtonClick: (qr: IQrPopulated) => void
  permissions: ReturnType<typeof utils.helpers.role.getPermissions>
}

export const qrsColumns = (props: IQrColumns): GridColDef[] =>
  helpers.getDataGridColumnsWithSpaces([
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'QR Codes',
      field: 'qrCode',
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
            title={params.row.qrCode}
          >
            {params.row.qrCode}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.3,
      minWidth: 150,
      headerName: 'Used By',
      field: 'profile.firstName',
      sortable: true,
      renderCell: (params: GridRenderCellParams) =>
        params.row.usedBy ? (
          <UserPreview
            type='user'
            variant='data-grid'
            user={{
              ...params.row.usedBy,
              email: undefined
            }}
          />
        ) : (
          <Typography
            variant='body2'
            sx={{
              paddingInlineStart: 2,
              color: 'text.primary',
              fontSize: theme => theme.typography.body2.fontSize,
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {VALUE_NOT_PROVIDED}
          </Typography>
        )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Used On',
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
          title={
            params.row.usedAt ? utils.date.formatDate(params.row.usedAt, true) : utils.helpers.getValue(params.row.usedAt)
          }
        >
          {params.row.usedAt ? utils.date.formatDate(params.row.usedAt, true) : utils.helpers.getValue(params.row.usedAt)}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Status',
      field: 'status',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <CommonChip
          variant={utils.helpers.qr.getQrStatusVariant(params.row.status)}
          label={NUMERIC_STATUS[params.row.status as IQr['status']]}
        />
      )
    },

    ...((props.permissions.read) ? [
      {
        flex: 0.1,
        minWidth: 100,
        headerName: 'Actions',
        field: 'actions',
        cellClassName: 'flex justify-start items-center',
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Box
            // onClick={() => props.onViewButtonClick(params.row)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <IconButton className='text-textPrimary' onClick={() => props.onCopyButtonClick(params.row)}>
              <i className='tabler-copy text-xl cursor-pointer hover:text-[var(--mui-palette-hyperlink-main)]' />
            </IconButton>
            {params.row.reportId ? (
              <Link href={`/reports/${params.row.reportId}`} className='inline-flex' title='View reports'>
                <IconButton
                  sx={{
                    color: 'text.primary'
                  }}
                >
                  <i className='tabler-eye text-[22px] hover:text-[var(--mui-palette-hyperlink-main)] transition-all'></i>
                </IconButton>
              </Link >
            ) : null}
          </Box >
        )
      }] : []) as GridColDef<IQrColumns>[]
  ] as GridColDef<IQrColumns>[]
  )

