import { IReduxInitialKeyState, IReduxStatus } from '@/store/types'

const STATUS_LOADING: IReduxStatus = 'loading'

const DEFAULT_PAGE_LIMIT = 10

const REDUX = {
  STATUS: {
    IDLE: 'idle' as IReduxStatus,
    LOADING: 'loading' as IReduxStatus,
    FULFILLED: 'fulfilled' as IReduxStatus,
    FAILED: 'failed' as IReduxStatus
  },
  BASE_PAGINATION: {
    totalCount: 0,
    page: 1,
    query: null,
    sort: null,
    order: null,
    limit: DEFAULT_PAGE_LIMIT
  },
  DEFAULT_PAGE_LIMIT,
  INITIAL_KEY_STATE: {
    status: STATUS_LOADING,
    message: null
  } as IReduxInitialKeyState
}

export { REDUX }
