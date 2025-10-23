import { Document, Model, model, models, Schema } from 'mongoose'

type IRolePermissionActions = 'create' | 'read' | 'update' | 'delete'

export interface IRolePermission extends Document {
  /** @info 1 => ADMIN, 2 => MANAGER, 3 => STAFF, 4 => TEST ADMINISTRATOR */
  role?: 1 | 2 | 3 | 4
  roleId: Schema.Types.ObjectId
  module: 'user' | 'transaction' | 'qr' | 'report' | 'role' | 'package' | 'profile' | 'test'
  actions: IRolePermissionActions[]
}

const RolePermissionSchema: Schema<IRolePermission> = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    role: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true
    },
    module: {
      type: String,
      enum: ['user', 'transaction', 'qr', 'report', 'role', 'package', 'profile', 'test'],
      required: true
    },
    actions: {
      type: [String],
      enum: ['create', 'read', 'update', 'delete'],
      required: true
    }
  },
  { timestamps: true }
)

const RolePermissionModel =
  (models?.RolePermission as Model<IRolePermission>) ||
  model<IRolePermission>('RolePermission', RolePermissionSchema, 'rolePermissions')

export default RolePermissionModel
