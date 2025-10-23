import { Box, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import CommonChip from '@/components/common/CommonChip'
import UserPreview from '@/components/user/UserPreview'

import { ITransaction } from '@/models/transaction.model'
import { IUser } from '@/models/user.model'
import { helpers } from '@/utils/helpers'
import { utils } from '@/utils/utils'

type ITransactionColumns = {
  for?: 'alltransactions'
  permissions: ReturnType<typeof utils.helpers.role.getPermissions>
}
const NUMERIC_STATUS = utils.CONST.TRANSACTION.NUMERIC_STATUS
const NUMERIC_ROLE_TYPES = utils.CONST.USER.NUMERIC_ROLE_TYPES

export const tranactionsColumns = (props: ITransactionColumns): GridColDef[] => {
  const forAllTransactions = props.for === 'alltransactions'

  return helpers.getDataGridColumnsWithSpaces([
    {
      flex: 0.3,
      minWidth: 200,
      headerName: 'Name',
      field: 'firstName',
      sortable: true,
      renderCell: (params: GridRenderCellParams) => (
        <UserPreview
          type='user'
          variant='small'
          containerProps={{
            sx: {
              paddingTop: '5px'
            }
          }}
          user={{
            ...params.row.user,
            email: undefined
          }}
        />
      )
    },
    {
      flex: 0.3,
      minWidth: 200,
      headerName: 'Transaction Id ',
      field: 'transactionId',
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
            title={params.row.transactionId}
          >
            {params.row.transactionId}
          </Typography>
        </Box>
      )
    },

    {
      flex: 0.3,
      minWidth: 150,
      headerName: 'Amount Paid',
      field: 'amountPaid',
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
            ${utils.helpers.getValue(params.row.amountPaid)}
          </Typography>
        </Box>
      )
    },
    ...(forAllTransactions
      ? [
        {
          flex: 0.2,
          minWidth: 150,
          headerName: 'Role',
          field: 'role',
          sortable: false,
          renderCell: (params: GridRenderCellParams) => (
            <CommonChip
              variant='primary'
              label={utils.helpers.getValue(
                NUMERIC_ROLE_TYPES?.[params.row.user.role as Exclude<IUser['role'], undefined>]
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
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <CommonChip
          variant={utils.helpers.transaction.getTransactionStatusVariant(params.row.status)}
          label={NUMERIC_STATUS[params.row.status as ITransaction['status']]}
        />
      )
    },
    {
      flex: 0.4,
      minWidth: 150,
      headerName: 'Transaction Date',
      field: 'transactionDate',
      sortable: false,
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
          title={utils.date.formatDate(params.row.transactionDate)}
        >
          {utils.date.formatDate(params.row.transactionDate)}
        </Typography>
      )
    }
  ])
}
