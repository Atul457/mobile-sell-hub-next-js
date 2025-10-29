import { Document, Model, model, models, Schema, Types } from "mongoose";

export interface IShopRegister extends Document {
  storeName: string;
  slug: string;
  userId: Types.ObjectId;

  business: {
    companyName: string;
    companyNumber: string;
    addressStreet: string;
    addressSuburb: string;
    addressCity: string;
    addressPostcode: string;
    businessEmail: string;
    businessPhone: string;
  };

  admin: {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    mobile: string;
    password: string;
  };

  directors: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    mobile: string;
  }[];

  subscription: {
    plan: string;
    paymentMethod: string;
    billingName: string;
    billingEmail: string;
    billingAddress: string;
    termsAccepted: boolean;
  };
}

const ShopRegisterSchema: Schema<IShopRegister> = new Schema(
  {
    storeName: { type: String, required: true, unique: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    business: {
      companyName: { type: String, required: true },
      companyNumber: { type: String, required: true },
      addressStreet: { type: String, required: true },
      addressSuburb: { type: String, required: true },
      addressCity: { type: String, required: true },
      addressPostcode: { type: String, required: true },
      businessEmail: { type: String, required: true },
      businessPhone: { type: String, required: true },
    },

    admin: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      role: { type: String },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      password: { type: String, required: true },
    },

    directors: [
      {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
      },
    ],

    subscription: {
      plan: { type: String, required: true },
      paymentMethod: { type: String, required: true },
      billingName: { type: String, required: true },
      billingEmail: { type: String, required: true },
      billingAddress: { type: String, required: true },
      termsAccepted: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const ShopRegisterModel =
  (models?.ShopRegister as Model<IShopRegister>) ||
  model<IShopRegister>("ShopRegister", ShopRegisterSchema, "shop_register");

export default ShopRegisterModel;
