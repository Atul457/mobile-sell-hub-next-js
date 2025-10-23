import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IProfile } from '@/models/profile.model'
import { ProfileService } from '@/services/client/Profile.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialProfilesSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    profiles: IProfile[]
  }
}

type IProfilesAction = { type: 'GET'; payload: Partial<IInitialProfilesSliceState> }

type ICPaginationArgs = IPaginationArgs & {}

const initialProfilesState: IInitialProfilesSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    profiles: []
  }
}

function profilesReducer(state: IInitialProfilesSliceState, action: IProfilesAction) {
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

const useProfiles = (props?: IUserProfilesProps) => {
  const profilesRef = useRef(initialProfilesState)

  const [empty, setEmpty] = useState(false)
  const [userId] = useState(props?.userId ?? '')
  const [profiles, dispatch] = useReducer(profilesReducer, initialProfilesState)

  useEffect(() => {
    setEmpty(profiles.data.page === 1 && profiles.data.profiles.length === 0 && !profiles.data.query)
  }, [profiles.data])

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const ps = new ProfileService()
      const currentProfilesStateData = profilesRef.current.data

      const payload = {
        page: args.page ?? currentProfilesStateData.page,
        query: args.query ?? currentProfilesStateData.query,
        limit: args.limit ?? currentProfilesStateData.limit,
        sort: args.sort ?? currentProfilesStateData.sort,
        order: args.order ?? currentProfilesStateData.order,
        ...(userId && { userId })
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
          ...profiles.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          profiles: response.data?.profiles
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
    const profiles = [...profilesRef.current.data.profiles]
    profiles[index] = data
    profilesRef.current = {
      ...profilesRef.current,
      data: {
        ...profilesRef.current.data,
        profiles
      }
    }
    dispatch({
      type: 'GET',
      payload: profilesRef.current
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
    const profiles = [...profilesRef.current.data.profiles]
    profiles.splice(index, 1)
    profilesRef.current = {
      ...profilesRef.current,
      data: {
        ...profilesRef.current.data,
        profiles,
        totalCount: profilesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: profilesRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    profiles,
    list,
    delete: delete_
  }
}

export default useProfiles
