import { Document, Model, model, models, Schema } from 'mongoose'

import { IRolePermission } from './rolePermission.model'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  stripeCustomerId: string | null
  password: string | null
  /** @info 1 => ADMIN, 2 => INDIVIDUAL, 3 => CORPORATE_EMPLOYER, 4 => THIRD_PARTY_ADMINISTRATOR, 5 => GOVT_ORGANISATION, 6 => ORGANIZATION_SUB_USER , 7 => Sub Admin*/
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7
  role?: IRolePermission['role']
  roleId?: IRolePermission['roleId']
  /** @info 1 => DIRECTOR, 2 => MANAGER, 3 => TEST ADMINISTRATOR */
  designation?: 1 | 2 | 3
  /** @info 0 => IN_ACTIVE, 1 => ACTIVE, 2 => DELETED, 3 => PENDING */
  status: 0 | 1 | 2 | 3
  creatorId?: string
  organizationName?: string
  address: string | null
  addressMeta?: {
    lat: number | null
    long: number | null
    appartment: string | null
    city: string
    state: string
    country: string | null
    zipCode: string
  }
  phoneNumber: string
  profilePicture: string | null
}

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: null },
    stripeCustomerId: { type: String, default: null },
    type: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], required: true },
    designation: { type: Number, enum: [1, 2, 3] },
    status: { type: Number, enum: [0, 1, 2, 3], default: 1 },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    role: { type: Number, enum: [1, 2, 3, 4] },
    organizationName: { type: String },
    address: { type: String, default: null },
    addressMeta: {
      type: {
        lat: { type: Number, default: null },
        long: { type: Number, default: null },
        appartment: { type: String, default: null },
        state: { type: String, default: '' },
        city: { type: String, default: '' },
        zipCode: { type: String, default: '' },
        country: { type: String, default: null }
      },
      _id: false
    },
    phoneNumber: { type: String },
    profilePicture: { type: String, default: null }
  },
  { timestamps: true }
)

const UserModel = (models?.User as Model<IUser>) || model<IUser>('User', UserSchema, 'users')

export default UserModel
