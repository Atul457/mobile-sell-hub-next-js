import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IBasePagination, IReduxInitialKeyState } from '@/store/types'

import { ICategory } from '@/models/category.model'
import { CategoryService } from '@/services/client/Category.service'
import { IPaginationArgs } from '@/services/types'
import { utils } from '@/utils/utils'

export interface IInitialCategoriesSliceState extends IReduxInitialKeyState {
  data: IBasePagination & {
    categories: ICategory[]
    status: ICategory['status'] | -1
  }
}

type ICategoriesAction = { type: 'GET'; payload: Partial<IInitialCategoriesSliceState> }

type ICPaginationArgs = IPaginationArgs & {
  status: ICategory['status'] | -1
}

const initialCategoriesState: IInitialCategoriesSliceState = {
  ...utils.CONST.REDUX.INITIAL_KEY_STATE,
  data: {
    ...utils.CONST.REDUX.BASE_PAGINATION,
    categories: [],
    status: -1
  }
}

function categoriesReducer(state: IInitialCategoriesSliceState, action: ICategoriesAction) {
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

const useCategories = () => {
  const categoriesRef = useRef(initialCategoriesState)
  const [empty, setEmpty] = useState(false)
  const [categories, dispatch] = useReducer(categoriesReducer, initialCategoriesState)

  useEffect(() => {
    setEmpty(categories.data.page === 1 && categories.data.categories.length === 0 && !categories.data.query)
  }, [categories.data])

  const list = useCallback(async (args: Partial<ICPaginationArgs>) => {
    try {
      const cs = new CategoryService()
      const currentCategoriesStateData = categoriesRef.current.data

      const payload = {
        page: args.page ?? currentCategoriesStateData.page,
        query: args.query ?? currentCategoriesStateData.query,
        limit: args.limit ?? currentCategoriesStateData.limit,
        sort: args.sort ?? currentCategoriesStateData.sort,
        order: args.order ?? currentCategoriesStateData.order,
        status: args.status ?? currentCategoriesStateData.status
      }

      categoriesRef.current = {
        ...categoriesRef.current,
        status: 'loading',
        data: {
          ...categoriesRef.current.data,
          ...payload
        }
      }

      dispatch({
        type: 'GET',
        payload: categoriesRef.current
      })

      const response = await cs.list(payload)

      categoriesRef.current = {
        ...categoriesRef.current,
        status: 'fulfilled',
        data: {
          ...categories.data,
          ...payload,
          limit: response.data?.limit,
          order: response.data?.order ?? payload.order,
          sort: response.data?.sort ?? payload.sort,
          page: response.data?.page ?? payload.page,
          totalCount: response.data?.totalCount,
          categories: response.data?.categories
        }
      }

      dispatch({
        type: 'GET',
        payload: categoriesRef.current
      })
    } catch (error) {
      categoriesRef.current = {
        ...categoriesRef.current,
        status: 'failed'
      }

      dispatch({
        type: 'GET',
        payload: categoriesRef.current
      })

      utils.toast.error({
        message: utils.error.getMessage(error)
      })
    }
  }, [])

  const push = (data: ICategory) => {
    categoriesRef.current = {
      ...categoriesRef.current,
      data: {
        ...categories.data,
        categories: [data, ...categoriesRef.current.data.categories],
        totalCount: categoriesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: categoriesRef.current
    })
  }

  const update = (categoryId: string, data: ICategory) => {
    const categories = [...categoriesRef.current.data.categories]
    categories[categories.findIndex(r => r._id === categoryId)] = data
    categoriesRef.current = {
      ...categoriesRef.current,
      data: {
        ...categoriesRef.current.data,
        categories
      }
    }
    dispatch({
      type: 'GET',
      payload: categoriesRef.current
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
    const categories = [...categoriesRef.current.data.categories]
    categories.splice(index, 1)
    categoriesRef.current = {
      ...categoriesRef.current,
      data: {
        ...categoriesRef.current.data,
        categories,
        totalCount: categoriesRef.current.data.totalCount + 1
      }
    }
    dispatch({
      type: 'GET',
      payload: categoriesRef.current
    })
  }

  return {
    empty,
    update,
    push,
    onSearch,
    categories,
    list,
    delete: delete_
  }
}

export default useCategories
