import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { ITransaction } from '@/models/transaction.model'
import { TransactionService } from '@/services/client/Transaction.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialTransactionSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    transactions: ITransaction[]
    status: ITransaction['status'] | '-1'
  }
}

type IProfilesAction = { type: 'GET'; payload: Partial<IInitialTransactionSliceState> }

type ICPaginationArgs = IPaginationArgs & {
  status: ITransaction['status'] | '-1'
}

const initialProfilesState: IInitialTransactionSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    transactions: [],
    status: '-1'
  }
}

function transactionsReducer(state: IInitialTransactionSliceState, action: IProfilesAction) {
  switch (action.type) {
    case 'GET':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

type IUserProfilesProps = {
  userId: string
}

const useTransactions = (props?: IUserProfilesProps) => {
  const transactionsRef = useRef(initialProfilesState)

  const [empty, setEmpty] = useState(false)
  const [userId] = useState(props?.userId ?? '')
  const [transactions, dispatch] = useReducer(transactionsReducer, initialProfilesState)

  useEffect(() => {
    setEmpty(transactions.data.page === 1 && transactions.data.transactions.length === 0 && !transactions.data.query)
  }, [transactions.data])

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const ps = new TransactionService()
      const currentProfilesStateData = transactionsRef.current.data

      const payload = {
        page: args.page ?? currentProfilesStateData.page,
        query: args.query ?? currentProfilesStateData.query,
        limit: args.limit ?? currentProfilesStateData.limit,
        sort: args.sort ?? currentProfilesStateData.sort,
        order: args.order ?? currentProfilesStateData.order,
        status: args.status ?? currentProfilesStateData.status,
        ...(userId && { userId })
      }

      transactionsRef.current = {
        ...transactionsRef.current,
        status: 'loading',
        data: {
          ...transactionsRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: transactionsRef.current
      })

      const response = await ps.list(payload)

      transactionsRef.current = {
        ...transactionsRef.current,
        status: 'fulfilled',
        data: {
          ...transactions.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          transactions: response.data?.transactions
        }
      }

      dispatch({
        type: 'GET',
        payload: transactionsRef.current
      })
    } catch (error) {
      transactionsRef.current = {
        ...transactionsRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: transactionsRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: ITransaction) => {
    transactionsRef.current = {
      ...transactionsRef.current,
      data: {
        ...transactions.data,
        transactions: [data, ...transactionsRef.current.data.transactions],
        totalCount: transactionsRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: transactionsRef.current
    })
  }

  const update = (index: number, data: ITransaction) => {
    const transactions = [...transactionsRef.current.data.transactions]
    transactions[index] = data
    transactionsRef.current = {
      ...transactionsRef.current,
      data: {
        ...transactionsRef.current.data,
        transactions
      }
    }
    dispatch({
      type: 'GET',
      payload: transactionsRef.current
    })
  }

  const onSearch = useCallback(
    (query: string) => {
      list({
        query,
        page: 1
      })
    },
    [list]
  )

  const delete_ = (index: number) => {
    const transactions = [...transactionsRef.current.data.transactions]
    transactions.splice(index, 1)
    transactionsRef.current = {
      ...transactionsRef.current,
      data: {
        ...transactionsRef.current.data,
        transactions,
        totalCount: transactionsRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: transactionsRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    transactions,
    list,
    delete: delete_
  }
}

export default useTransactions
