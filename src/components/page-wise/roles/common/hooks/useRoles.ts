import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IRolePopulated } from '@/models/role.model'
import { RoleService } from '@/services/client/Role.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialRoleSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    roles: IRolePopulated[]
    type: IRolePopulated['type']
  }
}

type IRoleAction = { type: 'GET'; payload: Partial<IInitialRoleSliceState> }

type ICPaginationArgs = IPaginationArgs & {
  type: IRolePopulated['type']
  role?: IRolePopulated['roleId']
}

const initialRolesState: IInitialRoleSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    roles: [],
    type: 0
  }
}

function rolesReducer(state: IInitialRoleSliceState, action: IRoleAction) {
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
  type: IRolePopulated['type']
}

const useRoles = (props: IReportsProps) => {
  const rolesRef = useRef(initialRolesState)
  const [type] = useState(props?.type)
  const [empty, setEmpty] = useState(false)
  const [roles, dispatch] = useReducer(rolesReducer, initialRolesState)

  useEffect(() => {
    setEmpty(roles.data.page === 1 && roles.data.roles.length === 0 && !roles.data.query)
  }, [roles.data])

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const rs = new RoleService()
      const currentRoleStateData = rolesRef.current.data

      const payload = {
        page: args.page ?? currentRoleStateData.page,
        query: args.query ?? currentRoleStateData.query,
        limit: args.limit ?? currentRoleStateData.limit,
        sort: args.sort ?? currentRoleStateData.sort,
        order: args.order ?? currentRoleStateData.order,
        type: args.type ?? currentRoleStateData.type,
        role: args.role ?? currentRoleStateData.roles,
        ...(type && { type })
      }

      rolesRef.current = {
        ...rolesRef.current,
        status: 'loading',
        data: {
          ...rolesRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: rolesRef.current
      })

      const response = await rs.list(payload)

      rolesRef.current = {
        ...rolesRef.current,
        status: 'fulfilled',
        data: {
          ...roles.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          roles: response.data?.roles
        }
      }

      dispatch({
        type: 'GET',
        payload: rolesRef.current
      })
    } catch (error) {
      rolesRef.current = {
        ...rolesRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: rolesRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: IRolePopulated) => {
    rolesRef.current = {
      ...rolesRef.current,
      data: {
        ...roles.data,
        roles: [data, ...rolesRef.current.data.roles],
        totalCount: rolesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: rolesRef.current
    })
  }

  const update = (roleId: string, data: IRolePopulated) => {
    const roles = [...rolesRef.current.data.roles]
    roles[roles.findIndex(r => r._id === roleId)] = data
    rolesRef.current = {
      ...rolesRef.current,
      data: {
        ...rolesRef.current.data,
        roles
      }
    }
    dispatch({
      type: 'GET',
      payload: rolesRef.current
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
    const roles = [...rolesRef.current.data.roles]
    roles.splice(index, 1)
    rolesRef.current = {
      ...rolesRef.current,
      data: {
        ...rolesRef.current.data,
        roles,
        totalCount: rolesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: rolesRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    roles,
    list,
    delete: delete_
  }
}

export default useRoles
