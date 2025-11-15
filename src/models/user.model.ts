import { Document, Model, model, models, Schema } from 'mongoose';

import { IRolePermission } from './role-permission.model';
import { IShopRegister } from './shop-register.model';

export interface IBaseUser {
    firstName: string;
    lastName: string;
    email: string;
    stripeCustomerId: string | null;
    password: string | null;
    /** @info 1 => ADMIN, 2 => Shop Owner */
    type: 1 | 2;
    role?: IRolePermission['role'];
    roleId?: IRolePermission['roleId'];
    shopId?: Schema.Types.ObjectId;
    /** @info 0 => IN_ACTIVE, 1 => ACTIVE, 2 => DELETED, 3 => PENDING */
    status: 0 | 1 | 2 | 3;
    creatorId?: string;
    address: string | null;
    phoneNumber: string;
    profilePicture: string | null;
}

export interface IUserPopulated extends IBaseUser, Document {
    shop?: IShopRegister;
}

export interface IUser extends IBaseUser, Document {}

const UserSchema: Schema<IUser> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, default: null },
        stripeCustomerId: { type: String, default: null },
        type: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], required: true },
        status: { type: Number, enum: [0, 1, 2, 3], default: 1 },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopRegister'
        },
        role: { type: Number, enum: [1, 2, 3, 4] },
        address: { type: String, default: null },
        phoneNumber: { type: String },
        profilePicture: { type: String, default: null }
    },
    { timestamps: true }
);

const UserModel = (models?.User as Model<IUser>) || model<IUser>('User', UserSchema, 'users');

export default UserModel;
