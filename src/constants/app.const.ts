const isLocalStorageEnv = process.env.NEXT_PUBLIC_FILE_STORAGE_ENVIONMENT !== 'production'

const S3_CDN_ENDPOINT = process.env.S3_CDN_ENDPOINT ?? ''

const NEXT_PUBLIC_APP_HOSTNAME_WITH_PORT = process.env.NEXT_PUBLIC_APP_PROD_HOSTNAME
const NEXT_PUBLIC_APP_HOSTNAME = NEXT_PUBLIC_APP_HOSTNAME_WITH_PORT?.replace(/:[\d]+/gi, '')
const STORAGE_PATH = isLocalStorageEnv
  ? `${NEXT_PUBLIC_APP_HOSTNAME}/${process.env.NEXT_PUBLIC_PROD_APP_PREFIX}`
  : S3_CDN_ENDPOINT

type IBooleanStatus = 0 | 1

const YES = {
  LABEL: 'Yes',
  VALUE: 1 as IBooleanStatus
}

const NO = {
  LABEL: 'No',
  VALUE: 0 as IBooleanStatus
}

export const APP_CONST = {
  PLATFORM_FEES: 0,
  DASHBOARD: {},
  isLocalStorageEnv,
  PLACEHOLDER_IMAGE: '/favicon.svg',
  CONFIG: {
    STORAGE_PATH
  },
  DATE: {
    DATE_FORMAT: 'dd MMM yyyy'
  },
  VALUE_NOT_PROVIDED: 'N/A',
  BOOLEAN_STATUS: {
    YES: YES.VALUE,
    NO: NO.VALUE
  },
  NUMERIC_BOOLEAN_STATUS: {
    1: YES.LABEL,
    0: NO.LABEL
  },
  OBJECT_BOOLEAN_STATUSES: {
    YES,
    NO
  }
}
