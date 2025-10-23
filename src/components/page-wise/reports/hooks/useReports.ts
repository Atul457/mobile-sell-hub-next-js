import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IReportPopulated } from '@/models/report.model'
import { ReportService } from '@/services/client/Report.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialReportsSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    reports: IReportPopulated[]
    status: IReportPopulated['status'] | -1
  }
}

type IReportsAction = { type: 'GET'; payload: Partial<IInitialReportsSliceState> }

type ICPaginationArgs = IPaginationArgs & {
  status: IReportPopulated['status'] | -1
}

const initialReportsState: IInitialReportsSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    reports: [],
    status: -1
  }
}

function reportsReducer(state: IInitialReportsSliceState, action: IReportsAction) {
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

type IReportsProps = {
  userId?: string
  profileId?: string
}

const useReports = (props: IReportsProps) => {
  const reportsRef = useRef(initialReportsState)

  const [empty, setEmpty] = useState(false)
  const [userId] = useState(props?.userId ?? '')
  const [profileId] = useState(props?.profileId ?? '')
  const [reports, dispatch] = useReducer(reportsReducer, initialReportsState)

  useEffect(() => {
    setEmpty(reports.data.page === 1 && reports.data.reports.length === 0 && !reports.data.query)
  }, [reports.data])

  const getListPayload = (args: Partial<ICPaginationArgs>) => {
    const currentReportsStateData = reportsRef.current.data
    const payload = {
      page: args.page ?? currentReportsStateData.page,
      query: args.query ?? currentReportsStateData.query,
      limit: args.limit ?? currentReportsStateData.limit,
      sort: args.sort ?? currentReportsStateData.sort,
      order: args.order ?? currentReportsStateData.order,
      status: args.status ?? currentReportsStateData.status,
      ...(userId && { userId }),
      ...(profileId && { profileId })
    }
    return payload
  }

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const rs = new ReportService()
      const payload = getListPayload(args)

      reportsRef.current = {
        ...reportsRef.current,
        status: 'loading',
        data: {
          ...reportsRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: reportsRef.current
      })

      const response = await rs.list(payload)

      reportsRef.current = {
        ...reportsRef.current,
        status: 'fulfilled',
        data: {
          ...reports.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          reports: response.data?.reports
        }
      }

      dispatch({
        type: 'GET',
        payload: reportsRef.current
      })
    } catch (error) {
      reportsRef.current = {
        ...reportsRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: reportsRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: IReportPopulated) => {
    reportsRef.current = {
      ...reportsRef.current,
      data: {
        ...reports.data,
        reports: [data, ...reportsRef.current.data.reports],
        totalCount: reportsRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: reportsRef.current
    })
  }

  const update = (reportId: string, data: IReportPopulated) => {
    const reports = [...reportsRef.current.data.reports]
    reports[reports.findIndex(r => r._id === reportId)] = data
    reportsRef.current = {
      ...reportsRef.current,
      data: {
        ...reportsRef.current.data,
        reports
      }
    }
    dispatch({
      type: 'GET',
      payload: reportsRef.current
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
    const reports = [...reportsRef.current.data.reports]
    reports.splice(index, 1)
    reportsRef.current = {
      ...reportsRef.current,
      data: {
        ...reportsRef.current.data,
        reports,
        totalCount: reportsRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: reportsRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    reports,
    list,
    getListPayload,
    delete: delete_
  }
}

export default useReports
