import { GridColDef } from '@mui/x-data-grid'
import clsx from 'clsx'
import type { HL7Field, HL7Message, HL7Segment } from 'simple-hl7'

import { ICommonChipProps } from '@/components/common/CommonChip'

import themeConfig from '@/configs/themeConfig'
import { CONST } from '@/constants'
import { IQr } from '@/models/qr.model'
import { IReport } from '@/models/report.model'
import { IRolePopulated } from '@/models/role.model'
import { IRolePermission } from '@/models/rolePermission.model'
import { ITransaction } from '@/models/transaction.model'
import { IUser } from '@/models/user.model'
import FileValidatorService from '@/services/FileValidator.service'
import { file as fileUtil } from '@/utils/file'

import { date as dateUtil } from './date'
import { string } from './string'
import { toast } from './toast'

type IProfilePictureChangeArgs = {
  e: React.ChangeEvent<HTMLInputElement>
  setProfilePicture: Function
  setConverting: Function
}

type IGetFieldValueOptions = {
  joinWith?: string
  joinWithIndexed?: Record<number, string>
  replacers?: Record<string, string>
  blocksToSkip?: {
    start?: number
    end?: number
  }
  log?: boolean
}

const USER_STATUSES = CONST.USER.STATUS
const REPORT_STATUSES = CONST.REPORT.STATUS
const QR_STATUSES = CONST.QR.STATUS
const TRANSACTION_STATUSES = CONST.TRANSACTION.STATUS

const getFullName = (args: { firstName: IUser['firstName']; lastName: IUser['lastName'] }) => {
  return [string.capitalizeFirstLetter(args?.firstName?.trim?.() ?? ''), args?.lastName?.trim?.()].join(' ')
}

function generatePid(c: number, includeLowerCase = false): string {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  if (includeLowerCase) {
    chars += 'abcdefghijklmnopqrstuvwxyz'
  }
  let pid = ''
  for (let i = 0; i < c; i++) {
    pid += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pid
}

const getStoredEntityUrl = (path: any) => {
  const STORAGE_PATH = CONST.APP_CONST.CONFIG.STORAGE_PATH
  const path_ = path ? `${STORAGE_PATH}${path}` : undefined
  return path_
}

// ** Converts table to CSV
export const convertArrayOfObjectsToCSV = (array: any[]) => {
  let result = ''

  const columnDelimiter = ','
  const lineDelimiter = '\n'
  const keys = Object.keys(array[0])

  result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  array.forEach(item => {
    let ctr = 0
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter

      result += item[key]

      ctr++
    })
    result += lineDelimiter
  })

  return result
}

const profilePictureChange = async (args: IProfilePictureChangeArgs) => {
  let updated = false
  try {
    let file = args.e.target.files?.[0] ?? null
    args.e.target.value = ''

    const { MAX_PROFILE_PICTURE_SIZE, VALID_PROFILE_PICTURE_TYPES } = CONST.USER

    if (!file) {
      return updated
    }

    const response = await FileValidatorService.validateFileData(
      { file },
      {
        maxFileSize: fileUtil.convertValue(MAX_PROFILE_PICTURE_SIZE, 'MB', 'B'),
        validFileTypes: VALID_PROFILE_PICTURE_TYPES
      }
    )

    if (response.message) {
      toast.info({ message: response.message })
      return updated
    }

    args.setConverting(true)

    const base64 = await fileUtil.fileObjToBase64(file)
    args.setProfilePicture({
      src: base64 as string,
      file
    })

    updated = true
  } catch (error) {
    console.error(error)
  } finally {
    args.setConverting(false)
  }
}

const checkIsOrganiation = (type: IUser['type']) => {
  return (
    type === CONST.USER.TYPES.CORPORATE_EMPLOYER ||
    type === CONST.USER.TYPES.GOVT_ORGANISATION ||
    type === CONST.USER.TYPES.ORGANIZATION_SUB_USER
  )
}

const checkSubAdmin = (type: IUser['type']) => {
  return (
    type === CONST.USER.TYPES.SUB_ADMIN
  )
}

const checkAdmin = (type: IUser['type']) => {
  return (
    type === CONST.USER.TYPES.ADMIN
  )
}


