import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { IPackagePopulated } from '@/models/package.model'
import { PackageService } from '@/services/client/Package.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialPackagesSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    packages: IPackagePopulated[]
    status: IPackagePopulated['status'] | -1
  }
}

type IPackagesAction = { type: 'GET'; payload: Partial<IInitialPackagesSliceState> }

type ICPaginationArgs = IPaginationArgs & {
  status: IPackagePopulated['status'] | -1
}

const initialPackagesState: IInitialPackagesSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    packages: [],
    status: -1
  }
}

function packagesReducer(state: IInitialPackagesSliceState, action: IPackagesAction) {
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

const usePackages = () => {
  const packagesRef = useRef(initialPackagesState)
  const [empty, setEmpty] = useState(false)
  const [packages, dispatch] = useReducer(packagesReducer, initialPackagesState)

  useEffect(() => {
    setEmpty(packages.data.page === 1 && packages.data.packages.length === 0 && !packages.data.query)
  }, [packages.data])

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const us = new PackageService()
      const currentPackagesStateData = packagesRef.current.data

      const payload = {
        page: args.page ?? currentPackagesStateData.page,
        query: args.query ?? currentPackagesStateData.query,
        limit: args.limit ?? currentPackagesStateData.limit,
        sort: args.sort ?? currentPackagesStateData.sort,
        order: args.order ?? currentPackagesStateData.order,
        status: args.status ?? currentPackagesStateData.status
      }

      packagesRef.current = {
        ...packagesRef.current,
        status: 'loading',
        data: {
          ...packagesRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: packagesRef.current
      })

      const response = await us.list(payload)

      packagesRef.current = {
        ...packagesRef.current,
        status: 'fulfilled',
        data: {
          ...packages.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          packages: response.data?.packages
        }
      }

      dispatch({
        type: 'GET',
        payload: packagesRef.current
      })
    } catch (error) {
      packagesRef.current = {
        ...packagesRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: packagesRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: IPackagePopulated) => {
    packagesRef.current = {
      ...packagesRef.current,
      data: {
        ...packages.data,
        packages: [data, ...packagesRef.current.data.packages],
        totalCount: packagesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: packagesRef.current
    })
  }

  const update = (packagesId: string, data: IPackagePopulated) => {
    const packages = [...packagesRef.current.data.packages]
    packages[packages.findIndex(r => r._id === packagesId)] = data
    packagesRef.current = {
      ...packagesRef.current,
      data: {
        ...packagesRef.current.data,
        packages
      }
    }
    dispatch({
      type: 'GET',
      payload: packagesRef.current
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
    const packages = [...packagesRef.current.data.packages]
    packages.splice(index, 1)
    packagesRef.current = {
      ...packagesRef.current,
      data: {
        ...packagesRef.current.data,
        packages,
        totalCount: packagesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: packagesRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    packages,
    list,
    delete: delete_
  }
}

export default usePackages
