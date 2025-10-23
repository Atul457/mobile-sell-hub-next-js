import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IUserAddress extends Document {
  userId: Schema.Types.ObjectId;
  country: string;
  city: string;
  fullName: string;
  nickName: string | null;
  addressLine1: string;
  addressLine2: string;
  state: string;
  postalCode: string;
  phone: {
    phone: string;
    code: string;
  } | null;
}

const UserAddressSchema: Schema<IUserAddress> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: { type: String, required: true },
    city: { type: String, required: true },
    fullName: { type: String, required: true },
    nickName: {
      type: String,
      default: null,
    },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: null },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: {
      _id: false,
      type: {
        phone: { type: String, required: true },
        code: { type: String, required: true },
      },
      default: null,
    },
  },
  { timestamps: true }
);

const UserAddessModel =
  (models.UserAddress as Model<IUserAddress>) ||
  model<IUserAddress>("UserAddress", UserAddressSchema, "userAddresses");

export default UserAddessModel;