const formatAddress = (addressMeta?: Partial<IUser['addressMeta']>): IUser['addressMeta'] => {
  let addressMeta_ = (addressMeta ?? {}) as IUser['addressMeta']
  return {
    city: addressMeta_?.city ?? '',
    appartment: addressMeta_?.appartment ?? null,
    country: addressMeta_?.country ?? null,
    state: addressMeta_?.state ?? '',
    zipCode: addressMeta_?.zipCode ?? '',
    lat: addressMeta_?.lat ?? null,
    long: addressMeta_?.long ?? null
  }
}

const getUserDetails = (user: IUser, forJwt = false) => {
  const isOrganization = checkIsOrganiation(user.type)

  let commonKeysValues: Partial<IUser> = {
    type: user.type,
    profilePicture: user.profilePicture ?? null,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  }

  if (!forJwt) {
    commonKeysValues['address'] = user.address ?? null
    commonKeysValues['phoneNumber'] = user.phoneNumber
    commonKeysValues['addressMeta'] = formatAddress(user.addressMeta)
    commonKeysValues['designation'] = user.designation
    commonKeysValues['status'] = user.status
    commonKeysValues['role'] = user.role
    if (isOrganization) {
      commonKeysValues['organizationName'] = user.organizationName
    }
  } else {
    commonKeysValues['id'] = user._id
  }

  return commonKeysValues
}

const getUserStatusVariant = (status: IUser['status']): ICommonChipProps['variant'] => {
  const { PENDING, ACTIVE, INACTIVE } = USER_STATUSES
  switch (true) {
    case status === INACTIVE:
      return 'error'
    case status === PENDING:
      return 'yellow'
    case status === ACTIVE:
      return 'success'
    default:
      return 'error'
  }
}

const getReportStatusVariant = (status: IReport['status']): ICommonChipProps['variant'] => {
  const { PENDING, DRAFT, SUBMITTED, CHECKED } = REPORT_STATUSES
  switch (true) {
    case PENDING === status:
      return 'yellow'
    case DRAFT === status:
      return 'amber'
    case SUBMITTED === status:
      return 'cyan'
    case CHECKED === status:
      return 'success'
    default:
      return 'error'
  }
}
const getQrStatusVariant = (status: IQr['status']): ICommonChipProps['variant'] => {
  const { ACTIVE, USED } = QR_STATUSES
  switch (true) {
    case status === ACTIVE:
      return 'yellow'
    case status === USED:
      return 'success'
    default:
      return 'error'
  }
}

const getTransactionStatusVariant = (status: ITransaction['status']): ICommonChipProps['variant'] => {
  const {
    CANCEL,
    SUCCEEDED,
    PROCESSING,
    REQUIRES_ACTION,
    REQUIRES_CONFIRMATION,
    REQUIRES_PAYMENT_METHOD,
    REQUIRES_CAPTURE
  } = TRANSACTION_STATUSES
  switch (true) {
    case status === CANCEL:
      return 'error'
    case status === SUCCEEDED:
      return 'success'
    case status === PROCESSING:
      return 'primary'
    case status === REQUIRES_ACTION:
      return 'yellow'
    case status === REQUIRES_CONFIRMATION:
      return 'yellow'
    case status === REQUIRES_PAYMENT_METHOD:
      return 'yellow'
    case status === REQUIRES_CAPTURE:
      return 'yellow'
    default:
      return 'error'
  }
}

const getSegmentsFromHl7Message = (hl7Message: HL7Message, name: string) => {
  return hl7Message.segments.find(segment => {
    return segment.name === name
  })
}

const getObxSegments = (hl7Message: HL7Message) => {
  return hl7Message.segments.reduce((acc, segment) => {
    if (segment.name === 'OBX' || segment.name === 'NTE') {
      acc.push(segment)
    }
    return acc
  }, [] as HL7Segment[])
}

const getReportIdentifier = (qr: IQr) => {
  return `${qr.qrCode}`
}

function formatHl7Date(dateString: string) {
  if (!dateString) {
    return ''
  }
  const year = parseInt(dateString.slice(0, 4))
  const month = parseInt(dateString.slice(4, 6)) - 1
  const day = parseInt(dateString.slice(6, 8))
  const date = new Date(year, month, day)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return dateUtil.formatDate(date.toLocaleDateString('en-US', options))
}

