import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  type: 1 | 2;
  profileCompleted: boolean;
  profilePicture: string | null;
  slug: string;
  stripeCustomerId?: string
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    countryCode: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: Number, enum: [1, 2], required: true },
    profilePicture: { type: String, default: null },
    profileCompleted: { type: Boolean, default: false },
    slug: { type: String, required: true },
    stripeCustomerId: { type: String, default: null }
  },
  { timestamps: true }
);

const UserModel =
  (models?.User as Model<IUser>) || model<IUser>("User", UserSchema, "users");

export default UserModel;
