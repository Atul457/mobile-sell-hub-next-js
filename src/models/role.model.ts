import { Document, Model, model, models, Schema } from 'mongoose'

import { IRolePermission } from './rolePermission.model'
import { IUser } from './user.model'

export interface IRole extends Document {
  name: string
  /** @info 2 => Shop, 1 => Admin */
  type: 2 | 1
  roleId: IUser['role']
  defaultShopRole?: boolean
  defaultAdminRole?: boolean
  usersCount: number
}

export interface IRolePopulated extends IRole {
  permissions: {
    module: IRolePermission['module']
    actions: IRolePermission['actions']
  }[]
  cpermissions: Record<IRolePermission['module'], IRolePermission['actions']>
  createdAt: Date | string
  updatedAt: Date | string
}

const RoleSchema: Schema<IRole> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    usersCount: {
      type: Number,
      default: 0
    },
    defaultShopRole: {
      type: Boolean
    },
    defaultAdminRole: {
      type: Boolean
    },
    type: {
      type: Number,
      enum: [2, 1],
      required: true
    },
    roleId: { type: Number, enum: [1, 2, 3, 4] }
  },
  { timestamps: true }
)

const RoleModel = (models?.Role as Model<IRole>) || model<IRole>('Role', RoleSchema, 'roles')

export default RoleModel
