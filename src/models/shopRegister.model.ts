import { Document, Model, model, models, Schema, Types } from "mongoose";

export interface IShopRegister extends Document {
  storeName: string;
  slug: string;
  userId: Types.ObjectId;
}

const ShopRegisterSchema: Schema<IShopRegister> = new Schema(
  {
    storeName: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // ✅ Reference to User collection
      required: true,
    },
  },
  { timestamps: true }
);

const ShopRegisterModel =
  (models?.ShopRegister as Model<IShopRegister>) ||
  model<IShopRegister>("ShopRegister", ShopRegisterSchema, "shop_register");

export default ShopRegisterModel;
