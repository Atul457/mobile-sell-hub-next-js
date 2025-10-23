import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IQrPopulated } from '@/models/qr.model'
import { QrService } from '@/services/client/Qr.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialQrsSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    qrs: IQrPopulated[]
    status: IQrPopulated['status'] | -1
  }
}

type IQrsAction = { type: 'GET'; payload: Partial<IInitialQrsSliceState> }

type ICPaginationArgs = IPaginationArgs & {
  status: IQrPopulated['status'] | -1
}

const initialQrsState: IInitialQrsSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    qrs: [],
    status: -1
  }
}

function qrsReducer(state: IInitialQrsSliceState, action: IQrsAction) {
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

const useQrs = () => {
  const qrsRef = useRef(initialQrsState)
  const [empty, setEmpty] = useState(false)
  const [qrs, dispatch] = useReducer(qrsReducer, initialQrsState)

  useEffect(() => {
    setEmpty(qrs.data.page === 1 && qrs.data.qrs.length === 0 && !qrs.data.query)
  }, [qrs.data])

  const getListPayload = (args: Partial<ICPaginationArgs>) => {
    const currentQrsStateData = qrsRef.current.data
    const payload = {
      page: args.page ?? currentQrsStateData.page,
      query: args.query ?? currentQrsStateData.query,
      limit: args.limit ?? currentQrsStateData.limit,
      sort: args.sort ?? currentQrsStateData.sort,
      order: args.order ?? currentQrsStateData.order,
      status: args.status ?? currentQrsStateData.status
    }
    return payload
  }

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const qs = new QrService()

      const payload = getListPayload(args)

      qrsRef.current = {
        ...qrsRef.current,
        status: 'loading',
        data: {
          ...qrsRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: qrsRef.current
      })

      const response = await qs.list(payload)

      qrsRef.current = {
        ...qrsRef.current,
        status: 'fulfilled',
        data: {
          ...qrs.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          qrs: response.data?.qrs
        }
      }

      dispatch({
        type: 'GET',
        payload: qrsRef.current
      })
    } catch (error) {
      qrsRef.current = {
        ...qrsRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: qrsRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: IQrPopulated) => {
    qrsRef.current = {
      ...qrsRef.current,
      data: {
        ...qrs.data,
        qrs: [data, ...qrsRef.current.data.qrs],
        totalCount: qrsRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: qrsRef.current
    })
  }

  const update = (index: number, data: IQrPopulated) => {
    const qrs = [...qrsRef.current.data.qrs]
    qrs[index] = data
    qrsRef.current = {
      ...qrsRef.current,
      data: {
        ...qrsRef.current.data,
        qrs
      }
    }
    dispatch({
      type: 'GET',
      payload: qrsRef.current
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
    const qrs = [...qrsRef.current.data.qrs]
    qrs.splice(index, 1)
    qrsRef.current = {
      ...qrsRef.current,
      data: {
        ...qrsRef.current.data,
        qrs,
        totalCount: qrsRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: qrsRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    qrs,
    list,
    getListPayload,
    delete: delete_
  }
}

export default useQrs
