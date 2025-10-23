import { IRolePermission } from '@/models/rolePermission.model'

type IUploadUserProfilePictureArgs = {
  file: File | null
  accessToken?: string
}

type IResetPasswordArgs = {
  password: string
  accessToken: string
}

type IGetPackageArgs = {
  qr: string
}

export type IActionValidator = {
  module: IRolePermission['module']
  action: IRolePermission['actions'][0]
  roleId: IRolePermission['roleId'] | null
  throw?: boolean
}

type IUploadUserProfilePicture = (data: IUploadUserProfilePictureArgs) => Promise<any>

export type IUserServiceTypes = {
  IResetPasswordArgs: IResetPasswordArgs
  IUploadUserProfilePicture: IUploadUserProfilePicture
  IUploadUserProfilePictureArgs: IUploadUserProfilePictureArgs
}

export type IPackageServiceTypes = {
  IGetPackageArgs: IGetPackageArgs
}

export interface IPaginationArgs {
  query?: string | null
  page: number
  limit: number
  sort?: string | null
  order?: 'asc' | 'desc' | null
}
