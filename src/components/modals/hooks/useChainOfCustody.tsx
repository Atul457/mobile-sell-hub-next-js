import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IChainOfCustody } from '@/models/custody.model'
import { ReportService } from '@/services/client/Report.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialChainOfCustodySliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    chainOfCustodies: IChainOfCustody[]
  }
}

type IChainOfCustodyAction = { type: 'GET'; payload: Partial<IInitialChainOfCustodySliceState> }

const initialChainOfCustodyState: IInitialChainOfCustodySliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    limit: 100,
    chainOfCustodies: []
  }
}

function chainOfCustodyReducer(state: IInitialChainOfCustodySliceState, action: IChainOfCustodyAction) {
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

const useChainOfCustody = (reportId: string) => {
  const chainOfCustodyRef = useRef(initialChainOfCustodyState)
  const [empty, setEmpty] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [chainOfCustodies, dispatch] = useReducer(chainOfCustodyReducer, initialChainOfCustodyState)

  useEffect(() => {
    setEmpty(
      chainOfCustodies.data.page === 1 &&
        chainOfCustodies.data.chainOfCustodies.length === 0 &&
        !chainOfCustodies.data.query
    )
  }, [chainOfCustodies.data])

  const list = useCallback(async (args: Partial<IPaginationArgs>) => {
    try {
      const rs = new ReportService()
      const initialChainOfCustodyStateData = initialChainOfCustodyState.data

      const payload = {
        page: args.page ?? initialChainOfCustodyStateData.page,
        query: args.query ?? initialChainOfCustodyStateData.query,
        limit: args.limit ?? initialChainOfCustodyStateData.limit,
        sort: args.sort ?? initialChainOfCustodyStateData.sort,
        order: args.order ?? initialChainOfCustodyStateData.order
      }

      chainOfCustodyRef.current = {
        ...chainOfCustodyRef.current,
        status: 'loading',
        data: {
          ...chainOfCustodyRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: chainOfCustodyRef.current
      })

      const response = await rs.listChainOfCustody(payload, reportId)

      chainOfCustodyRef.current = {
        ...chainOfCustodyRef.current,
        status: 'fulfilled',
        data: {
          ...chainOfCustodyRef.current.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          chainOfCustodies:
            payload.page === 1
              ? response.data?.chainOfCustodies
              : [...chainOfCustodyRef.current.data.chainOfCustodies, ...response.data?.chainOfCustodies]
        }
      }

      dispatch({
        type: 'GET',
        payload: chainOfCustodyRef.current
      })
    } catch (error) {
      chainOfCustodyRef.current = {
        ...chainOfCustodyRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: chainOfCustodyRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: IChainOfCustody) => {
    chainOfCustodyRef.current = {
      ...chainOfCustodyRef.current,
      data: {
        ...chainOfCustodies.data,
        chainOfCustodies: [data, ...chainOfCustodyRef.current.data.chainOfCustodies],
        totalCount: chainOfCustodyRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: chainOfCustodyRef.current
    })
  }

  const update = (index: number, data: IChainOfCustody) => {
    const chainOfCustodies_ = [...chainOfCustodyRef.current.data.chainOfCustodies]
    chainOfCustodies_[index] = data
    chainOfCustodyRef.current = {
      ...chainOfCustodyRef.current,
      data: {
        ...chainOfCustodies.data,
        chainOfCustodies: chainOfCustodies_
      }
    }
    dispatch({
      type: 'GET',
      payload: chainOfCustodyRef.current
    })
  }

  const onSelect = (index: number | null) => setSelected(index)

  const onSearch = useCallback(
    (query: string) => {
      list({
        query,
        page: 1
      })
    },
    [list]
  )

  return {
    empty,
    update,
    push,
    chainOfCustodies,
    list,
    onSearch,
    selected,
    onSelect
  }
}

export default useChainOfCustody