const getFieldValue = (field: any, options?: IGetFieldValueOptions) => {
  let joinWith = options?.joinWith
  const blocksToSkipFromStart = (options?.blocksToSkip?.start ?? 0) - 1
  return ((field?.value?.[0] as unknown as HL7Field[]) ?? [])?.reduce((acc, field, index) => {
    joinWith = options?.joinWithIndexed?.[index] ?? options?.joinWith ?? '-'
    if (blocksToSkipFromStart < index)
      if (field?.value?.[0]) {
        if (!acc) {
          acc += field.value?.[0]
        } else {
          acc += `${joinWith}${field.value?.[0]}`
        }
      } else if (typeof field?.value?.[0] === 'string') {
        acc += `${joinWith}${field.value?.[0]}`
      }
    // if (options?.log) {
    //     console.debug({
    //         acc,
    //         "field.value?.[0]": field.value?.[0]
    //     })
    // }
    return acc
  }, '')
}

function getValue(value: any): any {
  return value ? value : CONST.APP_CONST.VALUE_NOT_PROVIDED
}

const extractAddressDetails = (place: google.maps.places.PlaceResult) => {
  let city: string | null = null
  let route: string | null = null
  let country: string | null = null
  let postal_code: string | null = null
  let country_code: string | null = null
  let administrative_area_level_1: string | null = null
  let administrative_area_level_2: string | null = null
  let components = place?.address_components ?? []
  let { lat: latFn, lng } = place.geometry?.location ?? {}
  let lat = latFn?.() ?? null
  let long = lng?.() ?? null

  for (let i = 0; i < components.length; i++) {
    let component = components[i]
    if (component.types.includes('country')) {
      country = component.long_name
      country_code = component.short_name
    } else if (component.types.includes('postal_code')) {
      postal_code = component.long_name
    } else if (component.types.includes('locality')) {
      city = component.long_name
    } else if (component.types.includes('route')) {
      route = component.long_name
    } else if (component.types.includes('administrative_area_level_1')) {
      administrative_area_level_1 = component.long_name
    } else if (component.types.includes('administrative_area_level_2')) {
      administrative_area_level_2 = component.long_name
    }
  }

  return {
    lat,
    long,
    country,
    postal_code,
    country_code,
    city,
    route,
    administrative_area_level_1,
    administrative_area_level_2,
    formatted_address: place?.formatted_address ?? '',
    location: place?.geometry?.location ?? '',
    place_id: place?.place_id ?? ''
  }
}
const rolePermissionsArrayToObject = (permissions: IRolePermission[]): IRolePopulated['cpermissions'] => {
  const permissions_: IRolePopulated['cpermissions'] = permissions.reduce(
    (acc: IRolePopulated['cpermissions'], curr: IRolePermission) => {
      const module_ = curr.module
      acc[module_] = curr.actions
      return acc
    },
    {} as IRolePopulated['cpermissions']
  )
  return permissions_
}


const getPermissions = (module_: keyof IRolePopulated["cpermissions"], permissions: Partial<IRolePopulated["cpermissions"]>) => {
  return {
    create: permissions[module_]?.includes("create") ?? false,
    update: permissions[module_]?.includes("update") ?? false,
    read: permissions[module_]?.includes("read") ?? false,
    delete: permissions[module_]?.includes("delete") ?? false,
  }
}

const getDataGridColumnsWithSpaces = <T extends {}>(columns: GridColDef<T>[]): GridColDef<T>[] => {
  const { fHeaderClass, lHeaderClass, fHeaderContentClass, lHeaderContentClass } = themeConfig.components.grid
  return columns.map((column, index) => {
    if (!index || index === columns.length - 1) {
      return {
        ...column,
        headerClassName: clsx(column.headerClassName, !index ? fHeaderClass : lHeaderClass),
        cellClassName: clsx(column.cellClassName, !index ? fHeaderContentClass : lHeaderContentClass)
      }
    }
    return column
  })
}
const user = {
  checkIsOrganiation,
  checkSubAdmin,
  checkAdmin,
  getUserStatusVariant,
  getUserDetails,
  getFullName,
  profilePictureChange,
  formatAddress
}

const qr = {
  getQrStatusVariant
}

const role = {
  rolePermissionsArrayToObject,
  getPermissions
}

const transaction = {
  getTransactionStatusVariant
}

const report = {
  getObxSegments,
  formatHl7Date,
  getFieldValue,
  getReportIdentifier,
  getReportStatusVariant,
  getSegmentsFromHl7Message
}

const profiles = {
  generatePid
}

const helpers = {
  getDataGridColumnsWithSpaces,
  user,
  qr,
  role,
  transaction,
  getStoredEntityUrl,
  getValue,
  report,
  profiles,
  convertArrayOfObjectsToCSV,
  extractAddressDetails
}

export { helpers }
