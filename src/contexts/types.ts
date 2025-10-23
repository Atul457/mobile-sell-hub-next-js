import { DialogProps } from '@mui/material'
import { ReactNode } from 'react'

import { IReduxStatus } from '@/store/types'

import { IUserCardTypes } from '@/models/card.model'
import { IChainOfCustody } from '@/models/custody.model'
import { IProfile } from '@/models/profile.model'
import { IRole, IRolePopulated } from '@/models/role.model'
import { IUser } from '@/models/user.model'
import { IUserCreatorMapping } from '@/models/userCreatorMapping.model'

type IBaseDialogProps = {
  onClose?: Function
  visible: boolean
}

export interface IInitialModalState {
  profiles:
  | ({
    visibility?: 'hidden' | 'visible' | null
  } & IBaseDialogProps)
  | null
  profile:
  | ({
    onAddProfile: (profile: IProfile) => void
  } & IBaseDialogProps)
  | null
  alert:
  | ({
    maxWidth?: DialogProps['maxWidth']
    heading: string
    description: string
    okButtonText?: string
    okButtonLoadingText?: string
    forDeletion?: boolean
    cancelButtonText?: string | null
    status: IReduxStatus
    onOkClick?: ((args?: any) => Promise<any>) | ((args?: any) => any) | null
    onCancelClick?: ((args?: any) => Promise<any>) | ((args?: any) => any) | null
  } & IBaseDialogProps)
  | null
  updatePassword: ({} & IBaseDialogProps) | null
  addUser:
  | ({
    visibility?: 'hidden' | 'visible' | null
    push?: (
      data: IUserCreatorMapping & {
        user: IUser
      }
    ) => void
    update?: (
      data: IUserCreatorMapping & {
        user: IUser
      }
    ) => void
    delete?: Function
    user?: IUserCreatorMapping & {
      user: IUser
    }
    editable?: boolean
  } & IBaseDialogProps)
  | null
  resetPassword:
  | ({
    token: string
    isInvitationToken?: boolean
  } & IBaseDialogProps)
  | null
  forgotPassword: ({} & IBaseDialogProps) | null
  info:
  | ({
    html: ReactNode
    heading: string
    okButtonText?: string
    cancelButtonText?: string | null
    hidecancelbtn?: boolean
    onOkClick?: ((args?: any) => any) | null
    onCancelClick?: ((args?: any) => any) | null
  } & IBaseDialogProps)
  | null
  addCard:
  | ({
    push: (data: IUserCardTypes) => void
  } & IBaseDialogProps)
  | null
  addCustody:
  | ({
    custodyData?: any
    reportId: string
    editable: boolean
    push?: (data: IChainOfCustody) => void
    update?: (data: IChainOfCustody) => void
  } & IBaseDialogProps)
  | null
  manageQrs:
  | ({
    type: 'generate' | 'import'
    onGenerate: Function
  } & IBaseDialogProps)
  | null
  manageReports:
  | ({
    type: 'generate' | 'import'
    onGenerate: Function
  } & IBaseDialogProps)
  | null
  manageRoles:
  | ({
    data?: IRolePopulated
    onCreate: Function
    onUpdate: Function
    view?: boolean
    type: IRole['type']
    defaultAdminRole?: IRole['defaultAdminRole']
  } & IBaseDialogProps)
  | null
}

export type ModalType = keyof IInitialModalState

export type ModalPropsMap = {
  [K in keyof IInitialModalState]: Exclude<IInitialModalState[K], null>
}
export type IModalContext = {
  resetModalsState: () => void
  openModal: <T extends ModalType>(args: { type: T; props: ModalPropsMap[T] }) => void
  modals: IInitialModalState
  closeModal: (args: ModalType) => void
}
