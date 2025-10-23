import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IUser } from '@/models/user.model'
import { UsersService } from '@/services/client/Users.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialUsersSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    users: IUser[]
    type: IUser['type'] | 0
  }
}

type IUsersAction = { type: 'GET'; payload: Partial<IInitialUsersSliceState> }

type ICPaginationArgs = IPaginationArgs & {
  type: IUser['type'] | 0
  role?: IUser['roleId']
}

const initialUsersState: IInitialUsersSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    users: [],
    type: 0
  }
}

function usersReducer(state: IInitialUsersSliceState, action: IUsersAction) {
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
  type?: ICPaginationArgs["type"]
}

const useUsers = (props: IReportsProps) => {
  const usersRef = useRef(initialUsersState)
  const [empty, setEmpty] = useState(false)
  const [userId] = useState(props?.userId)
  const [type] = useState(props?.type)
  const [users, dispatch] = useReducer(usersReducer, initialUsersState)

  useEffect(() => {
    setEmpty(users.data.page === 1 && users.data.users.length === 0 && !users.data.query)
  }, [users.data])

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const us = new UsersService()
      const currentUsersStateData = usersRef.current.data

      const payload = {
        page: args.page ?? currentUsersStateData.page,
        query: args.query ?? currentUsersStateData.query,
        limit: args.limit ?? currentUsersStateData.limit,
        sort: args.sort ?? currentUsersStateData.sort,
        order: args.order ?? currentUsersStateData.order,
        type: type ?? args.type ?? currentUsersStateData.type,
        ...(userId && { userId }),
        ...(args.role && { roleId: args.role })
      }

      usersRef.current = {
        ...usersRef.current,
        status: 'loading',
        data: {
          ...usersRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: usersRef.current
      })

      const response = await us.list(payload)

      usersRef.current = {
        ...usersRef.current,
        status: 'fulfilled',
        data: {
          ...users.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          users: response.data?.users
        }
      }

      dispatch({
        type: 'GET',
        payload: usersRef.current
      })
    } catch (error) {
      usersRef.current = {
        ...usersRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: usersRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: IUser) => {
    usersRef.current = {
      ...usersRef.current,
      data: {
        ...users.data,
        users: [data, ...usersRef.current.data.users],
        totalCount: usersRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: usersRef.current
    })
  }

  const update = (usersId: string, data: IUser) => {
    const users = [...usersRef.current.data.users]
    users[users.findIndex(r => r._id === usersId)] = data
    usersRef.current = {
      ...usersRef.current,
      data: {
        ...usersRef.current.data,
        users
      }
    }
    dispatch({
      type: 'GET',
      payload: usersRef.current
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
    const users = [...usersRef.current.data.users]
    users.splice(index, 1)
    usersRef.current = {
      ...usersRef.current,
      data: {
        ...usersRef.current.data,
        users,
        totalCount: usersRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: usersRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    users,
    list,
    delete: delete_
  }
}

export default useUsers
