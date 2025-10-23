'use client'

import { Card, CardContent, CardHeader, FormControl, MenuItem, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridSortModel } from '@mui/x-data-grid'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import CustomNoRowsOverlay from '@/components/common/CommonCustomMessage'

import { useAppDispatch } from '@/store/hooks/hooks'

import CustomTextField from '@/@core/components/mui/TextField'
import themeConfig from '@/configs/themeConfig'
import { useConfigProviderContext } from '@/contexts/ConfigProvider'
import { ITransaction } from '@/models/transaction.model'
import { utils } from '@/utils/utils'

import useTransactions from './hooks/useTransactions'
import { tranactionsColumns } from './transactionColumn'

const { NUMERIC_STATUS, STATUS } = utils.CONST.TRANSACTION

type ITransactionsProps = {
  userId?: string
}

const Transactions = (props: ITransactionsProps) => {
  const params = useSearchParams()

  const {
    transactions,
    list,
    onSearch: onSearch_,
    empty
  } = useTransactions(props.userId ? { userId: props.userId } : undefined)

  const [searchValue] = useState(params.get('search') ?? null)
  const { permissions } = useConfigProviderContext()
  const [transactionPermissions] = useState(utils.helpers.role.getPermissions("transaction", permissions));

  const dispatch = useAppDispatch()

  // Handle status change
  const handleTypeChange = (status: ITransaction['status'] | '-1') => {
    list({ status })
  }

  const onSearch = useCallback(utils.debounce(query => {
    onSearch_(query)
  }, 300), [])


  useEffect(() => {
    list({})
  }, [dispatch])

  useEffect(() => {
    if (searchValue) {
      onSearch(searchValue)
    }
  }, [searchValue])

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

  const transactionsColumn_ = useMemo(() => {
    return tranactionsColumns({
      permissions: transactionPermissions,
      ...(props.userId && {
        for: 'alltransactions'
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
            {props.userId ? 'Transactions' : 'List of all Transactions'}
          </Typography>
        }
        action={
          <div className='flex items-center flex-wrap space-x-2'>
            <FormControl size='small' sx={{ width: { xs: '100%', md: 200 } }}>
              <CustomTextField
                select
                type='select'
                SelectProps={{
                  MenuProps: themeConfig.components.select.MenuProps,
                  multiple: false,
                  value: transactions.data.status,
                  onChange: e => handleTypeChange(String(e.target.value) as ITransaction['status'])
                }}
                label={null}
                sx={{ paddingInlineEnd: 0, width: '100%' }}
                value={transactions.data.status}
                onChange={e => handleTypeChange(String(e.target.value) as ITransaction['status'])}
              >
                <MenuItem value='-1'>All</MenuItem>
                <MenuItem value={STATUS.CANCEL}>{NUMERIC_STATUS[STATUS.CANCEL]}</MenuItem>
                <MenuItem value={STATUS.PROCESSING}>{NUMERIC_STATUS[STATUS.PROCESSING]}</MenuItem>
                <MenuItem value={STATUS.REQUIRES_ACTION}>{NUMERIC_STATUS[STATUS.REQUIRES_ACTION]}</MenuItem>
                <MenuItem value={STATUS.REQUIRES_CAPTURE}>{NUMERIC_STATUS[STATUS.REQUIRES_CAPTURE]}</MenuItem>
                <MenuItem value={STATUS.REQUIRES_CONFIRMATION}>{NUMERIC_STATUS[STATUS.REQUIRES_CONFIRMATION]}</MenuItem>
                <MenuItem value={STATUS.REQUIRES_PAYMENT_METHOD}>
                  {NUMERIC_STATUS[STATUS.REQUIRES_PAYMENT_METHOD]}
                </MenuItem>
                <MenuItem value={STATUS.SUCCEEDED}>{NUMERIC_STATUS[STATUS.SUCCEEDED]}</MenuItem>
              </CustomTextField>
            </FormControl>
            <CustomTextField
              label={null}
              sx={{
                width: 300
              }}
              defaultValue={searchValue ?? ''}
              onChange={e => onSearch(e.target.value)}
              name='userName'
              placeholder='Search by name or id '
            />
          </div>
        }
      />
      <CardContent sx={{ padding: 0 }}>
        <DataGrid
          loading={transactions.status === 'loading'}
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
          rows={transactions.data?.transactions}
          columns={transactionsColumn_}
          rowCount={transactions.data.totalCount}
          disableColumnMenu
          pageSizeOptions={[10, 25, 50]}
          paginationMode='server'
          paginationModel={{
            page: transactions.data.page - 1,
            pageSize: transactions.data.limit
          }}
          onPaginationModelChange={onPaginationModalChange}
          onSortModelChange={handleSortModelChange}
          slots={{
            noRowsOverlay: () => (
              <CustomNoRowsOverlay message={empty ? 'There are currently no transactions to display.' : undefined} />
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

export default Transactions
