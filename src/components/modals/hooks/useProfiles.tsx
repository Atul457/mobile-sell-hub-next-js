import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IProfile } from '@/models/profile.model'
import { ProfileService } from '@/services/client/Profile.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialProfilessSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    profiles: IProfile[]
  }
}

type IUsersAction = { type: 'GET'; payload: Partial<IInitialProfilessSliceState> }

const initialUsersState: IInitialProfilessSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    profiles: []
  }
}

function profilesReducer(state: IInitialProfilessSliceState, action: IUsersAction) {
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

const useProfiles = () => {
  const profilesRef = useRef(initialUsersState)
  const [empty, setEmpty] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [profiles, dispatch] = useReducer(profilesReducer, initialUsersState)

  useEffect(() => {
    setEmpty(profiles.data.page === 1 && profiles.data.profiles.length === 0 && !profiles.data.query)
  }, [profiles.data])

  const list = useCallback(async (args: Partial<IPaginationArgs>) => {
    try {
      const ps = new ProfileService()
      const initialUsersStateData = initialUsersState.data

      const payload = {
        page: args.page ?? initialUsersStateData.page,
        query: args.query ?? initialUsersStateData.query,
        limit: args.limit ?? initialUsersStateData.limit,
        sort: args.sort ?? initialUsersStateData.sort,
        order: args.order ?? initialUsersStateData.order
      }

      profilesRef.current = {
        ...profilesRef.current,
        status: 'loading',
        data: {
          ...profilesRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: profilesRef.current
      })

      const response = await ps.list(payload)

      profilesRef.current = {
        ...profilesRef.current,
        status: 'fulfilled',
        data: {
          ...profilesRef.current.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          profiles:
            payload.page === 1 ? response.data?.users : [...profilesRef.current.data.profiles, ...response.data?.users]
        }
      }

      dispatch({
        type: 'GET',
        payload: profilesRef.current
      })
    } catch (error) {
      profilesRef.current = {
        ...profilesRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: profilesRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: IProfile) => {
    profilesRef.current = {
      ...profilesRef.current,
      data: {
        ...profiles.data,
        profiles: [data, ...profilesRef.current.data.profiles],
        totalCount: profilesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: profilesRef.current
    })
  }

  const update = (index: number, data: IProfile) => {
    const profiles_ = [...profilesRef.current.data.profiles]
    profiles_[index] = data
    profilesRef.current = {
      ...profilesRef.current,
      data: {
        ...profiles.data,
        profiles: profiles_
      }
    }
    dispatch({
      type: 'GET',
      payload: profilesRef.current
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
    profiles,
    list,
    onSearch,
    selected,
    onSelect
  }
}

export default useProfiles
