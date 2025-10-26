import { Document, Model, model, models, Schema } from "mongoose";

export interface IShopRegister extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  storeName: string;
  slug: string;
  password: string;
  image?: string | null;
  status: 0 | 1 | 2;
}

const ShopRegisterSchema: Schema<IShopRegister> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    storeName: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    image: { type: String, default: null },
    status: { type: Number, enum: [0, 1, 2], default: 1 }
  },
  { timestamps: true }
);

const ShopRegisterModel =
  (models?.ShopRegister as Model<IShopRegister>) ||
  model<IShopRegister>("ShopRegister", ShopRegisterSchema, "shop_register");

export default ShopRegisterModel;
